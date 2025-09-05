import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/auth/authAction';
import { updateFCMTokenApi } from '../../services/ApiService';
import { getFCMTokenFromStorage } from '../../utils/tokenUtils';
import { navigateBasedOnRole } from '../../utils/navigationHelpers';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    // Validate input fields
    if (!email?.trim() || !password?.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ');
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }));

      console.log('ResultAction:', resultAction);
      console.log('ResultAction type:', resultAction.type);
      console.log('Is fulfilled?', loginUser.fulfilled.match(resultAction));

      if (loginUser.fulfilled.match(resultAction)) {
        const { user } = resultAction.payload;
        console.log('Đăng nhập thành công:', user?.email);

        // Update FCM token in background
        updateFCMTokenInBackground();

        // Navigate based on user role
        navigateBasedOnRole(navigation, user?.role, handleUnknownRole);
      } else if (loginUser.rejected.match(resultAction)) {
        // Login was rejected
        const errorMessage = resultAction.payload?.message || 'Đăng nhập thất bại';
        console.log('Login rejected:', errorMessage);
        Alert.alert('Lỗi đăng nhập', errorMessage);
      } else {
        // Unknown state
        console.log('Unknown login state:', resultAction);
        Alert.alert('Lỗi', 'Có lỗi không xác định xảy ra. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
  };

  // Helper function to update FCM token
  const updateFCMTokenInBackground = async () => {
    try {
      const fcmToken = await getFCMTokenFromStorage();
      if (fcmToken) {
        await updateFCMTokenApi(fcmToken);
        console.log('FCM token updated successfully');
      }
    } catch (fcmError) {
      console.warn('FCM token update failed:', fcmError.message);
      // Don't show error to user as this is not critical for login flow
    }
  };

  // Helper function to handle unknown role
  const handleUnknownRole = (userRole) => {
    Alert.alert('Cảnh báo', 'Vai trò người dùng không xác định. Vui lòng liên hệ quản trị viên.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.welcomeText}>Đăng nhập</Text>
      </View>

      <View style={styles.formContainer}>
        <CustomTextInput
          label="Email"
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999999"
        />

        <CustomTextInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu của bạn"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#999999"
        />

        {/* lỗi khi đăng nhập */}
        {error && (
          <Text style={styles.errorMes}>{error}</Text>
        )}

        <CustomButton
          title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          onPress={handleLogin}
          disabled={loading}
          loading={loading} // Pass loading state to CustomButton
        />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasswordButtonText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  forgotPasswordButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loadingIndicator: { // Remove this style as it's no longer needed
    position: 'absolute',
    alignSelf: 'center',
    top: '60%',
    transform: [{ translateY: -10 }],
  },
  errorMes: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
