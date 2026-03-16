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

const { width } = Dimensions.get('window');

// Nhóm chức năng theo danh mục
const featureGroups = [
  {
    title: 'Chấm công',
    features: [
      {
        id: 'att-1',
        title: 'Chấm công',
        description: 'Quản lý chấm công nhân viên',
        icon: 'finger-print',
        screen: 'AdminAttendanceScreen',
        color: '#2196F3',
      },
    ],
    actions: [
      {
        title: 'Báo cáo chấm công',
        description: 'Xem thống kê',
        icon: 'document-text-outline',
        color: '#4CAF50',
        screen: 'AdminAttendanceReportScreen',
      },
    ],
  },
  {
    title: 'Nghỉ phép & OT',
    features: [
      {
        id: 'leave-1',
        title: 'Nghỉ phép',
        description: 'Duyệt đơn xin nghỉ phép',
        icon: 'calendar',
        screen: 'AdminLeaveScreen',
        color: '#4CAF50',
      },
      {
        id: 'ot-1',
        title: 'OT',
        description: 'Quản lý làm thêm giờ',
        icon: 'time',
        screen: 'AdminOTScreen',
        color: '#FF9800',
      },
    ],
    actions: [],
  },
  {
    title: 'Lịch làm việc',
    features: [
      {
        id: 'sched-1',
        title: 'Lịch làm việc',
        description: 'Sắp xếp ca làm việc, lịch làm việc',
        icon: 'calendar',
        screen: 'AdminCreateScheduleScreen',
        color: '#9C27B0',
      },
    ],
    actions: [
      {
        title: 'Tạo lịch làm việc',
        description: 'Sắp xếp ca làm',
        icon: 'calendar-outline',
        color: '#9C27B0',
        screen: 'AdminCreateScheduleScreen',
      },
    ],
  },
  {
    title: 'Nhân sự',
    features: [
      {
        id: 'emp-1',
        title: 'Nhân viên',
        description: 'Quản lý thông tin nhân viên',
        icon: 'people',
        screen: 'AdminEmployeeScreen',
        color: '#F44336',
      },
    ],
    actions: [
      {
        title: 'Thêm nhân viên',
        description: 'Tạo tài khoản mới',
        icon: 'person-add-outline',
        color: '#007AFF',
        screen: 'AdminAddEmployeeScreen',
      },
    ],
  },
  {
    title: 'Thông báo',
    features: [
      {
        id: 'notif-1',
        title: 'Thông báo',
        description: 'Gửi thông báo đến toàn bộ nhân viên',
        icon: 'notifications',
        screen: 'AdminNotificationScreen',
        color: '#646389',
      },
    ],
    actions: [
      {
        title: 'Gửi thông báo',
        description: 'Thông báo toàn bộ',
        icon: 'notifications-outline',
        color: '#FF9800',
        screen: 'AdminNotificationScreen',
      },
    ],
  },
];

