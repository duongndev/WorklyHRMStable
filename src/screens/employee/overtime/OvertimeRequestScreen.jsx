import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderScreen from '../../../components/HeaderScreen';
import OvertimeRequestCard from '../../../components/OvertimeRequest/OvertimeRequestCard';
import StatusFilter from '../../../components/StatusFilter';
import OvertimeRequestFormModal from '../../../components/OvertimeRequest/OvertimeRequestFormModal';
import {getStatusColor, getStatusText} from '../../../utils/statusUtils';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import ViewEmptyComponent from '../../../components/ViewEmptyComponent';
import {
  getOvertimeRequests,
  createOvertimeRequest,
} from '../../../redux/overtime/overtimeAction';

const OvertimeRequestScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const isLoading = useSelector(state => state.overtime.loading);
  const overtimeList = useSelector(state => state.overtime.overtimeList);

  const statusFilters = [
    {id: 'all', label: 'Tất cả'},
    {id: 'pending', label: 'Chờ duyệt'},
    {id: 'approved', label: 'Đã duyệt'},
    {id: 'rejected', label: 'Từ chối'},
  ];

  useEffect(() => {
    const fetchOvertimeRequests = async () => {
      const resultAction = await dispatch(
        getOvertimeRequests({
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: 1,
          limit: 10,
        }),
      );

      if (getOvertimeRequests.rejected.match(resultAction)) {
        console.error(
          'Failed to fetch overtime requests:',
          resultAction.payload?.message,
        );
      }
    };
    fetchOvertimeRequests();
  }, [dispatch, selectedStatus]); // Chỉ depend on selectedStatus

  const handleSubmit = async overtimeRequest => {
    const resultAction = await dispatch(createOvertimeRequest(overtimeRequest));

    if (createOvertimeRequest.fulfilled.match(resultAction)) {
      console.log(
        'Overtime request created successfully:',
        resultAction.payload.message,
      );
      Alert.alert('Thành công', 'Yêu cầu xin làm thêm giờ đã được gửi');
      // Refresh the list
      dispatch(
        getOvertimeRequests({
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: 1,
          limit: 10,
        }),
      );
    } else if (createOvertimeRequest.rejected.match(resultAction)) {
      Alert.alert('Lỗi', resultAction.payload?.message || 'Có lỗi xảy ra');
      console.error(
        'Failed to create overtime request:',
        resultAction.payload?.message,
      );
    }
    setModalVisible(false);
  };

  const renderOvertimeRequest = ({item}) => (
    <OvertimeRequestCard
      item={item}
      getStatusColor={getStatusColor}
      getStatusText={getStatusText}
      onCardPress={handleCardPress}
    />
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const resultAction = await dispatch(
        getOvertimeRequests({
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: 1,
          limit: 10,
        }),
      );

      if (getOvertimeRequests.rejected.match(resultAction)) {
        console.error(
          'Failed to refresh overtime requests:',
          resultAction.payload?.message,
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleCardPress = item => {
    navigation.navigate('OvertimeRequestDetail', {overtimeRequest: item});
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title={'Yêu cầu OT'} />
      <StatusFilter
        statusFilters={statusFilters}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {isLoading ? (
        <View style={styles.viewLoading}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : overtimeList.length === 0 ? (
        <ViewEmptyComponent title={'Không có yêu cầu nào'} />
      ) : (
        <FlatList
          data={overtimeList}
          renderItem={renderOvertimeRequest}
          keyExtractor={item => item._id}
          removeClippedSubviews={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <OvertimeRequestFormModal
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
});

export default OvertimeRequestScreen;
