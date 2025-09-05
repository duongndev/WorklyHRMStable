import axios from 'axios';
import {store} from '../redux/store';
const API_URL = 'http://10.0.2.2:8080/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  config => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// overtime
export const getAllOvertimeRequestsApi = async (status, page, limit) => {
  try {
    const response = await axiosClient.get(
      `/overtime/?status=${status}&page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy yêu cầu làm thêm giờ:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getOTDetailApi = async id => {
  try {
    const response = await axiosClient.get(`/overtime/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy chi tiết yêu cầu làm thêm giờ:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateStatusOTApi = async (id, status, note) => {
  try {
    const response = await axiosClient.put(`/overtime/${id}/status`, {
      status,
      note,
    });
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi cập nhật trạng thái yêu cầu làm thêm giờ:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const cancelOvertimeRequestApi = async id => {
  try {
    const response = await axiosClient.delete(`/overtime/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi hủy yêu cầu làm thêm giờ:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// leave
export const getAllLeaveApi = async (status, page, limit) => {
  try {
    const response = await axiosClient.get(
      `/leave-request/?status=${status}&page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy yêu cầu làm thêm giờ:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getLeaveDetailApi = async id => {
  try {
    const response = await axiosClient.get(`/leave-request/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy chi tiết yêu cầu nghỉ phép:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateStatusLeaveApi = async (id, status, note) => {
  try {
    const response = await axiosClient.put(`/leave-request/${id}/status`, {
      status,
      note,
    });
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi cập nhật trạng thái yêu cầu nghỉ phép:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Employee Management APIs
export const getAllEmployeesApi = async (page = 1, limit = 20) => {
  try {
    const response = await axiosClient.get(
      `/admin/employees?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy danh sách nhân viên:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getEmployeeDetailApi = async id => {
  try {
    const response = await axiosClient.get(`/admin/employees/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy thông tin nhân viên:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const createEmployeeApi = async employeeData => {
  try {
    const response = await axiosClient.post('/admin/employees', employeeData);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi tạo nhân viên:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateEmployeeApi = async (id, employeeData) => {
  try {
    const response = await axiosClient.put(
      `/admin/employees/${id}`,
      employeeData,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi cập nhật nhân viên:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateEmployeeStatusApi = async (id, status, note) => {
  try {
    const response = await axiosClient.put(`/admin/employees/${id}/status`, {
      status,
      note,
    });
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi cập nhật trạng thái nhân viên:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteEmployeeApi = async id => {
  try {
    const response = await axiosClient.delete(`/admin/employees/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi xóa nhân viên:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Attendance Management APIs
export const getAllAttendanceApi = async params => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosClient.get(`/admin/attendance?${queryString}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy danh sách chấm công:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAttendanceDetailApi = async id => {
  try {
    const response = await axiosClient.get(`/admin/attendance/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy chi tiết chấm công:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateAttendanceApi = async (id, attendanceData) => {
  try {
    const response = await axiosClient.put(
      `/admin/attendance/${id}`,
      attendanceData,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi cập nhật chấm công:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteAttendanceApi = async id => {
  try {
    const response = await axiosClient.delete(`/admin/attendance/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi xóa bản ghi chấm công:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAttendanceReportApi = async params => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosClient.get(
      `/admin/attendance/report?${queryString}`,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy báo cáo chấm công:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const exportAttendanceReportApi = async params => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosClient.get(
      `/admin/attendance/export?${queryString}`,
      {
        responseType: 'blob',
      },
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi xuất báo cáo chấm công:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Dashboard APIs
export const getDashboardStatsApi = async () => {
  try {
    const response = await axiosClient.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy thống kê dashboard:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Notification APIs
export const getAllNotificationsApi = async (page = 1, limit = 20) => {
  try {
    const response = await axiosClient.get(
      `/notifications?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy danh sách thông báo:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const createNotificationApi = async notificationData => {
  try {
    const response = await axiosClient.post(
      '/admin/notifications',
      notificationData,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi tạo thông báo:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateNotificationApi = async (id, notificationData) => {
  try {
    const response = await axiosClient.put(
      `/admin/notifications/${id}`,
      notificationData,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi cập nhật thông báo:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteNotificationApi = async id => {
  try {
    const response = await axiosClient.delete(`/admin/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi xóa thông báo:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Schedule Management APIs
export const getAllSchedulesApi = async params => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosClient.get(`/admin/schedules?${queryString}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi lấy danh sách lịch làm việc:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const createScheduleApi = async scheduleData => {
  try {
    const response = await axiosClient.post('/admin/schedules', scheduleData);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi tạo lịch làm việc:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateScheduleApi = async (id, scheduleData) => {
  try {
    const response = await axiosClient.put(
      `/admin/schedules/${id}`,
      scheduleData,
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi cập nhật lịch làm việc:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteScheduleApi = async id => {
  try {
    const response = await axiosClient.delete(`/admin/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi xóa lịch làm việc:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const assignScheduleToEmployeeApi = async (scheduleId, employeeIds) => {
  try {
    const response = await axiosClient.post(
      `/admin/schedules/${scheduleId}/assign`,
      {
        employeeIds,
      },
    );
    return response.data;
  } catch (error) {
    console.log(
      'Lỗi khi gán lịch làm việc:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
