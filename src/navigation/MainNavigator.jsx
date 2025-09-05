import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';


// Import screens
import HomeScreen from '../screens/employee/home/HomeScreen';
import AttendanceScreen from '../screens/employee/attendance/AttendanceScreen';
import LeaveRequestScreen from '../screens/employee/leave/LeaveRequestScreen';
import OvertimeRequestScreen from '../screens/employee/overtime/OvertimeRequestScreen';
import WorkScheduleScreen from '../screens/employee/schedule/WorkScheduleScreen';
import ProfileScreen from '../screens/employee/profile/ProfileScreen';
import LeaveRequestDetailScreen from '../screens/employee/leave/LeaveRequestDetailScreen';
import OvertimeRequestDetailScreen from '../screens/employee/overtime/OvertimeRequestDetailScreen';
import NotificationScreen from '../screens/employee/notification/NotificationScreen';
import WeeklyScheduleScreen from '../screens/employee/schedule/WeeklyScheduleScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="LeaveRequest"
        component={LeaveRequestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OvertimeRequest"
        component={OvertimeRequestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WorkSchedule"
        component={WorkScheduleScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LeaveRequestDetail"
        component={LeaveRequestDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OvertimeRequestDetail"
        component={OvertimeRequestDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WeeklyScheduleScreen"
        component={WeeklyScheduleScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          display: navigation.getState().routes[navigation.getState().index].state?.index > 0 ? 'none' : 'flex',
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AttendanceTab"
        component={AttendanceScreen}
        options={{
          tabBarLabel: 'Chấm công',
          tabBarIcon: ({ color, size }) => (
            <Icon name="finger-print-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScheduleTab"
        component={WeeklyScheduleScreen}
        options={{
          tabBarLabel: 'Lịch làm việc',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
