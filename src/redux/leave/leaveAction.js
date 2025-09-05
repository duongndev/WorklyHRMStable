import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getLeaveRequestDetailApi,
  getLeaveRequestsApi,
  createLeaveRequestApi,
  cancelLeaveRequestApi,
  updateLeaveRequestApi,
} from '../../services/ApiService';

// Async thunk cho việc lấy danh sách leave requests
export const getLeaveRequests = createAsyncThunk(
  'leave/getLeaveRequests',
  async ({status = '', page = 1, limit = 10}, {rejectWithValue}) => {
    try {
      console.log('getLeaveRequests - Calling API with params:', {
        status,
        page,
        limit,
      });
      const response = await getLeaveRequestsApi(status, page, limit);

      console.log(
        'getLeaveRequests - API Response:',
        JSON.stringify(response, null, 2),
      );
      console.log(
        'getLeaveRequests - Response success field:',
        response.success,
      );
      console.log('getLeaveRequests - Response type:', typeof response.success);

      if (response && response.data && response.data.leaveList) {
        console.log('getLeaveRequests - Success case, returning data');
        return {
          data: {
            leaveList: response.data.leaveList,
          },
          pagination: response.pagination,
          message: response.message,
        };
      } else {
        console.log('getLeaveRequests - Failed case, rejecting with value');
        return rejectWithValue({
          message:
            response.message || 'Không thể lấy danh sách yêu cầu nghỉ phép',
        });
      }
    } catch (error) {
      console.log('getLeaveRequests - Catch error:', error);
      console.log('getLeaveRequests - Error message:', error.message);
      console.log('getLeaveRequests - Error response:', error.response?.data);
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy danh sách yêu cầu nghỉ phép',
      });
    }
  },
);

// Async thunk cho việc lấy chi tiết leave request
export const getLeaveRequestDetail = createAsyncThunk(
  'leave/getLeaveRequestDetail',
  async (leaveId, {rejectWithValue}) => {
    try {
      const response = await getLeaveRequestDetailApi(leaveId);
      console.log('getLeaveRequestDetail - API Response:', response);

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
          error.message || 'Có lỗi xảy ra khi lấy chi tiết yêu cầu nghỉ phép',
      });
    }
  },
);

// Async thunk cho việc tạo leave request mới
export const createLeaveRequest = createAsyncThunk(
  'leave/createLeaveRequest',
  async (leaveData, {rejectWithValue}) => {
    try {
      console.log('createLeaveRequest - Calling API with data:', leaveData);
      const response = await createLeaveRequestApi(leaveData);

      console.log(
        'createLeaveRequest - API Response:',
        JSON.stringify(response, null, 2),
      );
      console.log(
        'createLeaveRequest - Response success field:',
        response.success,
      );
      console.log(
        'createLeaveRequest - Response type:',
        typeof response.success,
      );

      if (response.success) {
        console.log('createLeaveRequest - Success case, returning data');
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        console.log('createLeaveRequest - Failed case, rejecting with value');
        return rejectWithValue({
          message: response.message || 'Không thể tạo yêu cầu nghỉ phép',
        });
      }
    } catch (error) {
      console.log('createLeaveRequest - Catch error:', error);
      console.log('createLeaveRequest - Error message:', error.message);
      console.log('createLeaveRequest - Error response:', error.response?.data);
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi tạo yêu cầu nghỉ phép',
      });
    }
  },
);

// Async thunk cho việc cập nhật trạng thái leave request
export const updateStatusLeaveRequest = createAsyncThunk(
  'leave/updateStatusLeaveRequest',
  async ({leaveId, status, reason = ''}, {rejectWithValue}) => {
    try {
      const response = await updateLeaveRequestApi(leaveId, status, reason);

      if (response.success) {
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
          error.message ||
          'Có lỗi xảy ra khi cập nhật trạng thái yêu cầu nghỉ phép',
      });
    }
  },
);

// Async thunk cho việc xóa leave request
export const deleteLeaveRequest = createAsyncThunk(
  'leave/deleteLeaveRequest',
  async (leaveId, {rejectWithValue}) => {
    try {
      const response = await cancelLeaveRequestApi(leaveId);

      if (response.success) {
        return {
          data: {leaveId},
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể xóa yêu cầu nghỉ phép',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Có lỗi xảy ra khi xóa yêu cầu nghỉ phép',
      });
    }
  },
);
