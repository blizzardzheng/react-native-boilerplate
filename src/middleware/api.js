import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { bindActionCreators } from 'redux';
import 'isomorphic-fetch';
import merge from 'lodash.merge';


// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, schema, options, isFake, mapResult, isJSON) {
  const API_ROOT = isFake ? '/data/' : 'http://test.com';
  const fullUrl = (endpoint.indexOf('http://') === -1)
    ? API_ROOT + endpoint
    : endpoint;
  const customOptions = merge({}, options, {
    method: isFake ? 'get' : options && options.method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    }
  });
  if (isJSON) {
    customOptions.headers.Accept = 'application/json';
    customOptions.headers['Content-Type'] = 'application/json';
  }
  return fetch(fullUrl, customOptions)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok || !json.success) {
        return Promise.reject(json);
      }

      if (mapResult) {
        json = mapResult(json);
      }

      const camelizedJson = camelizeKeys(json);
      if (schema && typeof(schema) === 'function') {
        return normalize(camelizedJson, schema(camelizedJson));
      } else if (schema) {
        return normalize(camelizedJson, schema);
      }
      return camelizedJson;
    })
    .catch(e => Promise.reject(e));
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const { [CALL_API]: callAPI, ...otherAction } = action;
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const {
    schema,
    types,
    options,
    isFake = false,
    isJSON = true,
    mapResult,
    nextAction,
    nextActionFailed,
  } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  // if (!schema) {
  //   throw new Error('Specify one of the exported Schemas.');
  // }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const [requestType, successType, failureType] = types;
  function actionWith(data) {
    const finalAction = { ...otherAction, ...data, fetchTypes: types };
    return finalAction;
  }

  next(actionWith({ type: requestType }));

  return callApi(endpoint, schema, options, isFake, mapResult, isJSON)
  .then(response => {
    next(actionWith({
      response,
      type: successType,
    }));
  })
  .then(() => {
    if (nextAction) {
      bindActionCreators(nextAction, store.dispatch)();
    }
  })
  .catch(error => {
    next(actionWith({
      type: failureType,
      error: error || new Error('Something bad happened')
    }));
    if (nextActionFailed) {
      bindActionCreators(nextActionFailed, store.dispatch)();
    }
  });
};
