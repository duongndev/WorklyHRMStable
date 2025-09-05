import {createSlice} from '@reduxjs/toolkit';
import {
  getMySchedulesWeek,
  getMySchedulesMonth,
  getDailySchedules,
} from './scheduleAction';

const initialState = {
  weekStart: null,
  weekEnd: null,
  month: null,
  year: null,
  schedules: [],
  dailySchedules: {},
  loading: false,
  error: null,
  message: '',
};

const scheduleSlice = createSlice({
  name: 'schedule',
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
    // Get week schedules cases
    builder
      .addCase(getMySchedulesWeek.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMySchedulesWeek.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.schedules;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getMySchedulesWeek.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Không thể lấy lịch làm việc theo tuần';
        state.message =
          action.payload?.message || 'Không thể lấy lịch làm việc theo tuần';
      })
      // Get month schedules cases
      .addCase(getMySchedulesMonth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMySchedulesMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.month = action.payload.data.month;
        state.year = action.payload.data.year;
        state.schedules = action.payload.data.schedules;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getMySchedulesMonth.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Không thể lấy lịch làm việc theo tháng';
        state.message =
          action.payload?.message || 'Không thể lấy lịch làm việc theo tháng';
      })
      // Get daily schedules cases
      .addCase(getDailySchedules.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDailySchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.dailySchedules = action.payload.dailySchedules;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getDailySchedules.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Không thể lấy lịch làm việc hàng ngày';
        state.message =
          action.payload?.message || 'Không thể lấy lịch làm việc hàng ngày';
      });
  },
});

export const {clearError, clearMessage} = scheduleSlice.actions;
export default scheduleSlice.reducer;
