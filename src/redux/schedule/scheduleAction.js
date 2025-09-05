import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getMyWeekSchedulesApi,
  getMySchedulesMonthApi,
  getDailySchedulesApi,
} from '../../services/ApiService';

// Async thunk cho việc lấy lịch làm việc theo tuần
export const getMySchedulesWeek = createAsyncThunk(
  'schedule/getMySchedulesWeek',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getMyWeekSchedulesApi();

      if (response && response.schedules) {
        return {
          schedules: response.schedules,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể lấy lịch làm việc theo tuần',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy lịch làm việc theo tuần',
      });
    }
  },
);

// Async thunk cho việc lấy lịch làm việc theo tháng
export const getMySchedulesMonth = createAsyncThunk(
  'schedule/getMySchedulesMonth',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getMySchedulesMonthApi();

      if (response && response.data) {
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể lấy lịch làm việc theo tháng',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy lịch làm việc theo tháng',
      });
    }
  },
);

// Async thunk cho việc lấy lịch làm việc hàng ngày
export const getDailySchedules = createAsyncThunk(
  'schedule/getDailySchedules',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getDailySchedulesApi();

      if (response && response.dailySchedules) {
        return {
          dailySchedules: response.dailySchedules,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể lấy lịch làm việc hàng ngày',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy lịch làm việc hàng ngày',
      });
    }
  },
);
