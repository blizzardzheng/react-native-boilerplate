import {
  PUSH_NEW_ROUTE,
  REPLACE_ROUTE,
  REPLACE_OR_PUSH_ROUTE,
  POP_ROUTE,
  POP_TO_ROUTE
} from '../constants';



export function replaceRoute(route:string) {
  return {
    type: REPLACE_ROUTE,
    route
  };
}

export function pushNewRoute(route:string) {
  return {
    type: PUSH_NEW_ROUTE,
    route
  };
}

export function replaceOrPushRoute(route) {
  return {
    type: REPLACE_OR_PUSH_ROUTE,
    route
  };
}

export function popRoute() {
  return {
    type: POP_ROUTE
  };
}

export function popToRoute(route) {
  return {
    type: POP_TO_ROUTE,
    route
  };
}
