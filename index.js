import {AppRegistry} from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging } from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

const app = getApp();
const messagingInstance = getMessaging(app);
messagingInstance.setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
