import { globalNav } from '../AppNavigator';
import { PUSH_NEW_ROUTE, POP_ROUTE, POP_TO_ROUTE, REPLACE_ROUTE, REPLACE_OR_PUSH_ROUTE } 
from '../constants';
import { REHYDRATE } from 'redux-persist/constants';


const initialState = {
  routes: ['login']
};

export default function (state = initialState, action) {

  // console.log(state, "route state *()*(*&77");
  if (action.type === PUSH_NEW_ROUTE) {
    // console.log(action.route, "route");
    globalNav.navigator.push({ id: action.route });
    return {
      routes: [...state.routes, action.route]
    };
  }

  if (action.type === REPLACE_ROUTE) {
    globalNav.navigator.replaceWithAnimation({ id: action.route });
    const routes = state.routes;
    routes.pop();
    return {
      routes: [...routes, action.route]
    };
  }

  // For sidebar navigation
  if (action.type === REPLACE_OR_PUSH_ROUTE) {
    let routes = state.routes;

    if (routes[routes.length - 1] == 'home') {
      // If top route is home and user navigates to a route other than home, then push
      if (action.route != 'home')
        globalNav.navigator.push({ id: action.route });
      // If top route is home and user navigates to home, do nothing
      else
        routes = [];
    }

    else {
      if (action.route == 'home') {
        globalNav.navigator.resetTo({ id: 'home' });
        routes = [];
      }
      else {
        globalNav.navigator.replaceWithAnimation({ id: action.route });
        routes.pop();
      }
    }

    return {
      routes: [...routes, action.route]
    };
  }

  if (action.type === POP_ROUTE) {
    globalNav.navigator.pop();
    const routes = state.routes;
    routes.pop();
    return {
      routes
    };
  }

  if (action.type === POP_TO_ROUTE) {
    globalNav.navigator.popToRoute({ id: action.route });
    const routes = state.routes;
    while (routes.pop() !== action.route) {}
    return {
      routes: [...routes, action.route]
    };
  }

  if (action.type === REHYDRATE) {
    const savedData = action['payload']['route'] || state;
    return {
      ...savedData
    };
  }

  return state;
}
