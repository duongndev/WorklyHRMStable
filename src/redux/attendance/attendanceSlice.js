import {createSlice} from '@reduxjs/toolkit';
import {
  checkIn,
  checkOut,
  getAttendanceRecords,
  loadCurrentAttendance,
  syncAttendanceState,
} from './attendanceAction';

const initialState = {
  attendanceRecords: [],
  currentAttendance: {
    date: null,
    isCheckedIn: false,
    isCheckedOut: false,
    checkInTime: null,
    checkOutTime: null,
    location: 'HNI FPT Tower, 10 Phạm Văn Bạch',
    recordId: null,
  },
  loadingCheckIn: false,
  loadingCheckOut: false,
  loadingHistory: false,
  error: null,
  message: '',
  pagination: {
    totalPages: 0,
    currentPage: 0,
    total: 0,
  },
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = '';
    },
    resetCurrentAttendance: state => {
      state.currentAttendance = {
        date: null,
        isCheckedIn: false,
        isCheckedOut: false,
        checkInTime: null,
        checkOutTime: null,
        location: 'HNI FPT Tower, 10 Phạm Văn Bạch',
        recordId: null,
      };
    },
  },
  extraReducers: builder => {
    // Check in cases
    builder
      .addCase(checkIn.pending, state => {
        state.loadingCheckIn = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loadingCheckIn = false;
        state.currentAttendance.isCheckedIn = action.payload.data.isCheckedIn;
        state.currentAttendance.checkInTime = action.payload.data.checkInTime;
        state.currentAttendance.isCheckedOut = action.payload.data.isCheckedOut;
        state.currentAttendance.recordId = action.payload.data.id ?? null;
        state.currentAttendance.date = (action.payload.data.date || new Date().toISOString()).slice(0, 10);
        // Cập nhật địa điểm chấm công từ response hoặc payload (chuẩn hoá chuỗi)
        {
          const respLoc = action.payload?.data?.location;
          const metaAddr = action.meta?.arg?.addressName;
          let normalized = state.currentAttendance.location;
          if (typeof respLoc === 'string') {
            normalized = respLoc;
          } else if (respLoc && typeof respLoc === 'object') {
            const lat = respLoc.lat ?? respLoc.latitude;
            const lng = respLoc.lng ?? respLoc.longitude;
            normalized = lat != null && lng != null ? `${lat}, ${lng}` : JSON.stringify(respLoc);
          } else if (metaAddr) {
            normalized = metaAddr;
          }
          state.currentAttendance.location = normalized;
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loadingCheckIn = false;
        state.error = action.payload?.message || 'Không thể check in';
        state.message = action.payload?.message || 'Không thể check in';
      })
      // Check out cases
      .addCase(checkOut.pending, state => {
        state.loadingCheckOut = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loadingCheckOut = false;
        state.currentAttendance.isCheckedIn = action.payload.data.isCheckedIn;
        state.currentAttendance.checkOutTime = action.payload.data.checkOutTime;
        state.currentAttendance.date = (action.payload.data.date || new Date().toISOString()).slice(0, 10);
        // Cập nhật địa điểm chấm công ra từ response hoặc payload (chuẩn hoá chuỗi)
        {
          const respLoc = action.payload?.data?.location;
          const metaAddr = action.meta?.arg?.addressName;
          let normalized = state.currentAttendance.location;
          if (typeof respLoc === 'string') {
            normalized = respLoc;
          } else if (respLoc && typeof respLoc === 'object') {
            const lat = respLoc.lat ?? respLoc.latitude;
            const lng = respLoc.lng ?? respLoc.longitude;
            normalized = lat != null && lng != null ? `${lat}, ${lng}` : JSON.stringify(respLoc);
          } else if (metaAddr) {
            normalized = metaAddr;
          }
          state.currentAttendance.location = normalized;
        }
        state.message = action.payload.message;
        state.error = null;
        // Reset current attendance after successful check out
        state.currentAttendance.isCheckedIn = false;
        state.currentAttendance.isCheckedOut = true;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loadingCheckOut = false;
        state.error = action.payload?.message || 'Không thể check out';
        state.message = action.payload?.message || 'Không thể check out';
      })
      // Get attendance records cases
      .addCase(getAttendanceRecords.pending, state => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(getAttendanceRecords.fulfilled, (state, action) => {
        state.loadingHistory = false;
        const records =
          action.payload?.data?.attendanceRecords ||
          action.payload?.data ||
          [];
        if (action.meta.arg.page > 1) {
          state.attendanceRecords = [...state.attendanceRecords, ...records];
        } else {
          state.attendanceRecords = records;
        }
        state.pagination = action.payload.pagination || {
          totalPages: 0,
          currentPage: 0,
          total: 0,
        };
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getAttendanceRecords.rejected, (state, action) => {
        state.loadingHistory = false;
        state.attendanceRecords = [];
        state.error =
          action.payload?.message || 'Không thể lấy lịch sử chấm công';
        state.message =
          action.payload?.message || 'Không thể lấy lịch sử chấm công';
      })
      // Load persisted current attendance
      .addCase(loadCurrentAttendance.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const loaded = action.payload.data;
          state.currentAttendance = {
            ...state.currentAttendance,
            ...loaded,
          };
          // Chuẩn hoá location nếu từ storage là object {lat,lng}
          const loc = loaded?.location;
          if (typeof loc === 'string') {
            state.currentAttendance.location = loc;
          } else if (loc && typeof loc === 'object') {
            const lat = loc.lat ?? loc.latitude;
            const lng = loc.lng ?? loc.longitude;
            state.currentAttendance.location = lat != null && lng != null ? `${lat}, ${lng}` : JSON.stringify(loc);
          }
        }
      })
      // Sync attendance with server (overwrite local with server values)
      .addCase(syncAttendanceState.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const synced = action.payload.data;
          state.currentAttendance = {
            ...state.currentAttendance,
            ...synced,
          };
          // Chuẩn hoá location nếu server trả object
          const loc = synced?.location;
          if (typeof loc === 'string') {
            state.currentAttendance.location = loc;
          } else if (loc && typeof loc === 'object') {
            const lat = loc.lat ?? loc.latitude;
            const lng = loc.lng ?? loc.longitude;
            state.currentAttendance.location = lat != null && lng != null ? `${lat}, ${lng}` : JSON.stringify(loc);
          }
        }
      });
  },
});

export const {clearError, clearMessage, resetCurrentAttendance} =
  attendanceSlice.actions;

export default attendanceSlice.reducer;
