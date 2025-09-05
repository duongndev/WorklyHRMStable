import {createAsyncThunk} from '@reduxjs/toolkit';
import {loginApi, logoutApi, getProfileApi} from '../../services/ApiService';
import {saveToken, removeToken} from '../../utils/tokenUtils';
import {logout} from './authSlice';

// Async thunk cho login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const response = await loginApi(email, password);
      console.log('Login API response:', response);

      // Kiểm tra response có data cần thiết không
      console.log('Checking response data:', {
        hasResponse: !!response,
        hasToken: !!response?.token,
        hasUser: !!response?.user,
        responseKeys: response ? Object.keys(response) : 'no response',
      });

      if (response && response.token && response.user) {
        console.log('Login successful, saving token and returning data');
        // Lưu token vào storage
        await saveToken(response.token);

        const successData = {
          message: response.message || 'Đăng nhập thành công',
          user: response.user,
          token: response.token,
        };
        console.log('Returning success data:', successData);
        return successData;
      } else {
        console.log('Login failed - missing required data');
        // Response không có đủ data cần thiết
        return rejectWithValue({
          message: response?.message || 'Dữ liệu đăng nhập không hợp lệ',
        });
      }
    } catch (error) {
      console.error('Login API error:', error);
      // Xử lý error từ API
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Có lỗi xảy ra khi đăng nhập';

      return rejectWithValue({
        message: errorMessage,
      });
    }
  },
);

// Async thunk cho logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      const response = await logoutApi();

      // Xóa token khỏi storage
      await removeToken();

      if (response.success) {
        return {
          message: response.message || 'Đăng xuất thành công',
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Có lỗi xảy ra khi đăng xuất',
        });
      }
    } catch (error) {
      // Vẫn xóa token và logout ngay cả khi có lỗi
      await removeToken();
      return rejectWithValue({
        message: error.message || 'Có lỗi xảy ra khi đăng xuất',
      });
    }
  },
);

// Async thunk cho việc lấy thông tin user
export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getProfileApi();
      console.log('GetProfile API response:', response);

      // Kiểm tra response có user data không
      if (response && response.user) {
        console.log('Profile data retrieved successfully:', {
          userId: response.user.id,
          email: response.user.email,
          role: response.user.role,
        });

        return {
          user: response.user,
          message: response.message || 'Lấy thông tin thành công',
        };
      } else {
        console.error('Invalid profile response:', response);
        return rejectWithValue(
          response?.message ||
            'Không thể lấy thông tin người dùng - dữ liệu không hợp lệ',
        );
      }
    } catch (error) {
      console.error('GetProfile API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Có lỗi xảy ra khi lấy thông tin người dùng';

      if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn';
      } else if (error.response?.status === 403) {
        errorMessage = 'Không có quyền truy cập';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Lỗi server, vui lòng thử lại sau';
      } else if (
        error.code === 'NETWORK_ERROR' ||
        error.message.includes('Network')
      ) {
        errorMessage = 'Lỗi kết nối mạng';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return rejectWithValue(errorMessage);
    }
  },
);

// Action creator đơn giản cho logout (không gọi API)
export const simpleLogout = () => dispatch => {
  dispatch(logout());
};

// Action creator cho việc clear auth state
export const clearAuthState = () => dispatch => {
  dispatch(logout());
};
