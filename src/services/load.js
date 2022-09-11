import backendAPI from './index';
import checkConnection from './checkConnection';

export const loadListAPI = async (callback, err) => {
    checkConnection(
        backendAPI.get(`/network_provider/all`)
            .then(callback)
            .catch(err),
        err
    )
}

export const findNetworkAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/network_prefix/find`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const networkInfoAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.get(`/network_provider/self/${body.id}`)
            .then(callback)
            .catch(err),
        err
    )
}
