import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getAllLeaveApi,
  getLeaveDetailApi,
  updateStatusLeaveApi,
} from '../../services/AdminApiService';

// Async thunk cho việc lấy tất cả leave requests (admin)
export const getAllLeaveRequests = createAsyncThunk(
  'leave/getAllLeaveRequests',
  async ({status = '', page = 1, limit = 10}, {rejectWithValue}) => {
    try {
      const response = await getAllLeaveApi(status, page, limit);

      if (response && response.data && response.data.leaveList) {
        return {
          data: {
            leaveList: response.data.leaveList,
          },
          pagination: response.pagination,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message || 'Không thể lấy danh sách yêu cầu nghỉ phép',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy danh sách yêu cầu nghỉ phép',
      });
    }
  },
);

// Async thunk cho việc lấy chi tiết leave request (admin)
export const getLeaveDetail = createAsyncThunk(
  'leave/getLeaveDetail',
  async (leaveId, {rejectWithValue}) => {
    try {
      const response = await getLeaveDetailApi(leaveId);

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message || 'Không thể lấy chi tiết yêu cầu nghỉ phép',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy chi tiết yêu cầu nghỉ phép',
      });
    }
  },
);

// Async thunk cho việc cập nhật trạng thái leave request (admin)
export const updateStatusLeave = createAsyncThunk(
  'leave/updateStatusLeave',
  async ({leaveId, status, note = ''}, {rejectWithValue}) => {
    try {
      const response = await updateStatusLeaveApi(leaveId, status, note);

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message ||
            'Không thể cập nhật trạng thái yêu cầu nghỉ phép',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi cập nhật trạng thái yêu cầu nghỉ phép',
      });
    }
  },
);
