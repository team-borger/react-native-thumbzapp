import backendAPI from './index';
import checkConnection from './checkConnection';

export const searchUsersAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.get(`/users/search?keyword=${body.keyword}`)
            .then(callback)
            .catch(err),
        err
    )
}

export const suggestedContactAPI = async (callback, err) => {
    checkConnection(
        backendAPI.get(`/users/suggested`)
            .then(callback)
            .catch(err),
        err
    )
}


export const merchantListAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/users/role`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const merchantFoodListAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/users/merchant/food`, body)
            .then(callback)
            .catch(err),
        err
    )
}

export const bookAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/book/ticket`, body)
            .then(callback)
            .catch(err),
        err
    )
}
