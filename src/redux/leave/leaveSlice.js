import {createSlice} from '@reduxjs/toolkit';
import { getLeaveRequests, getLeaveRequestDetail, createLeaveRequest, updateStatusLeaveRequest, deleteLeaveRequest } from './leaveAction';
import { getAllLeaveRequests, getLeaveDetail, updateStatusLeave } from './adminLeaveAction';

const initialState = {
  leaveList: [],
  leaveDetail: {},
  loading: false,
  error: null,
  message: '',
  pagination: {
    totalPages: 0,
    currentPage: 0,
    total: 0,
  },
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = '';
    },
    resetLeaveDetail: (state) => {
      state.leaveDetail = {};
    },
  },
  extraReducers: (builder) => {
    // Get leave requests cases
    builder
      .addCase(getLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveList = action.payload.data.leaveList;
        state.pagination = action.payload.pagination;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.leaveList = [];
        state.error = action.payload?.message || 'Không thể lấy danh sách yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể lấy danh sách yêu cầu nghỉ phép';
      })
      // Get leave request detail cases
      .addCase(getLeaveRequestDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveRequestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveDetail = action.payload.data;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getLeaveRequestDetail.rejected, (state, action) => {
        state.loading = false;
        state.leaveDetail = {};
        state.error = action.payload?.message || 'Không thể lấy chi tiết yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể lấy chi tiết yêu cầu nghỉ phép';
      })
      // Create leave request cases
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tạo yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể tạo yêu cầu nghỉ phép';
      })
      // Update status leave request cases
      .addCase(updateStatusLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatusLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateStatusLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể cập nhật trạng thái yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể cập nhật trạng thái yêu cầu nghỉ phép';
      })
      // Delete leave request cases
      .addCase(deleteLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể xóa yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể xóa yêu cầu nghỉ phép';
      })
      // Admin get all leave requests cases
      .addCase(getAllLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveList = action.payload.data.leaveList;
        state.pagination = action.payload.pagination;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getAllLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.leaveList = [];
        state.error = action.payload?.message || 'Không thể lấy danh sách yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể lấy danh sách yêu cầu nghỉ phép';
      })
      // Admin get leave detail cases
      .addCase(getLeaveDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveDetail = action.payload.data;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getLeaveDetail.rejected, (state, action) => {
        state.loading = false;
        state.leaveDetail = {};
        state.error = action.payload?.message || 'Không thể lấy chi tiết yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể lấy chi tiết yêu cầu nghỉ phép';
      })
      // Admin update status leave cases
      .addCase(updateStatusLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatusLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateStatusLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể cập nhật trạng thái yêu cầu nghỉ phép';
        state.message = action.payload?.message || 'Không thể cập nhật trạng thái yêu cầu nghỉ phép';
      });
  },
});

export const {
  clearError,
  clearMessage,
  resetLeaveDetail,
} = leaveSlice.actions;

export default leaveSlice.reducer;
