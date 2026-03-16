import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderScreen from '../../../components/HeaderScreen';
import OvertimeRequestCard from '../../../components/OvertimeRequest/OvertimeRequestCard';
import StatusFilter from '../../../components/StatusFilter';
import { getStatusColor, getStatusText } from '../../../utils/statusUtils';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ViewEmptyComponent from '../../../components/ViewEmptyComponent';
import {
  getAllOvertimeRequests,
} from '../../../redux/overtime/adminOvertimeAction';
import {
  clearError,
  clearMessage,
} from '../../../redux/overtime/overtimeSlice';

const OvertimeRequestScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const isLoading = useSelector(state => state.overtime.loading);
  const overtimeList = useSelector(state => state.overtime.overtimeList);
  const err = useSelector(state => state.overtime.error);
  const message = useSelector(state => state.overtime.message);

  const statusFilters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ duyệt' },
    { id: 'approved', label: 'Đã duyệt' },
    { id: 'rejected', label: 'Từ chối' },
  ];

  useEffect(() => {
    const fetchOvertimeRequests = async () => {
      const resultAction = await dispatch(getAllOvertimeRequests({
        status: selectedStatus === 'all' ? '' : selectedStatus,
        page: 1,
        limit: 10,
      }));
      
      if (getAllOvertimeRequests.rejected.match(resultAction)) {
        console.error('Failed to fetch overtime requests:', resultAction.payload?.message);
      }
    };
    fetchOvertimeRequests();
  }, [selectedStatus, dispatch]); // Chỉ depend on selectedStatus



  const renderOvertimeRequest = ({ item }) => (
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
      const resultAction = await dispatch(getAllOvertimeRequests({
        status: selectedStatus === 'all' ? '' : selectedStatus,
        page: 1,
        limit: 10,
      }));

      if (getAllOvertimeRequests.rejected.match(resultAction)) {
        console.error('Failed to refresh overtime requests:', resultAction.payload?.message);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleCardPress = item => {
    navigation.navigate('AdminDetailOTScreen', { overtimeRequest: item });
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title={'Quản lý làm thêm giờ'} />
      <View style={styles.statusContainer}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  statusContainer: {
    padding: 5,
  },
  listContainer: {
    padding: 16,
  },
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default OvertimeRequestScreen;
