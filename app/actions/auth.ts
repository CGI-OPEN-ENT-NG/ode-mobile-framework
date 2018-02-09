import { PATH_AUTH, PATH_LOGIN, PATH_LOGOUT, PATH_RECOVER_PASSWORD, PATH_SIGNUP } from "../constants/paths"
import {create, createWithFormData} from "./docs"

/**
 *
 * @param {string} email     login du user
 * @param {string} password     password du user
 * @param {boolean} synced    say if we put yourglass
 * @returns {PATH_LOGIN}
 */
export const login = (email, password) => {
	return createWithFormData(PATH_LOGIN, { email, password, rememberMe: true }, true) // create et non read pour recuperrer le password
}

/**
 * Logout du user
 * @param {string} email     login du user
 *
 * @returns {{type}}
 */
export const logout = email => {
	return create(PATH_LOGOUT, { email }, false)
}

/**
 * Enregistrement d'un user
 *
 * @param {string} email   login du user
 * @param {string} password   password du user
 * @returns {PATH_SIGNUP}
 */
export const signup = (email, password) => {
	return createWithFormData(PATH_SIGNUP, { email, password }, true)
}

/**
 * Recuperation du password du user
 *
 * @param {string } email     email du user
 * @returns {PATH_RECOVER_PASSWORD}
 */
export const recoverPassword = email => {
	return createWithFormData(PATH_RECOVER_PASSWORD, { email }, true)
}

/**
 * try to login
 * @returns {PATH_LOGIN}
 */
export const checkLogin = () => {
	return { type: PATH_AUTH }
}
