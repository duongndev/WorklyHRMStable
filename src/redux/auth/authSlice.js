import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, getUserInfo } from './authAction';

const initialState = {
    token: null,
    user: null,
    message: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.message = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.message = action.payload?.message || 'Đăng nhập thất bại';
        state.error = action.payload?.message || 'Đăng nhập thất bại';
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.message = action.payload?.message || 'Có lỗi xảy ra khi đăng xuất';
        state.error = action.payload?.message || 'Có lỗi xảy ra khi đăng xuất';
      })
      // Get user info cases
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.message = action.payload || 'Không thể lấy thông tin người dùng';
        state.error = action.payload || 'Không thể lấy thông tin người dùng';
      });
  },
});
export const { logout, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
