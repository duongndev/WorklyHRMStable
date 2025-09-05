import React, {useEffect} from 'react';
import {Text, ActivityIndicator, StyleSheet, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {isTokenExpired} from '../utils/tokenUtils';
import {logout, clearError, clearMessage} from '../redux/auth/authSlice';
import {getUserInfo} from '../redux/auth/authAction';

const SplashScreen = () => {
  const {token, user, loading, error} = useSelector(state => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  console.log('Auth state:', {token: !!token, user: !!user, loading, error});

  useEffect(() => {
    // Kiểm tra và xử lý authentication chỉ một lần khi component mount
    const handleAuthentication = async () => {
      // Clear previous errors
      dispatch(clearError());
      dispatch(clearMessage());

      // Kiểm tra token có tồn tại và chưa hết hạn
      if (!token) {
        console.log('Không có token, chuyển đến màn hình đăng nhập');
        dispatch(logout());
        navigation.replace('LoginScreen');
        return;
      }

      try {
        const tokenExpired = await isTokenExpired(token);
        if (tokenExpired) {
          console.log('Token đã hết hạn, chuyển đến màn hình đăng nhập');
          dispatch(logout());
          navigation.replace('LoginScreen');
          return;
        }

        // Dispatch getUserInfo async thunk
        console.log('Đang lấy thông tin profile...');
        const resultAction = await dispatch(getUserInfo());

        // Kiểm tra kết quả của async thunk
        if (getUserInfo.fulfilled.match(resultAction)) {
          const userData = resultAction.payload.user;
          console.log('Lấy thông tin profile thành công:', {
            userId: userData.id,
            email: userData.email,
            role: userData.role,
            name: userData.name,
          });

          // Điều hướng dựa trên role
          const userRole = userData.role;
          if (userRole === 'admin') {
            console.log('Điều hướng đến AdminScreen');
            navigation.replace('AdminScreen');
          } else if (userRole === 'employee') {
            console.log('Điều hướng đến MainScreen');
            navigation.replace('MainScreen');
          } else {
            console.warn('Role không được hỗ trợ:', userRole);
            dispatch(logout());
            navigation.replace('LoginScreen');
          }
        } else if (getUserInfo.rejected.match(resultAction)) {
          console.error('Lỗi khi lấy thông tin profile:', resultAction.payload);

          // Xử lý lỗi dựa trên loại lỗi
          const errorMessage = resultAction.payload;
          if (errorMessage && errorMessage.includes('401')) {
            console.log('Token không hợp lệ, đăng xuất');
            dispatch(logout());
          }

          navigation.replace('LoginScreen');
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra token:', err);
        dispatch(logout());
        navigation.replace('LoginScreen');
      }
    };

    // Chỉ chạy một lần khi component mount
    handleAuthentication();
  }, [token, navigation, dispatch]); // Loại bỏ dependencies để tránh re-run


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Workly HRM</Text>
      <ActivityIndicator size="large" color="#007bff" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 20, marginBottom: 20, fontWeight: 'bold'},
});

export default SplashScreen;
