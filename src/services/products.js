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
