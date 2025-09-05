import {createSlice} from '@reduxjs/toolkit';
import {
  getMyNotifications,
  getUnreadNotificationCount,
} from './notificationAction';

const initialState = {
  notifiList: [],
  message: '',
  loading: false,
  error: null,
  count: null,
};

const notifiSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = '';
    },
  },
  extraReducers: builder => {
    // Get notifications cases
    builder
      .addCase(getMyNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifiList = action.payload.data;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.notifiList = [];
        state.error =
          action.payload?.message || 'Không thể lấy danh sách thông báo';
        state.message =
          action.payload?.message || 'Không thể lấy danh sách thông báo';
      })
      // Get unread count cases
      .addCase(getUnreadNotificationCount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.data.count;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getUnreadNotificationCount.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          'Không thể lấy số lượng thông báo chưa đọc';
        state.message =
          action.payload?.message ||
          'Không thể lấy số lượng thông báo chưa đọc';
      });
  },
});

export const {clearError, clearMessage} = notifiSlice.actions;

export default notifiSlice.reducer;
