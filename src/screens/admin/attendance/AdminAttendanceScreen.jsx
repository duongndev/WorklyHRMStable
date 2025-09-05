import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from '../../../components/HeaderScreen';
import ViewEmptyComponent from '../../../components/ViewEmptyComponent';
import StatusFilter from '../../../components/StatusFilter';
import { getAllAttendanceApi } from '../../../services/AdminApiService';
import { formatDateTime } from '../../../utils/formatDateTime';

const AdminAttendanceScreen = () => {
  const navigation = useNavigation();
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đúng giờ', value: 'on_time' },
    { label: 'Muộn', value: 'late' },
    { label: 'Sớm', value: 'early' },
    { label: 'Vắng mặt', value: 'absent' },
  ];

  useEffect(() => {
    fetchAttendance();
  }, [selectedStatus, selectedDate]);

  useEffect(() => {
    filterAttendance();
  }, [searchText, attendanceList]);

  const fetchAttendance = async (page = 1, isRefresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await getAllAttendanceApi({
        status: selectedStatus === 'all' ? '' : selectedStatus,
        date: selectedDate,
        page,
        limit: 20
      });

      if (response.success) {
        const newAttendance = isRefresh ? response.data.attendance : [...attendanceList, ...response.data.attendance];
        setAttendanceList(newAttendance);
        setHasMore(response.data.hasMore);
        setCurrentPage(page);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách chấm công');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAttendance = () => {
    if (!searchText.trim()) {
      setFilteredAttendance(attendanceList);
    } else {
      const filtered = attendanceList.filter(item =>
        item.employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.employee.employeeId.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredAttendance(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchAttendance(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchAttendance(currentPage + 1);
    }
  };

  const handleAttendancePress = (attendance) => {
    navigation.navigate('AdminAttendanceDetailScreen', { attendance });
  };

  const handleExportReport = () => {
    navigation.navigate('AdminAttendanceReportScreen');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_time': return '#4CAF50';
      case 'late': return '#FF9800';
      case 'early': return '#2196F3';
      case 'absent': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'on_time': return 'Đúng giờ';
      case 'late': return 'Muộn';
      case 'early': return 'Sớm';
      case 'absent': return 'Vắng mặt';
      default: return status;
    }
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '0h 0m';

    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const diffMs = checkOutTime - checkInTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMinutes}m`;
  };

  const renderAttendanceItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.attendanceItem}
        onPress={() => handleAttendancePress(item)}
      >
        <View style={styles.attendanceInfo}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.employeeName}>{item.employee.fullName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>

          <Text style={styles.employeeId}>ID: {item.employee.employeeId}</Text>
          <Text style={styles.dateText}>{formatDateTime.formatDate(item.date)}</Text>

          <View style={styles.timeInfo}>
            <View style={styles.timeItem}>
              <Icon name="log-in-outline" size={16} color="#4CAF50" />
              <Text style={styles.timeText}>
                Vào: {item.checkIn ? formatDateTime.formatTime(item.checkIn) : '--:--'}
              </Text>
            </View>

            <View style={styles.timeItem}>
              <Icon name="log-out-outline" size={16} color="#F44336" />
              <Text style={styles.timeText}>
                Ra: {item.checkOut ? formatDateTime.formatTime(item.checkOut) : '--:--'}
              </Text>
            </View>
          </View>

          <View style={styles.workingHours}>
            <Icon name="time-outline" size={16} color="#666" />
            <Text style={styles.workingHoursText}>
              Làm việc: {calculateWorkingHours(item.checkIn, item.checkOut)}
            </Text>
          </View>
        </View>

        <Icon name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Quản lý chấm công"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleExportReport}>
            <Icon name="document-text-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm nhân viên..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <StatusFilter
            options={statusOptions}
            selectedValue={selectedStatus}
            onValueChange={setSelectedStatus}
          />

          <TouchableOpacity
            style={styles.dateFilter}
            onPress={() => {/* Open date picker */ }}
          >
            <Icon name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dateFilterText}>
              {selectedDate || 'Chọn ngày'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredAttendance.length}</Text>
            <Text style={styles.statLabel}>Tổng số</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
              {filteredAttendance.filter(item => item.status === 'on_time').length}
            </Text>
            <Text style={styles.statLabel}>Đúng giờ</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#FF9800' }]}>
              {filteredAttendance.filter(item => item.status === 'late').length}
            </Text>
            <Text style={styles.statLabel}>Muộn</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F44336' }]}>
              {filteredAttendance.filter(item => item.status === 'absent').length}
            </Text>
            <Text style={styles.statLabel}>Vắng</Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredAttendance}
          keyExtractor={(item) => `${item.id}-${item.date}`}
          renderItem={renderAttendanceItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={
            <ViewEmptyComponent
              title="Không có dữ liệu chấm công"
              description="Chưa có dữ liệu chấm công nào"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default AdminAttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  dateFilterText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  employeeId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  workingHours: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workingHoursText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
});