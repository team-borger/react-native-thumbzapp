import backendAPI from './index';
import checkConnection from './checkConnection';
import { SIGNIN_API, SIGNUP_API, CHECK_EMAIL_API } from '../constants/Api';

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

export const checkEmailAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.get(CHECK_EMAIL_API + body.email)
            .then(callback)
            .catch(err),
        err
    )
}

export const sendVerifyAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/verify/${body.id}`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const forgotPassAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/forgot/password`, body)
            .then(callback)
            .catch(err),
        err
    )
}
