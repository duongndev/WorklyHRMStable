import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import messaging, { getMessaging } from '@react-native-firebase/messaging';
import { getFCMTokenFromStorage, saveFCMToken } from './src/utils/tokenUtils';
import { updateFCMTokenApi } from './src/services/ApiService';
import {
  Toast,
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
} from 'react-native-alert-notification';
import { navigate } from './src/navigation/NavigationService';
import useStartupPermissions from './src/hooks/useStartupPermissions';

const App = () => {
  const app = getApp();
  const messagingInstance = getMessaging(app);

  const updateFCMTokenOnServer = async token => {
    try {
      await updateFCMTokenApi(token);
    } catch (error) {
      console.log('Error updating FCM token on server:', error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messagingInstance.requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFCMToken();
    } else {
      Dialog.show({
        title: 'Thông báo',
        textBody: 'Hãy bật quyền thông báo để nhận tin từ hệ thống',
        buttonPositive: { text: 'OK' },
      });
    }
  };

  const getFCMToken = async () => {
    try {
      const fcmToken = await messagingInstance.getToken();
      if (fcmToken) {
        console.log('FCM Token: ', fcmToken);
        await saveFCMToken(fcmToken);
        const state = store.getState();
        if (state.auth.token) {
          updateFCMTokenOnServer(fcmToken);
        }
      } else {
        console.log('FCM Token not available');
      }
    } catch (error) {
      console.log('Error getting FCM Token: ', error);
    }
  };

  useEffect(() => {
    // Chỉ setup FCM một lần khi app khởi động
    requestUserPermission();

    const unsubscribe = messagingInstance.onMessage(async remoteMessage => {
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: remoteMessage.notification?.title || 'Thông báo mới',
        textBody: remoteMessage.notification?.body || '',
        onPress: () => {
          Toast.hide();
          navigate('Notification');
        },
      });
    });

    messagingInstance.onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigate('Notification');
    });

    messagingInstance.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        navigate('Notification');
      }
    });

    return unsubscribe;
  }, []); // Chỉ chạy một lần khi app mount

  // Request location + notification permissions at startup
  useStartupPermissions();

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AlertNotificationRoot>
            <RootNavigator />
          </AlertNotificationRoot>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
