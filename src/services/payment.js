import backendAPI from './index';
import checkConnection from './checkConnection';

export const addCardsAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/payment_method/card-info`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const getCardListAPI = async (callback, err) => {
    checkConnection(
        backendAPI.get(`/payment_method/card-list`)
            .then(callback)
            .catch(err),
        err
    )
}

export const deleteCardAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.delete(`/payment_method/card-delete/${body.id}`)
            .then(callback)
            .catch(err),
        err
    )
}
