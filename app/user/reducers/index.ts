/*
  Reducers for User app and authentification.
*/

import { Action, combineReducers } from "redux";

import auth from "./auth";
import info from "./info";
import activation from "./activation";

const rootReducer: (state: any, action: Action) => any = combineReducers({
  auth,
  info,
  activation
});

export default rootReducer;

// LEGACY EXPORTS : used in conversations app
export interface IUser {
  userId: string;
  displayName: string;
}
export interface IGroup {
  id: string;
  name: string;
}
