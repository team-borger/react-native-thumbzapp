import React from 'react';
import { Provider } from 'react-native-paper';
import App from './src';
import { theme } from './src/core/theme';
import { LogBox } from "react-native";
import { AuthService } from './src/services';

AuthService.init();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

const Main = () => (
  <Provider theme={theme}>
    <App />
  </Provider>
);

export default Main;
