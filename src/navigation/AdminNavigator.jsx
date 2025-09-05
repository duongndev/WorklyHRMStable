import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens admin
import AdminHomeScreen from '../screens/admin/home/AdminHomeScreen';
import AdminOTScreen from '../screens/admin/overtime/AdminOTScreen';
import AdminDetailOTScreen from '../screens/admin/overtime/AdminOTDetailScreen';
import AdminLeaveScreen from '../screens/admin/leave/AdminLeaveScreen';
import AdminLeaveDetailScreen from '../screens/admin/leave/AdminLeaveDetailScreen';
import AdminCreateScheduleScreen from '../screens/admin/schedule/AdminCreateScheduleScreen';

// Employee Management
import AdminEmployeeScreen from '../screens/admin/employee/AdminEmployeeScreen';
import AdminEmployeeDetailScreen from '../screens/admin/employee/AdminEmployeeDetailScreen';
import AdminAddEmployeeScreen from '../screens/admin/employee/AdminAddEmployeeScreen';
import AdminEditEmployeeScreen from '../screens/admin/employee/AdminEditEmployeeScreen';

// Attendance Management
import AdminAttendanceScreen from '../screens/admin/attendance/AdminAttendanceScreen';
import AdminAttendanceDetailScreen from '../screens/admin/attendance/AdminAttendanceDetailScreen';
import AdminAttendanceReportScreen from '../screens/admin/attendance/AdminAttendanceReportScreen';

// Notification Management
import AdminNotificationScreen from '../screens/admin/notification/AdminNotificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* Main Dashboard */}
      <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
      
      {/* Employee Management */}
      <Stack.Screen name="AdminEmployeeScreen" component={AdminEmployeeScreen} />
      <Stack.Screen name="AdminEmployeeDetailScreen" component={AdminEmployeeDetailScreen} />
      <Stack.Screen name="AdminAddEmployeeScreen" component={AdminAddEmployeeScreen} />
      <Stack.Screen name="AdminEditEmployeeScreen" component={AdminEditEmployeeScreen} />
      
      {/* Attendance Management */}
      <Stack.Screen name="AdminAttendanceScreen" component={AdminAttendanceScreen} />
      <Stack.Screen name="AdminAttendanceDetailScreen" component={AdminAttendanceDetailScreen} />
      <Stack.Screen name="AdminAttendanceReportScreen" component={AdminAttendanceReportScreen} />
      
      {/* Leave Management */}
      <Stack.Screen name="AdminLeaveScreen" component={AdminLeaveScreen} />
      <Stack.Screen name="AdminLeaveDetailScreen" component={AdminLeaveDetailScreen} />
      
      {/* Overtime Management */}
      <Stack.Screen name="AdminOTScreen" component={AdminOTScreen} />
      <Stack.Screen name="AdminDetailOTScreen" component={AdminDetailOTScreen} />
      
      {/* Schedule Management */}
      <Stack.Screen name="AdminCreateScheduleScreen" component={AdminCreateScheduleScreen} />
      
      {/* Notification Management */}
      <Stack.Screen name="AdminNotificationScreen" component={AdminNotificationScreen} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
