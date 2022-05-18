import ConnectyCube from 'react-native-connectycube';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../../environment';

export default class AuthService {
  init = () => ConnectyCube.init(...environment.CONNECTYCUBE_CONFIG);

  test = asd => {
    console.log('@test: ', asd)
  };

  login = user => {
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(user)
        .then(() => {
          ConnectyCube.login(user)
          .then((session) => {
            AsyncStorage.setItem('session_', JSON.stringify(session))

            ConnectyCube.chat.connect({ userId: session.id, password: user.password })
            .then(() => {
              console.log('logged in as', session.login)
            })
            .then(resolve)
            .catch((error) => {
              console.error('on chat error: ', error)
            })
          })
          .catch(reject);
        })
        .catch(reject);
    });
  };

  logout = () => {
    ConnectyCube.logout();
    ConnectyCube.destroySession();
    return true;
  };
}
