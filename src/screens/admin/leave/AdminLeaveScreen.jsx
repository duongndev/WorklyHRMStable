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
import {getAllLeaveRequests} from '../../../redux/leave/adminLeaveAction';
import ViewEmptyComponent from '../../../components/ViewEmptyComponent';

const AdminLeaveScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const leaveList = useSelector(state => state.leave.leaveList);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const isLoading = useSelector(state => state.leave.loading);
  const pagination = useSelector(state => state.leave.pagination);
  const totalPages = pagination.totalPages;
  const [currentPage, setCurrentPage] = useState(1);

  const statusFilters = [
    {id: 'all', label: 'Tất cả'},
    {id: 'pending', label: 'Chờ duyệt'},
    {id: 'approved', label: 'Đã duyệt'},
    {id: 'rejected', label: 'Từ chối'},
  ];

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const resultAction = await dispatch(
        getAllLeaveRequests({
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: 1,
          limit: 10,
        }),
      );

      setCurrentPage(1);

      if (getAllLeaveRequests.rejected.match(resultAction)) {
        console.error(
          'Failed to fetch leave requests:',
          resultAction.payload?.message,
        );
      }
    };

    fetchLeaveRequests();
  }, [selectedStatus, dispatch]); // Chỉ depend on selectedStatus

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const resultAction = await dispatch(
        getAllLeaveRequests({
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: currentPage,
          limit: 10,
        }),
      );

      if (getAllLeaveRequests.rejected.match(resultAction)) {
        console.error(
          'Failed to refresh leave requests:',
          resultAction.payload?.message,
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleClickLeave = item => {
    navigation.navigate('AdminLeaveDetailScreen', {leaveRequest: item});
    console.log('leaveRequest', item._id);
  };

  // const handleSubmit = async (leaveRequest) => {
  //   try {
  //     const response = await createLeaveRequestApi(leaveRequest);
  //     if (response) {
  //       Alert.alert(response.message, 'Yêu cầu nghỉ phép đã được gửi.');
  //       setModalVisible(false);
  //     }
  //     console.log(leaveRequest);
  //     console.log(response);
  //   } catch (error) {
  //     Alert.alert('Thông báo',error.response.data.message);
  //   }
  // };

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
      <HeaderScreen title={'Quản lý xin nghỉ phép'} />
      <View style={styles.viewFilter}>
        <StatusFilter
          statusFilters={statusFilters}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </View>

      {isLoading ? (
        <View style={styles.viewLoading}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : leaveList.length === 0 ? (
        <ViewEmptyComponent title={'Không có yêu cầu nào'} />
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
        />
      )}
      <LeaveRequestFormModal
        isModalVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={{}}
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
});

export default AdminLeaveScreen;
