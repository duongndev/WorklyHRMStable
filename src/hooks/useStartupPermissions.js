import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/**
 * Request location and notification permissions on app startup.
 * Shows a rationale alert before requesting permissions.
 */
const useStartupPermissions = () => {
  const [granted, setGranted] = useState({location: false, notifications: false});

  useEffect(() => {
    const checkLocationGranted = async () => {
      try {
        if (Platform.OS === 'ios') {
          const status = await Geolocation.requestAuthorization('whenInUse');
          return status === 'granted' || status === 'always';
        }
        const status = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return status === true;
      } catch (e) {
        return false;
      }
    };

    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'ios') {
          const status = await Geolocation.requestAuthorization('whenInUse');
          return status === 'granted' || status === 'always';
        }
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền truy cập vị trí',
            message:
              'Ứng dụng cần quyền vị trí để ghi nhận chính xác địa điểm khi bạn chấm công.',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          },
        );
        return status === PermissionsAndroid.RESULTS.GRANTED;
      } catch (e) {
        return false;
      }
    };

    const checkNotificationGranted = async () => {
      try {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const status = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          return status === true;
        }
        // iOS permission is handled via Firebase messaging in App.jsx
        return true;
      } catch (e) {
        return false;
      }
    };

    const requestNotificationPermission = async () => {
      try {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          return status === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } catch (e) {
        return false;
      }
    };

    const init = async () => {
      const [locGranted, notiGranted] = await Promise.all([
        checkLocationGranted(),
        checkNotificationGranted(),
      ]);

      // Nếu cả 2 đã cấp quyền thì không hiển thị gì nữa
      if (locGranted && notiGranted) {
        setGranted({location: true, notifications: true});
        return;
      }

      // Chỉ hiển thị yêu cầu nếu còn thiếu quyền
      Alert.alert(
        'Cho phép quyền truy cập',
        'Để trải nghiệm đầy đủ, vui lòng cho phép: \n\n• Vị trí: chấm công đúng địa điểm\n• Thông báo: nhận cập nhật ca làm, chấm công',
        [
          {
            text: 'Để sau',
            style: 'cancel',
            onPress: async () => {
              const [loc, noti] = await Promise.all([
                locGranted ? Promise.resolve(true) : requestLocationPermission(),
                notiGranted ? Promise.resolve(true) : requestNotificationPermission(),
              ]);
              setGranted({location: loc, notifications: noti});
            },
          },
          {
            text: 'Tiếp tục',
            onPress: async () => {
              const [loc, noti] = await Promise.all([
                locGranted ? Promise.resolve(true) : requestLocationPermission(),
                notiGranted ? Promise.resolve(true) : requestNotificationPermission(),
              ]);
              setGranted({location: loc, notifications: noti});
            },
          },
        ],
        {cancelable: true},
      );
    };

    init();
  }, []);

  return granted;
};

export default useStartupPermissions;


