import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  checkInApi,
  checkOutApi,
  getAttendanceRecordsApi,
} from '../../services/ApiService';

// Async thunk cho việc check in
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (checkInData, {rejectWithValue, dispatch}) => {
    try {
      const response = await checkInApi(checkInData);

      if (response && response.data) {
        // Persist minimal current attendance state
        try {
          const dateIso = response.data.date || new Date().toISOString();
          const dateKey = dateIso.slice(0, 10);
          // Chuẩn hoá giá trị location thành chuỗi để tránh render object
          const respLoc = response.data.location;
          const normalizedLoc = typeof respLoc === 'string'
            ? respLoc
            : respLoc && typeof respLoc === 'object'
              ? (() => {
                  const lat = respLoc.lat ?? respLoc.latitude;
                  const lng = respLoc.lng ?? respLoc.longitude;
                  return lat != null && lng != null ? `${lat}, ${lng}` : JSON.stringify(respLoc);
                })()
              : (checkInData?.addressName || '');
          const stateObj = {
            date: dateKey,
            isCheckedIn: true,
            isCheckedOut: false,
            checkInTime: response.data.checkInTime ?? null,
            checkOutTime: null,
            recordId: response.data.id ?? null,
            location: normalizedLoc,
          };
          await AsyncStorage.setItem(`ATT_STATE_${dateKey}`, JSON.stringify(stateObj));
          await AsyncStorage.setItem('ATT_STATE_TODAY', dateKey);
          // legacy key for backward compatibility
          await AsyncStorage.setItem('CURRENT_ATTENDANCE', JSON.stringify(stateObj));
        } catch (e) {
          // ignore storage errors
        }
        // Luôn tải lại lịch sử từ API sau khi check-in thành công
        try {
          await dispatch(getAttendanceRecords({page: 1, limit: 10}));
        } catch (e) {
          // ignore refresh errors
        }
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể check in',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi check in',
      });
    }
  },
);

// Async thunk cho việc check out
export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (checkOutData, {rejectWithValue, getState, dispatch}) => {
    try {
      const response = await checkOutApi(checkOutData);

      if (response && response.data) {
        // Persist current day attendance with checkout data
        try {
          const state = getState();
          const current = state?.attendance?.currentAttendance || {};
          const dateIso = response.data.date || new Date().toISOString();
          const dateKey = dateIso.slice(0, 10);
          // Chuẩn hoá giá trị location thành chuỗi để tránh render object
          const respLoc = response.data.location;
          const normalizedLoc = typeof respLoc === 'string'
            ? respLoc
            : respLoc && typeof respLoc === 'object'
              ? (() => {
                  const lat = respLoc.lat ?? respLoc.latitude;
                  const lng = respLoc.lng ?? respLoc.longitude;
                  return lat != null && lng != null ? `${lat}, ${lng}` : JSON.stringify(respLoc);
                })()
              : (checkOutData?.addressName || current.location || '');
          const stateObj = {
            date: dateKey,
            isCheckedIn: false,
            isCheckedOut: true,
            checkInTime: current.checkInTime || null,
            checkOutTime: response.data.checkOutTime ?? null,
            recordId: response.data.id ?? current.recordId ?? null,
            location: normalizedLoc,
          };
          await AsyncStorage.setItem(`ATT_STATE_${dateKey}`, JSON.stringify(stateObj));
          await AsyncStorage.setItem('ATT_STATE_TODAY', dateKey);
          await AsyncStorage.setItem('CURRENT_ATTENDANCE', JSON.stringify(stateObj));
        } catch (e) {
          // ignore storage errors
        }
        // Luôn tải lại lịch sử từ API sau khi check-out thành công
        try {
          await dispatch(getAttendanceRecords({page: 1, limit: 10}));
        } catch (e) {
          // ignore refresh errors
        }
        return {
          data: response.data,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể check out',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi check out',
      });
    }
  },
);

// Async thunk cho việc lấy lịch sử chấm công
export const getAttendanceRecords = createAsyncThunk(
  'attendance/getAttendanceRecords',
  async ({page = 1, limit = 10}, {rejectWithValue}) => {
    try {
      const response = await getAttendanceRecordsApi(page, limit);

      if (response && response.data) {
        return {
          data: response.data,
          pagination: response.pagination,
          message: response.message,
        };
      } else {
        return rejectWithValue({
          message: response.message || 'Không thể lấy lịch sử chấm công',
        });
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lấy lịch sử chấm công',
      });
    }
  },
);

// Load persisted current attendance from storage
export const loadCurrentAttendance = createAsyncThunk(
  'attendance/loadCurrentAttendance',
  async (_, {rejectWithValue}) => {
    try {
      // Try day-based key first
      const todayKey =
        (await AsyncStorage.getItem('ATT_STATE_TODAY')) ||
        new Date().toISOString().slice(0, 10);
      const rawByDay = await AsyncStorage.getItem(`ATT_STATE_${todayKey}`);
      if (rawByDay) {
        return {data: JSON.parse(rawByDay)};
      }
      // Fallback to legacy key
      const legacy = await AsyncStorage.getItem('CURRENT_ATTENDANCE');
      if (legacy) {
        return {data: JSON.parse(legacy)};
      }
      return {data: null};
    } catch (error) {
      return rejectWithValue({message: 'Không thể tải trạng thái chấm công'});
    }
  },
);

// Đồng bộ trạng thái hiện tại với API (ưu tiên dữ liệu server)
export const syncAttendanceState = createAsyncThunk(
  'attendance/syncAttendanceState',
  async (_,
    {rejectWithValue}) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await getAttendanceRecordsApi(1, 10);
      const records = res?.data?.attendanceRecords || [];
      // Tìm bản ghi của hôm nay
      const todayRecord = records.find(r => (r?.date || '').slice(0, 10) === today);
      if (!todayRecord) {
        // Không có bản ghi hôm nay -> reset local cho hôm nay
        const empty = {
          date: today,
          isCheckedIn: false,
          isCheckedOut: false,
          checkInTime: null,
          checkOutTime: null,
          recordId: null,
        };
        await AsyncStorage.setItem(`ATT_STATE_${today}`, JSON.stringify(empty));
        await AsyncStorage.setItem('ATT_STATE_TODAY', today);
        await AsyncStorage.setItem('CURRENT_ATTENDANCE', JSON.stringify(empty));
        return {data: empty};
      }

      const mapped = {
        date: (todayRecord.date || today).slice(0, 10),
        isCheckedIn: !!todayRecord.isCheckedIn,
        isCheckedOut: !!todayRecord.isCheckedOut,
        checkInTime: todayRecord.checkInTime || null,
        checkOutTime: todayRecord.checkOutTime || null,
        recordId: todayRecord.id || todayRecord._id || null,
        // location không có từ API thì giữ nguyên trên slice khi merge
      };
      await AsyncStorage.setItem(`ATT_STATE_${mapped.date}`, JSON.stringify(mapped));
      await AsyncStorage.setItem('ATT_STATE_TODAY', mapped.date);
      await AsyncStorage.setItem('CURRENT_ATTENDANCE', JSON.stringify(mapped));
      return {data: mapped};
    } catch (error) {
      return rejectWithValue({message: 'Không thể đồng bộ trạng thái chấm công'});
    }
  },
);
