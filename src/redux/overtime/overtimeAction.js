import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getOvertimeRequestsApi,
  getOvertimeRequestDetailApi,
  createOvertimeRequestApi,
  updateOvertimeRequestApi,
  cancelOvertimeRequestApi,
} from '../../services/ApiService';

// Async thunk cho việc lấy danh sách overtime requests của employee
export const getOvertimeRequests = createAsyncThunk(
  'overtime/getOvertimeRequests',
  async ({status = '', page = 1, limit = 10}, {rejectWithValue}) => {
    try {
      const response = await getOvertimeRequestsApi(status, page, limit);

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

// Async thunk cho việc lấy chi tiết overtime request
export const getOvertimeRequestDetail = createAsyncThunk(
  'overtime/getOvertimeRequestDetail',
  async (overtimeId, {rejectWithValue}) => {
    try {
      const response = await getOvertimeRequestDetailApi(overtimeId);

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

// Async thunk cho việc tạo overtime request mới
export const createOvertimeRequest = createAsyncThunk(
  'overtime/createOvertimeRequest',
  async (overtimeData, {rejectWithValue}) => {
    try {
      const response = await createOvertimeRequestApi(overtimeData);

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể tạo yêu cầu làm thêm giờ',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi tạo yêu cầu làm thêm giờ',
      });
    }
  },
);

// Async thunk cho việc cập nhật overtime request
export const updateOvertimeRequest = createAsyncThunk(
  'overtime/updateOvertimeRequest',
  async ({overtimeId, overtimeData}, {rejectWithValue}) => {
    try {
      const response = await updateOvertimeRequestApi(overtimeId, overtimeData);

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message:
            response.message || 'Không thể cập nhật yêu cầu làm thêm giờ',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi cập nhật yêu cầu làm thêm giờ',
      });
    }
  },
);

// Async thunk cho việc hủy overtime request
export const cancelOvertimeRequest = createAsyncThunk(
  'overtime/cancelOvertimeRequest',
  async (overtimeId, {rejectWithValue}) => {
    try {
      const response = await cancelOvertimeRequestApi(overtimeId);
      console.log(response);

      if (response && response.data) {
        return {
          data: {overtimeId},
          message: response.message,
        };
      } else {
        throw new Error('Không thể hủy yêu cầu làm thêm giờ');
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi hủy yêu cầu làm thêm giờ',
      });
    }
  },
);
