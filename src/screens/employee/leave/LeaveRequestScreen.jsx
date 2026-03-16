import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import HeaderScreen from '../../../components/HeaderScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LeaveRequestCard from '../../../components/LeaveRequest/LeaveRequestCard';
import StatusFilter from '../../../components/StatusFilter';
import LeaveRequestFormModal from '../../../components/LeaveRequest/LeaveRequestFormModal';
import {getStatusColor, getStatusText} from '../../../utils/statusUtils';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {clearError, clearMessage} from '../../../redux/leave/leaveSlice';
import {
  getLeaveRequests,
  createLeaveRequest,
} from '../../../redux/leave/leaveAction';
import ViewEmptyComponent from '../../../components/ViewEmptyComponent';

const LeaveRequestScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const {leaveList, loading, error, pagination} = useSelector(
    state => state.leave,
  );
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const totalPages = pagination.totalPages;
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadMore = async () => {
    if (pagination.currentPage < totalPages && !loading) {
      try {
        const nextPage = parseInt(pagination.currentPage, 10) + 1;
        console.log(
          'Loading more data - Page:',
          nextPage,
          'Total Pages:',
          totalPages,
        );

        const resultAction = await dispatch(
          getLeaveRequests({
            page: nextPage,
            limit: 10,
            status: selectedStatus === 'all' ? '' : selectedStatus,
          }),
        );

        if (getLeaveRequests.fulfilled.match(resultAction)) {
          console.log('Load more successful');
        } else if (getLeaveRequests.rejected.match(resultAction)) {
          console.error('Load more failed:', resultAction.payload?.message);
          Alert.alert(
            'Lỗi',
            resultAction.payload?.message || 'Không thể tải thêm dữ liệu',
          );
        }
      } catch (error) {
        console.error('Load more error:', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thêm dữ liệu');
      }
    }
  };

  const statusFilters = [
    {id: 'all', label: 'Tất cả'},
    {id: 'pending', label: 'Chờ duyệt'},
    {id: 'approved', label: 'Đã duyệt'},
    {id: 'rejected', label: 'Từ chối'},
  ];

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        // Clear previous errors
        dispatch(clearError());
        dispatch(clearMessage());

        console.log('Fetching leave requests with status:', selectedStatus);
        const resultAction = await dispatch(
          getLeaveRequests({
            page: 1,
            limit: 10,
            status: selectedStatus === 'all' ? '' : selectedStatus,
          }),
        );

        setCurrentPage(1);

        if (getLeaveRequests.fulfilled.match(resultAction)) {
          console.log('Fetch leave requests successful');
        } else if (getLeaveRequests.rejected.match(resultAction)) {
          console.error(
            'Fetch leave requests failed:',
            resultAction.payload?.message,
          );
        }
      } catch (err) {
        console.error('Fetch leave requests error:', err);
      }
    };

    fetchLeaveRequests();
  }, [dispatch, selectedStatus]); // Chỉ depend on selectedStatus

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      console.log('Refreshing leave requests');
      const resultAction = await dispatch(
        getLeaveRequests({
          page: 1,
          limit: 10,
          status: selectedStatus === 'all' ? '' : selectedStatus,
        }),
      );

      setCurrentPage(1);

      if (getLeaveRequests.fulfilled.match(resultAction)) {
        console.log('Refresh successful');
      } else if (getLeaveRequests.rejected.match(resultAction)) {
        console.error('Refresh failed:', resultAction.payload?.message);
        Alert.alert(
          'Lỗi',
          resultAction.payload?.message || 'Không thể làm mới dữ liệu',
        );
      }
    } catch (err) {
      console.error('Refresh error:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi làm mới dữ liệu');
    } finally {
      setRefreshing(false);
    }
  };

  const handleClickLeave = item => {
    navigation.navigate('LeaveRequestDetail', {leaveRequest: item._id});
    console.log('leaveRequest', item._id);
  };

  const handleSubmit = async leaveRequest => {
    try {
      console.log('Creating leave request:', leaveRequest);

      const resultAction = await dispatch(createLeaveRequest(leaveRequest));

      if (createLeaveRequest.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        console.log('Create leave request successful:', response);

        Alert.alert(
          'Thành công',
          response.message || 'Yêu cầu nghỉ phép đã được gửi.',
          [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                handleRefresh();
              },
            },
          ],
        );
      } else if (createLeaveRequest.rejected.match(resultAction)) {
        console.error(
          'Create leave request failed:',
          resultAction.payload?.message,
        );
        Alert.alert(
          'Lỗi',
          resultAction.payload?.message || 'Không thể tạo yêu cầu nghỉ phép',
        );
      }
    } catch (error) {
      console.error('Create leave request error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo yêu cầu nghỉ phép');
    }
  };

  const renderLeaveRequest = ({item}) => (
    <LeaveRequestCard
      item={item}
      getStatusColor={getStatusColor}
      getStatusText={getStatusText}
      onClickLeave={handleClickLeave}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title={'Xin nghỉ phép'} />
      <View style={styles.viewFilter}>
        <StatusFilter
          statusFilters={statusFilters}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </View>

      {loading && leaveList.length === 0 ? (
        <View style={styles.viewLoading}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : leaveList.length === 0 ? (
        <ViewEmptyComponent title={error || 'Không có yêu cầu nào'} />
      ) : (
        <FlatList
          data={leaveList}
          renderItem={renderLeaveRequest}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => {
            if (loading && leaveList.length > 0) {
              return (
                <View style={styles.loadMoreContainer}>
                  <ActivityIndicator size="small" color="#007AFF" />
                </View>
              );
            }
            return null;
          }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <LeaveRequestFormModal
        isModalVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  listContainer: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default LeaveRequestScreen;
