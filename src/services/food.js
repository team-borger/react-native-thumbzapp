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
