import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  SafeAreaView,
} from 'react-native';
import CheckInOutBoxComponent from '../../../components/CheckInOutBoxComponent';
import FeatureCompomnent from '../../../components/FeatureCompomnent';
import HeaderHome from '../../../components/HeaderHome';
import NotifiHomeComponent from '../../../components/NotifiHomeComponent';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { loadCurrentAttendance } from '../../../redux/attendance/attendanceAction';
import { getUnreadNotificationCount } from '../../../redux/notification/notificationAction';
import { getDailySchedules } from '../../../redux/schedule/scheduleAction';
import ScheduleCard from '../../../components/WorkSchedule/DailyScheduleCard';
import { formatCurrentTime, formatTime } from '../../../utils/formatDateTime';

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const dailySchedules = useSelector(state => state.schedule.dailySchedules);
  const notificationCount = useSelector(state => state.notification.count);
  const dispatch = useDispatch();
  const { currentAttendance } = useSelector(state => state.attendance);
  const {
    checkInTime,
    checkOutTime,
    location,
  } = currentAttendance;

  // const location = 'HNI FPT Tower, 10 Phạm Văn Bạch';

  // Khôi phục trạng thái chấm công khi mở app để Home luôn hiển thị giờ đã lưu
  useEffect(() => {
    dispatch(loadCurrentAttendance());
  }, [dispatch]);

  // get daily schedules - chỉ gọi một lần khi component mount
  useEffect(() => {
    const fetchDailySchedules = async () => {
      // Chỉ fetch nếu chưa có data hoặc data đã cũ (có thể thêm timestamp check)
      if (!dailySchedules || dailySchedules.length === 0) {
        const resultAction = await dispatch(getDailySchedules());

        if (getDailySchedules.rejected.match(resultAction)) {
          console.error('Failed to fetch daily schedules:', resultAction.payload?.message);
        }
      }
    };
    fetchDailySchedules();
  }, []); // Chỉ chạy một lần khi mount

  // get notification count - chỉ gọi một lần khi component mount
  useEffect(() => {
    const fetchNotificationCount = async () => {
      // Chỉ fetch nếu chưa có data
      if (notificationCount === null || notificationCount === undefined) {
        const resultAction = await dispatch(getUnreadNotificationCount());

        if (getUnreadNotificationCount.rejected.match(resultAction)) {
          console.error('Failed to fetch notification count:', resultAction.payload?.message);
        }
      }
    };
    fetchNotificationCount();
  }, []); // Chỉ chạy một lần khi mount

  const navToOT = () => {
    navigation.navigate('OvertimeRequest');
  };
  const navToLeave = () => {
    navigation.navigate('LeaveRequest');
  };
  const navToWorkSchedule = () => {
    // navigation.navigate('WorkSchedule');
    navigation.navigate('WeeklyScheduleScreen');
  };
  const navToAttendance = () => {
    navigation.navigate('Attendance');
  };
  const navToNotification = () => {
    navigation.navigate('Notification');
  };

  const renderHeader = () => (
    <>
      <HeaderHome
        username={user?.fullName}
        onNotificationPress={navToNotification}
        unreadCount={notificationCount}
      />
      <CheckInOutBoxComponent
        checkInTime={checkInTime}
        checkOutTime={checkOutTime}
        location={location}
      />
    </>
  );

  const renderFeatures = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Tính năng</Text>
      <FeatureCompomnent
        toAttendance={navToAttendance}
        toLeaveRequest={navToLeave}
        toOvertimeRequest={navToOT}
        toWorkSchedule={navToWorkSchedule}
      />
    </View>
  );

  const renderDaily = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Lịch làm việc hôm nay</Text>
      <ScheduleCard schedules={dailySchedules} />
    </View>
  );

  const sections = [
    { id: 'header', render: renderHeader },
    { id: 'features', render: renderFeatures },
    { id: 'daily', render: renderDaily },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={sections}
        renderItem={({ item }) => item.render()}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        contentContainerStyle={styles.scrollContent}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
