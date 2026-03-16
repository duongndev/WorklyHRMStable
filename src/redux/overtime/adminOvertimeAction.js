import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getAllOvertimeRequestsApi,
  getOTDetailApi,
  updateStatusOTApi,
  cancelOvertimeRequestApi
} from '../../services/AdminApiService';



// Admin overtime actions

// Async thunk cho việc lấy tất cả overtime requests (admin)
export const getAllOvertimeRequests = createAsyncThunk(
  'overtime/getAllOvertimeRequests',
  async ({status = '', page = 1, limit = 10}, {rejectWithValue}) => {
    try {
      const response = await getAllOvertimeRequestsApi(status, page, limit);

      if (response && response.data && response.data.overtimeList) {
        return {
          data: {
            overtimeList: response.data.overtimeList,
          },
          pagination: response.pagination,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message || 'Không thể lấy danh sách yêu cầu làm thêm giờ',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy danh sách yêu cầu làm thêm giờ',
      });
    }
  },
);

// Async thunk cho việc lấy chi tiết overtime request (admin)
export const getOTDetail = createAsyncThunk(
  'overtime/getOTDetail',
  async (overtimeId, {rejectWithValue}) => {
    try {
      const response = await getOTDetailApi(overtimeId);

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message || 'Không thể lấy chi tiết yêu cầu làm thêm giờ',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy chi tiết yêu cầu làm thêm giờ',
      });
    }
  },
);

// Async thunk cho việc cập nhật trạng thái overtime request (admin)
export const updateStatusOT = createAsyncThunk(
  'overtime/updateStatusOT',
  async ({overtimeId, status, note = ''}, {rejectWithValue}) => {
    try {
      const response = await updateStatusOTApi(overtimeId, status, note);

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message ||
            'Không thể cập nhật trạng thái yêu cầu làm thêm giờ',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi cập nhật trạng thái yêu cầu làm thêm giờ',
      });
    }
  },
);


