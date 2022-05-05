import backendAPI from './index';
import checkConnection from './checkConnection';

export const addCardsAPI = async (body, callback, err) => {
    checkConnection(
        backendAPI.post(`/payment_method/card-info`)
            .then(callback)
            .catch(err),
        err
    )
}
