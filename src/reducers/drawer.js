import { OPEN_DRAWER, CLOSE_DRAWER, ENABLE_DRAWER, DISABLE_DRAWER } from '../constants';

const initialState = {
  drawerState: 'closed',
  drawerDisabled: true
};

export default function (state = initialState, action) {
  if (action.type === OPEN_DRAWER) {
    return {
      ...state,
      drawerState: 'opened'
    };
  }

  if (action.type === CLOSE_DRAWER) {
    return {
      ...state,
      drawerState: 'closed'
    };
  }

  if (action.type === ENABLE_DRAWER) {
    return {
      ...state,
      drawerDisabled: false
    };
  }

  if (action.type === DISABLE_DRAWER) {
    return {
      ...state,
      drawerDisabled: true
    };
  }
  return state;
}
