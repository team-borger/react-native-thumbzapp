import backendAPI from './index';
import checkConnection from './checkConnection';

export const foodSearchAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/food/search`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const cartFoodAllAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.get(`/cart_food/user/${body}`)
            .then(callback)
            .catch(err),
        err
    )
}

export const addCartFoodAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/cart_food/create`, body)
            .then(callback)
            .catch(err),
        err
    )
}