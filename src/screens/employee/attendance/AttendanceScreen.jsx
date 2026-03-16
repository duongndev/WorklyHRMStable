import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import HeaderScreen from '../../../components/HeaderScreen';
import AttendanceCard from '../../../components/Attendance/AttendanceCard';
import AttendanceTimeCard from '../../../components/Attendance/AttendanceTimeCard';
import CheckInOutButton from '../../../components/Attendance/CheckInOutButton';
import { useSelector, useDispatch } from 'react-redux';
import {
  checkIn,
  checkOut,
  getAttendanceRecords,
  loadCurrentAttendance,
} from '../../../redux/attendance/attendanceAction';
import { reverseGeocodeApi } from '../../../services/ApiService';
// removed unused actions

const AttendanceScreen = () => {
  const dispatch = useDispatch();
  const {
    attendanceRecords,
    currentAttendance,
    loadingCheckIn,
    loadingCheckOut,
    loadingHistory,
    pagination,
  } = useSelector(state => state.attendance);

  const [refreshing, setRefreshing] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [addressName, setAddressName] = useState('');

  const {
    isCheckedIn,
    checkInTime,
    checkOutTime,
    location,
  } = currentAttendance;

  const addressFetchedRef = useRef(false);

  const getAddressFromCoordinates = useCallback(async coords => {
    try {
      const responseJson = await reverseGeocodeApi(coords.latitude, coords.longitude, 'vi');
      console.log(responseJson);
      if (responseJson && responseJson.display_name) {
        setAddressName(responseJson.display_name);
      } else {
        setAddressName('Không thể xác định địa chỉ');
      }
    } catch (err) {
      console.log('Error getting address:', err);
      setAddressName('Lỗi khi lấy địa chỉ');
    }
  }, []);

  const getCurrentLocation = useCallback((force = false) => {
    if (!force && addressFetchedRef.current) {
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentPosition(coords);
        setLocationLoading(false);
        addressFetchedRef.current = true;
        getAddressFromCoordinates(coords);
      },
      err => {
        console.log(err.code, err.message);
        setLocationError('Không thể lấy vị trí hiện tại');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [getAddressFromCoordinates]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          getCurrentLocation();
        } else {
          setLocationError('Quyền truy cập vị trí bị từ chối');
        }
      } catch (err) {
        console.warn(err);
        setLocationError('Không thể lấy quyền truy cập vị trí');
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền truy cập vị trí',
            message: 'Ứng dụng cần quyền truy cập vị trí của bạn để ghi nhận chính xác địa điểm chấm công',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'Đồng ý',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setLocationError('Quyền truy cập vị trí bị từ chối');
        }
      } catch (err) {
        console.warn(err);
        setLocationError('Không thể lấy quyền truy cập vị trí');
      }
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const resultAction = await dispatch(getAttendanceRecords({ page: 1, limit: 10 }));

      if (getAttendanceRecords.rejected.match(resultAction)) {
        console.error('Failed to fetch attendance records:', resultAction.payload?.message);
      }
    };

    fetchAttendanceRecords();
    dispatch(loadCurrentAttendance());
    requestLocationPermission();
  }, [dispatch, requestLocationPermission]);

  console.log(currentPosition);



  // Lưu ý: chỉ lấy địa chỉ 1 lần khi mở app; nút "Thử lại" sẽ gọi lại nếu lỗi

  const handleCheckIn = async () => {
    if (!currentPosition) {
      Alert.alert(
        'Không thể lấy vị trí',
        'Vui lòng đảm bảo GPS đã được bật và cho phép ứng dụng truy cập vị trí của bạn.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Thử lại', onPress: () => getCurrentLocation(true) },
        ]
      );
      return;
    }

    const resultAction = await dispatch(
      checkIn({ ...currentPosition, addressName })
    );

    if (checkIn.fulfilled.match(resultAction)) {
      Alert.alert('Thành công', 'Check in thành công!');
    } else if (checkIn.rejected.match(resultAction)) {
      Alert.alert('Lỗi', resultAction.payload?.message || 'Không thể check in');
    }
  };

  const handleCheckOut = async () => {
    if (!currentPosition) {
      Alert.alert(
        'Không thể lấy vị trí',
        'Vui lòng đảm bảo GPS đã được bật và cho phép ứng dụng truy cập vị trí của bạn.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Thử lại', onPress: () => getCurrentLocation(true) },
        ]
      );
      return;
    }

    const resultAction = await dispatch(
      checkOut({ ...currentPosition, addressName })
    );

    if (checkOut.fulfilled.match(resultAction)) {
      Alert.alert('Thành công', 'Check out thành công!');
    } else if (checkOut.rejected.match(resultAction)) {
      Alert.alert('Lỗi', resultAction.payload?.message || 'Không thể check out');
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const resultAction = await dispatch(getAttendanceRecords({ page: 1, limit: 10 }));

      console.log(resultAction);

      if (getAttendanceRecords.rejected.match(resultAction)) {
        console.error('Failed to refresh attendance records:', resultAction.payload?.message);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (pagination && pagination.currentPage < pagination.totalPages && !loadingHistory) {
      try {
        const nextPage = pagination.currentPage + 1;
        console.log('Loading more attendance records:', nextPage);
        await dispatch(getAttendanceRecords({ page: nextPage, limit: 10 }));
      } catch (err) {
        console.error('Error loading more attendance records:', err);
      }
    }
  };


  const renderAttendanceItem = ({ item, index }) => {
    if (!item || typeof item !== 'object') {
      return null;
    }
    return <AttendanceCard item={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title={'Chấm công'} />

      <View style={styles.currentAttendanceContainer}>
        <AttendanceTimeCard
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
        />

        <CheckInOutButton
          isCheckedIn={isCheckedIn}
          loading={loadingCheckIn || loadingCheckOut}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />

        <View style={styles.locationContainer}>
          {/* Địa điểm chấm công */}
          <View style={styles.locationSection}>
            <View style={styles.locationHeader}>
              <Icon name="map-marker" size={24} color="#666" />
              <Text style={styles.locationTitle}>Địa điểm chấm công:</Text>
            </View>
            <Text style={styles.locationText}>
              {location}
            </Text>
          </View>

          {/* Vị trí hiện tại */}
          <View style={styles.locationSection}>
            <View style={styles.locationHeader}>
              <View style={styles.locationHeaderLeft}>
                <Icon name="crosshairs-gps" size={24} color="#666" />
                <Text style={styles.locationTitle}>Vị trí hiện tại:</Text>
              </View>
              <TouchableOpacity
                onPress={() => getCurrentLocation(true)}
                style={styles.refreshIconButton}
                disabled={locationLoading}
                accessibilityLabel="Cập nhật vị trí hiện tại"
              >
                <Icon name="refresh" size={18} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {locationLoading ? (
              <View style={styles.locationStatusContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.locationStatusText}>Đang lấy vị trí...</Text>
              </View>
            ) : locationError ? (
              <View style={styles.locationErrorContainer}>
                <Icon name="alert-circle-outline" size={16} color="#FF3B30" />
                <Text style={styles.locationErrorText}>{locationError}</Text>
                <TouchableOpacity onPress={() => getCurrentLocation(true)} style={styles.retryButton}>
                  <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            ) : currentPosition ? (
              <View style={styles.locationStatusContainer}>
                <Text style={styles.addressText}>{addressName}</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() => getCurrentLocation(true)} style={styles.getLocationButton}>
                <Icon name="crosshairs-gps" size={16} color="#FFFFFF" />
                <Text style={styles.getLocationText}>Lấy vị trí hiện tại</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.historyTitle}>Lịch sử điểm danh</Text>
      {loadingHistory && (!attendanceRecords || attendanceRecords.length === 0) ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
        </View>
      ) : (
        <FlatList
          data={Array.isArray(attendanceRecords) ? attendanceRecords : []}
          renderItem={renderAttendanceItem}
          keyExtractor={(item, idx) => (item?._id || item?.id || `${item?.date || 'item'}-${idx}`)}
          contentContainerStyle={styles.listContainer}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingHistory && attendanceRecords.length > 0 ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 10 }} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có lịch sử chấm công</Text>
            </View>
          }

        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  currentAttendanceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  locationContainer: {
    marginTop: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  locationSection: {
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  locationText: {
    marginLeft: 32,
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  locationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 32,
  },
  locationStatusText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  locationErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FFEEEE',
    padding: 8,
    borderRadius: 4,
  },
  locationErrorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginLeft: 4,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  getLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8,
    marginLeft: 32,
    alignSelf: 'flex-start',
  },
  refreshIconButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 16,
  },
  getLocationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default AttendanceScreen;
