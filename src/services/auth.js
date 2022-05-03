import backendAPI from './index';
import checkConnection from './checkConnection';
import { SIGNIN_API, SIGNUP_API } from '../constants/Api';

export const loginAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(SIGNIN_API, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const registerAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(SIGNUP_API, body)
            .then(callback)
            .catch(err),
        err
    )
}