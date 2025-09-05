import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getMyNotificaionApi,
  getUnreadNotificationCountApi,
} from '../../services/ApiService';

// Async thunk cho việc lấy danh sách notifications
export const getMyNotifications = createAsyncThunk(
  'notification/getMyNotifications',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getMyNotificaionApi();

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể lấy danh sách thông báo',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy danh sách thông báo',
      });
    }
  },
);

// Async thunk cho việc lấy số lượng thông báo chưa đọc
export const getUnreadNotificationCount = createAsyncThunk(
  'notification/getUnreadNotificationCount',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getUnreadNotificationCountApi();

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message || 'Không thể lấy số lượng thông báo chưa đọc',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy số lượng thông báo chưa đọc',
      });
    }
  },
);
