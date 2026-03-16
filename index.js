import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging } from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { store, persistor } from './src/redux/store';
import {name as appName} from './app.json';

const app = getApp();
const messagingInstance = getMessaging(app);
messagingInstance.setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
