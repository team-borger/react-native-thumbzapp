import backendAPI from './index';
import checkConnection from './checkConnection';

export const conversationsAPI = async (callback, err) => {
    checkConnection(
        backendAPI.get(`/messages/conversations`)
            .then(callback)
            .catch(err),
        err
    )
}

export const loadThreadsAPI = async (recepientId, callback, err) => {
    checkConnection(
        backendAPI.get(`/messages/threads/${recepientId}`)
            .then(callback)
            .catch(err),
        err
    )
}

export const createMessageAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/messages/create-message`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const updateViewedAPI = async (userId, callback, err) => {
    checkConnection(
        backendAPI.post(`/messages/update-viewed/${userId}`, userId)
            .then(callback)
            .catch(err),
        err
    )
}
