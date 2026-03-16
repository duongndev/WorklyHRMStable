import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../redux/store';
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Tạo instance axios riêng để luôn gửi User-Agent
const nominatimApi = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  timeout: 10000,
  headers: {
    'User-Agent': 'WorklyHR/1.0 (worklyhr@gmail.com)',
    'Accept-Language': 'vi',
  },
});

// Throttle for Nominatim: 1 request/second
let nominatimThrottleChain = Promise.resolve();
let nominatimNextAvailableAt = 0;
const NOMINATIM_THROTTLE_MS = 1000;

nominatimApi.interceptors.request.use(async config => {
  // Chain delays to serialize requests at most 1/second
  const now = Date.now();
  const waitMs = Math.max(0, nominatimNextAvailableAt - now);
  nominatimThrottleChain = nominatimThrottleChain.then(
    () =>
      new Promise(resolve => {
        setTimeout(resolve, waitMs);
      }),
  );
  await nominatimThrottleChain;
  nominatimNextAvailableAt = Date.now() + NOMINATIM_THROTTLE_MS;
  return config;
});

// In-memory cache for reverse geocoding results
const reverseGeocodeCache = new Map();
const REVERSE_GEOCODE_TTL = 10 * 60 * 1000; // 10 minutes
const formatCoordKey = (lat, lon) => {
  // Round to 5 decimals to avoid tiny jitter causing cache misses (~1m precision)
  const rlat = Number(lat).toFixed(5);
  const rlon = Number(lon).toFixed(5);
  return `${rlat},${rlon}`;
};


axiosClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginApi = async (email, password) => {
  try {
    const response = await axiosClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi khi đăng nhập:', error.response?.data || error.message);
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi đăng xuất:', error.response?.data || error.message);
    throw error;
  }
};

// update fcm token
export const updateFCMTokenApi = async (fcmToken) => {
  try {
    const response = await axiosClient.put('/auth/update-fcm-token', {
      fcmToken,
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi khi cập nhật FCM token:', error.response?.data || error.message);
    throw error;
  }
};

export const getProfileApi = async () => {
  try {
    const response = await axiosClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy hồ sơ:', error.response?.data || error.message);
    throw error;
  }
};

export const getLeaveRequestsApi = async (status, page, limit) => {
  try {
    const response = await axiosClient.get(`/leave-request/myleave?status=${status}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy yêu cầu nghỉ phép:', error.response?.data || error.message);
    throw error;
  }
};

export const getLeaveRequestDetailApi = async (id) => {
  try {
    const response = await axiosClient.get(`/leave-request/${id}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy chi tiết yêu cầu nghỉ phép:', error.response?.data || error.message);
    throw error;
  }
};

export const createLeaveRequestApi = async (leaveRequest) => {
  try {
    const response = await axiosClient.post('/leave-request', leaveRequest);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi tạo yêu cầu nghỉ phép:', error.response?.data || error.message);
    throw error;
  }
};

export const updateLeaveRequestApi = async (id, leaveRequest) => {
  try {
    const response = await axiosClient.put(`/leave-request/${id}`, leaveRequest);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi cập nhật yêu cầu nghỉ phép:', error.response?.data || error.message);
    throw error;
  }
};

export const cancelLeaveRequestApi = async (id) => {
  try {
    const response = await axiosClient.delete(`/leave-request/${id}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi hủy yêu cầu nghỉ phép:', error.response?.data || error.message);
    throw error;
  }
};

export const getOvertimeRequestsApi = async (status, page, limit) => {
  try {
    const response = await axiosClient.get(`/overtime/myot?status=${status}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy yêu cầu làm thêm giờ:', error.response?.data || error.message);
    throw error;
  }
};

export const getOvertimeRequestDetailApi = async (id) => {
  try {
    const response = await axiosClient.get(`/overtime/${id}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy chi tiết yêu cầu làm thêm giờ:', error.response?.data || error.message);
    throw error;
  }
};

export const createOvertimeRequestApi = async (overtimeRequest) => {
  try {
    const response = await axiosClient.post('/overtime', overtimeRequest);
    return response.data;
  } catch (error) {
    // console.log('Lỗi khi tạo yêu cầu làm thêm giờ:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateOvertimeRequestApi = async (id, overtimeRequest) => {
  try {
    const response = await axiosClient.put(`/overtime/${id}`, overtimeRequest);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi cập nhật yêu cầu làm thêm giờ:', error.response?.data || error.message);
    throw error;
  }
};

export const cancelOvertimeRequestApi = async (id) => {
  try {
    const response = await axiosClient.delete(`/overtime/${id}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi hủy yêu cầu làm thêm giờ:', error.response?.data || error.message);
    throw error;
  }
};

// schedules
export const getMySchedulesWeekApi = async () => {
  try {
    const response = await axiosClient.get('/work-schedules/my-weekly');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy lịch làm việc theo tuần:', error.response?.data || error.message);
    throw error;
  }
};
export const getMySchedulesMonthApi = async () => {
  try {
    const response = await axiosClient.get('/work-schedules/monthly-schedules');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy lịch làm việc theo tháng:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getMyWeekSchedulesApi = async () => {
  try {
    const response = await axiosClient.get('/work-schedules/week-schedules');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy lịch làm việc theo tháng:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getDailySchedulesApi = async () => {
  try {
    const response = await axiosClient.get('/work-schedules/daily-schedules');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy lịch làm việc:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};



// notification
export const getMyNotificaionApi = async () => {
  try {
    const response = await axiosClient.get('/notifications/');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy thông báo:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const getUnreadNotificationCountApi = async () => {
  try {
    const response = await axiosClient.get('/notifications/count');
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy số lượng thông báo:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// attendance
export const checkInApi = async (checkInData) => {
  try {
    const response = await axiosClient.post('/attendance/check-in', checkInData);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi check in:', error.response?.data || error.message);
    throw error;
  }
};

export const checkOutApi = async (checkOutData) => {
  try {
    const response = await axiosClient.post('/attendance/check-out', checkOutData);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi check out:', error.response?.data || error.message);
    throw error;
  }
};

export const getAttendanceRecordsApi = async (page, limit) => {
  try {
    const response = await axiosClient.get(`/attendance/my-records?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy lịch sử chấm công:', error.response?.data || error.message);
    throw error;
  }
};

// Reverse geocoding via OpenStreetMap Nominatim using axios
export const reverseGeocodeApi = async (latitude, longitude, language = 'vi') => {
  try {
    const key = `${formatCoordKey(latitude, longitude)}|${language}`;
    const now = Date.now();
    const cached = reverseGeocodeCache.get(key);
    if (cached && now < cached.expiresAt) {
      return cached.data;
    }
    const response = await nominatimApi.get('/reverse', {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 18,  // zoom cao hơn để có chi tiết địa chỉ
        addressdetails: 1,
        'accept-language': language,
      },
    });
    // cache the successful response
    reverseGeocodeCache.set(key, {
      data: response.data,
      expiresAt: now + REVERSE_GEOCODE_TTL,
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy địa chỉ:', error.response?.data || error.message);
    throw error;
  }
};