const StatCard = ({ title, value, subtitle, icon, color, onPress }) => (
  <TouchableOpacity
    style={[styles.statCard, { borderLeftColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.statContent}>
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{title}</Text>
        <Icon name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle ? <Text style={styles.statSubtitle}>{subtitle}</Text> : null}
    </View>
  </TouchableOpacity>
);

const QuickAction = ({ title, description, icon, color, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
      <Icon name={icon} size={18} color={color} />
    </View>
    <View style={styles.quickActionContent}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionDescription}>{description}</Text>
    </View>
    <Icon name="chevron-forward" size={16} color="#666" />
  </TouchableOpacity>
);

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStatsApi();
      if (response?.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.log('Error fetching dashboard stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const handleFeaturePress = feature => {
    if (feature?.screen) {
      navigation.navigate(feature.screen);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome username={user?.fullName} />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {dashboardStats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tổng quan hôm nay</Text>

            <View style={styles.statsGroup}>
              <Text style={styles.groupTitle}>Người dùng</Text>
              <View style={styles.statsRow}>
                <StatCard
                  key="users-total"
                  title="Tổng người dùng"
                  value={dashboardStats?.users?.total ?? 0}
                  subtitle={`Hoạt động: ${dashboardStats?.users?.active ?? 0}`}
                  icon="people-outline"
                  color="#007AFF"
                  onPress={() => navigation.navigate('AdminEmployeeScreen')}
                />
              </View>
            </View>

            <View style={styles.statsGroup}>
              <Text style={styles.groupTitle}>Chấm công</Text>
              <View style={styles.statsRow}>
                <StatCard
                  key="attendance-checkedIn"
                  title="Đã chấm công hôm nay"
                  value={dashboardStats?.attendance?.checkedIn ?? 0}
                  subtitle={`Đi muộn: ${dashboardStats?.attendance?.late ?? 0}`}
                  icon="checkmark-circle-outline"
                  color="#4CAF50"
                  onPress={() => navigation.navigate('AdminAttendanceScreen')}
                />
              </View>
            </View>

            <View style={styles.statsGroup}>
              <Text style={styles.groupTitle}>Nghỉ phép</Text>
              <View style={styles.statsRow}>
                <StatCard
                  key="leaves-pending"
                  title="Chờ duyệt"
                  value={dashboardStats?.leaves?.pending ?? 0}
                  subtitle={`Đã duyệt: ${dashboardStats?.leaves?.approved ?? 0}`}
                  icon="calendar-outline"
                  color="#FF9800"
                  onPress={() => navigation.navigate('AdminLeaveScreen')}
                />
                <StatCard
                  key="leaves-thisMonth"
                  title="Tháng này"
                  value={dashboardStats?.leaves?.thisMonth ?? 0}
                  subtitle={`Từ chối: ${dashboardStats?.leaves?.rejected ?? 0}`}
                  icon="calendar-number-outline"
                  color="#F57C00"
                  onPress={() => navigation.navigate('AdminLeaveScreen')}
                />
              </View>
            </View>

            <View style={styles.statsGroup}>
              <Text style={styles.groupTitle}>Làm thêm giờ (OT)</Text>
              <View style={styles.statsRow}>
                <StatCard
                  key="overtime-pending"
                  title="Chờ duyệt"
                  value={dashboardStats?.overtime?.pending ?? 0}
                  subtitle={`Đã duyệt: ${dashboardStats?.overtime?.approved ?? 0}`}
                  icon="time-outline"
                  color="#9C27B0"
                  onPress={() => navigation.navigate('AdminOTScreen')}
                />
                <StatCard
                  key="overtime-totalHours"
                  title="Giờ OT tháng này"
                  value={dashboardStats?.overtime?.totalHoursThisMonth ?? 0}
                  subtitle={`Từ chối: ${dashboardStats?.overtime?.rejected ?? 0}`}
                  icon="timer-outline"
                  color="#6A1B9A"
                  onPress={() => navigation.navigate('AdminOTScreen')}
                />
              </View>
            </View>

            <View style={styles.statsGroup}>
              <Text style={styles.groupTitle}>Thông báo</Text>
              <View style={styles.statsRow}>
                <StatCard
                  key="notifications-total"
                  title="Tổng thông báo"
                  value={dashboardStats?.notifications?.total ?? 0}
                  subtitle={`Chưa đọc: ${dashboardStats?.notifications?.unread ?? 0}`}
                  icon="notifications-outline"
                  color="#646389"
                  onPress={() => navigation.navigate('AdminNotificationScreen')}
                />
              </View>
            </View>
          </View>
        )}

        {featureGroups.map(group => (
          <View style={styles.section} key={group.title}>
            <Text style={styles.sectionTitle}>{group.title}</Text>

            <View style={styles.menuGrid}>
              {group.features.map(feature => (
                <TouchableOpacity
                  key={feature.id}
                  style={styles.menuItem}
                  onPress={() => handleFeaturePress(feature)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${feature.color}20` }]}>
                    <Icon name={feature.icon} size={24} color={feature.color} />
                  </View>

                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{feature.title}</Text>
                    <Text style={styles.menuItemDescription}>{feature.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {group.actions && group.actions.length > 0 && (
              <View style={[styles.quickActionsGrid, styles.quickActionsWrapper]}>
                {group.actions.map(action => (
                  <QuickAction
                    key={`${group.title}-${action.title}`}
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    color={action.color}
                    onPress={() => navigation.navigate(action.screen)}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
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
  statsGroup: {
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 44) / 2,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 12,
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
  quickActionsGrid: {
    marginTop: 8,
  },
  quickActionsWrapper: {
    marginTop: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    marginBottom: 8,
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
  menuGrid: {
    flexDirection: 'column',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 12,
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
