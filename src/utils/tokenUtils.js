import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isTokenExpired = token => {
  if (!token) {
    console.warn('Token is null or undefined.');
    return true;
  }

  try {
    const decoded = jwtDecode(token);
    if (typeof decoded.exp === 'undefined') {
      console.warn('Token does not contain an expiration time (exp).');
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token or token is invalid:', error);
    return true;
  }
};

export const saveFCMToken = async token => {
  try {
    await AsyncStorage.setItem('fcmToken', token);
  } catch (error) {
    console.error('Error saving FCM token:', error);
    throw error;
  }
};

export const saveToken = async token => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

export const getFCMTokenFromStorage = async () => {
  try {
    return await AsyncStorage.getItem('fcmToken');
  } catch (error) {
    console.log('Error getting FCM Token from storage:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    console.log('Token removed successfully');
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

export const getTokenFromStorage = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.log('Error getting token from storage:', error);
    return null;
  }
};
