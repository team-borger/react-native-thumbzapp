import backendAPI from './index';
import checkConnection from './checkConnection';

export const productsListAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/product/search`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const addCartAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/cart/create`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const cartAllAPI = async (callback, err) => {
    checkConnection(
        backendAPI.get(`/cart/all`)
            .then(callback)
            .catch(err),
        err
    )
}
