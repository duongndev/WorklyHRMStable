import {createSlice} from '@reduxjs/toolkit';
import {
  getOvertimeRequests,
  getOvertimeRequestDetail,
  createOvertimeRequest,
  updateOvertimeRequest,
  cancelOvertimeRequest,
  getAllOvertimeRequests,
  getOTDetail,
  updateStatusOT,
} from './overtimeAction';

const initialState = {
  overtimeList: [],
  overtimeDetail: {},
  loading: false,
  message: null,
  error: null,
  pagination: {
    totalPages: 0,
    currentPage: 0,
    total: 0,
  },
};

const overtimeSlice = createSlice({
  name: 'overtime',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
    resetOvertimeDetail: state => {
      state.overtimeDetail = {};
    },
  },
  extraReducers: builder => {
    // Employee overtime requests cases
    builder
      .addCase(getOvertimeRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOvertimeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimeList = action.payload.data.overtimeList;
        state.pagination = action.payload.pagination;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getOvertimeRequests.rejected, (state, action) => {
        state.loading = false;
        state.overtimeList = [];
        state.error =
          action.payload?.message ||
          'Không thể lấy danh sách yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message ||
          'Không thể lấy danh sách yêu cầu làm thêm giờ';
      })
      // Get overtime detail cases
      .addCase(getOvertimeRequestDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOvertimeRequestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimeDetail = action.payload.data;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getOvertimeRequestDetail.rejected, (state, action) => {
        state.loading = false;
        state.overtimeDetail = {};
        state.error =
          action.payload?.message ||
          'Không thể lấy chi tiết yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message ||
          'Không thể lấy chi tiết yêu cầu làm thêm giờ';
      })
      // Create overtime request cases
      .addCase(createOvertimeRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOvertimeRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createOvertimeRequest.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Không thể tạo yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message || 'Không thể tạo yêu cầu làm thêm giờ';
      })
      // Update overtime request cases
      .addCase(updateOvertimeRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOvertimeRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateOvertimeRequest.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Không thể cập nhật yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message || 'Không thể cập nhật yêu cầu làm thêm giờ';
      })
      // Cancel overtime request cases
      .addCase(cancelOvertimeRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOvertimeRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(cancelOvertimeRequest.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Không thể hủy yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message || 'Không thể hủy yêu cầu làm thêm giờ';
      })
      // Admin overtime requests cases
      .addCase(getAllOvertimeRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOvertimeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimeList = action.payload.data.overtimeList;
        state.pagination = action.payload.pagination;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getAllOvertimeRequests.rejected, (state, action) => {
        state.loading = false;
        state.overtimeList = [];
        state.error =
          action.payload?.message ||
          'Không thể lấy danh sách yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message ||
          'Không thể lấy danh sách yêu cầu làm thêm giờ';
      })
      // Get OT detail (admin) cases
      .addCase(getOTDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOTDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimeDetail = action.payload.data;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getOTDetail.rejected, (state, action) => {
        state.loading = false;
        state.overtimeDetail = {};
        state.error =
          action.payload?.message ||
          'Không thể lấy chi tiết yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message ||
          'Không thể lấy chi tiết yêu cầu làm thêm giờ';
      })
      // Update status OT (admin) cases
      .addCase(updateStatusOT.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatusOT.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateStatusOT.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          'Không thể cập nhật trạng thái yêu cầu làm thêm giờ';
        state.message =
          action.payload?.message ||
          'Không thể cập nhật trạng thái yêu cầu làm thêm giờ';
      });
  },
});

export const {clearError, clearMessage, resetOvertimeDetail} =
  overtimeSlice.actions;

export default overtimeSlice.reducer;
