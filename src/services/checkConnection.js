import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';

export default (req, error) => {
    NetInfo.fetch().then(({ isConnected }) => {
        if (isConnected) {
            req;
        } else {
            Toast.show('No internet connection')
            const err = {
                response: {
                    data: {
                        message: null,
                        error: null
                    }
                }
            }
            try {
                error(err);
            } catch (e) {
                console.log('[NETWORK ERROR]', e)
            }

        }
    })
}