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

export const loadThreadsAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.get(`/messages/threads/${body}`)
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

export const updateViewedAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/messages/update-viewed/${body.id}`, body.id)
            .then(callback)
            .catch(err),
        err
    )
}
