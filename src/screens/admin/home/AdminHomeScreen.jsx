import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import HeaderHome from '../../../components/HeaderHome';
import Icon from 'react-native-vector-icons/Ionicons';
import { getDashboardStatsApi } from '../../../services/AdminApiService';
import { AdminNavigationHelpers } from '../../../navigation/AdminNavigator';

const { width } = Dimensions.get('window');

const adminFeatures = [
  {
    id: '1',
    title: 'Chấm công',
    description: 'Quản lý chấm công nhân viên',
    icon: 'finger-print',
    screen: 'AdminAttendanceScreen',
    color: '#2196F3',
  },
  {
    id: '2',
    title: 'Nghỉ phép',
    description: 'Duyệt đơn xin nghỉ phép',
    icon: 'calendar',
    screen: 'AdminLeaveScreen',
    color: '#4CAF50',
  },
  {
    id: '3',
    title: 'OT',
    description: 'Quản lý làm thêm giờ',
    icon: 'time',
    screen: 'AdminOTScreen',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Lịch làm việc',
    description: 'Sắp xếp ca làm việc, lịch làm việc',
    icon: 'calendar',
    screen: 'AdminCreateScheduleScreen',
    color: '#9C27B0',
  },
  {
    id: '5',
    title: 'Nhân viên',
    description: 'Quản lý thông tin nhân viên',
    icon: 'people',
    screen: 'AdminEmployeeScreen',
    color: '#F44336',
  },
  {
    id: '6',
    title: 'Thông báo',
    description: 'Gửi thông báo đến toàn bộ nhân viên',
    icon: 'notifications',
    screen: 'AdminNotificationScreen',
    color: '#646389',
  },
];

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await getDashboardStatsApi();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.log('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const handleFeaturePress = feature => {
    if (feature.screen) {
      navigation.navigate(feature.screen);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        <View style={styles.statHeader}>
          <Text style={styles.statTitle}>{title}</Text>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
      <Icon name="chevron-forward" size={16} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome username={user.fullName} />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Dashboard Stats */}
        {dashboardStats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tổng quan hôm nay</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Tổng nhân viên"
                value={dashboardStats.totalEmployees}
                icon="people-outline"
                color="#007AFF"
                onPress={() => navigation.navigate('AdminEmployeeScreen')}
              />
              <StatCard
                title="Đã chấm công"
                value={dashboardStats.todayAttendance}
                subtitle={`${dashboardStats.attendanceRate}% tổng số`}
                icon="checkmark-circle-outline"
                color="#4CAF50"
                onPress={() => navigation.navigate('AdminAttendanceScreen')}
              />
              <StatCard
                title="Đơn nghỉ phép"
                value={dashboardStats.pendingLeaves}
                subtitle="Chờ duyệt"
                icon="calendar-outline"
                color="#FF9800"
                onPress={() => navigation.navigate('AdminLeaveScreen')}
              />
              <StatCard
                title="Đơn OT"
                value={dashboardStats.pendingOvertimes}
                subtitle="Chờ duyệt"
                icon="time-outline"
                color="#9C27B0"
                onPress={() => navigation.navigate('AdminOTScreen')}
              />
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hành động nhanh</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Thêm nhân viên"
              description="Tạo tài khoản mới"
              icon="person-add-outline"
              color="#007AFF"
              onPress={() => navigation.navigate('AdminAddEmployeeScreen')}
            />
            <QuickAction
              title="Báo cáo chấm công"
              description="Xem thống kê"
              icon="document-text-outline"
              color="#4CAF50"
              onPress={() => navigation.navigate('AdminAttendanceReportScreen')}
            />
            <QuickAction
              title="Tạo lịch làm việc"
              description="Sắp xếp ca làm"
              icon="calendar-outline"
              color="#9C27B0"
              onPress={() => navigation.navigate('AdminScheduleScreen')}
            /> 
            <QuickAction
              title="Gửi thông báo"
              description="Thông báo toàn bộ"
              icon="notifications-outline"
              color="#FF9800"
              onPress={() => navigation.navigate('AdminNotificationScreen')}
            />
          </View>
        </View>

        {/* Main Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chức năng quản lý</Text>
          <View style={styles.menuGrid}>
            {adminFeatures.map(feature => (
              <TouchableOpacity
                key={feature.id}
                style={styles.menuItem}
                onPress={() => handleFeaturePress(feature)}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: feature.color + '20' },
                  ]}>
                  <Icon name={feature.icon} size={24} color={feature.color} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{feature.title}</Text>
                  <Text style={styles.menuItemDescription}>
                    {feature.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 10,
  },
  // Stats Cards
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 44) / 2,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
  },
  // Quick Actions
  quickActionsGrid: {
    gap: 8,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
    marginLeft: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 11,
    color: '#666',
  },
  // Main Menu
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#666',
  },
});
