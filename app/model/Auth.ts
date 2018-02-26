import { CREATE_SUCCESS, READ_SUCCESS } from "../constants/docs"
import { matchs, PATH_CURRENT_USER, PATH_LOGIN, PATH_LOGOUT, PATH_SIGNUP } from "../constants/paths"
import { crudReducer } from "./docs"
import { Me } from '../infra/Me';

export interface IAuthModel {
	email: string
	password: string
	loggedIn: boolean
	synced: boolean
	userId: string
}

export interface IAuthState extends IAuthModel {}

export const initialState: IAuthState = {
	email: "",
	loggedIn: false,
	password: "",
	synced: true,
	userId: null,
}

export function Auth(state: IAuthState = initialState, action): IAuthState {
	if (action.type === 'LOGOUT_AUTH') {
		return {
			...initialState,
			email: action.email
		}
	}

	if (matchs([PATH_LOGIN, PATH_SIGNUP], action.path) && action.type === CREATE_SUCCESS) {
		return crudReducer(state, [PATH_LOGIN, PATH_SIGNUP], action, "-1")
	}

	if (PATH_CURRENT_USER === action.path && action.type === READ_SUCCESS) {
		Me.session = action.payload.result['0'];
		return { ...state, userId: action.payload.result["0"].id }
	}

	return state
}
