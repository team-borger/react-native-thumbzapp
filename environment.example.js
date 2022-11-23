import ConnectyCube from 'react-native-connectycube';

const environment = {
    API_URL: 'http://localhost:8000/api',
    CONNECTYCUBE_CONFIG: [
        {
          appId: 0000,
          authKey: 'authKey',
          authSecret: 'authSecret',
        },
        {
          mode: 1,
          on: {
            sessionExpired: (handleResponse, retry) => {
              ConnectyCube.createSession()
                .then(retry)
                .catch((error) => {});
            },
          },
        }
    ]
}
export default environment
