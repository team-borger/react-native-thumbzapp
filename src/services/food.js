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

export const placeFoodOrderAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/food_order/create`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const updateFoodCartAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/cart_food/update`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const deleteFoodCartAPI = async (id, callback, err) => {
    checkConnection(
        backendAPI.delete(`/cart_food/delete/${id}`)
            .then(callback)
            .catch(err),
        err
    )
}
