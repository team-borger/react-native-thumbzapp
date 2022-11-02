import backendAPI from './index';
import checkConnection from './checkConnection';

export const addAddressAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/user_address/create`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const updateAddressAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/user_address/update`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const setAddressDefaultAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/user_address/default/${body}`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const allAddressAPI = async (callback, err) => {
    checkConnection(
        backendAPI.get(`/user_address/all`)
            .then(callback)
            .catch(err),
        err
    )
}

export const userAddressAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.get(`/user_address/self/${body}`)
            .then(callback)
            .catch(err),
        err
    )
}

export const deleteAddressAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.delete(`/user_address/delete/${body}`)
            .then(callback)
            .catch(err),
        err
    )
}
