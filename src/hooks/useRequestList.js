import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import cacheManager, { CACHE_TTL } from '../utils/cacheManager';

/**
 * Custom hook để quản lý logic chung cho các request list screens
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchAction - Redux async thunk action để fetch data
 * @param {Function} config.createAction - Redux async thunk action để tạo request mới (optional)
 * @param {Function} config.clearErrorAction - Action để clear error (optional)
 * @param {Function} config.clearMessageAction - Action để clear message (optional)
 * @param {number} config.limit - Số lượng items per page (default: 10)
 * @returns {Object} - Hook state và functions
 */
export const useRequestList = ({
  fetchAction,
  createAction,
  clearErrorAction,
  clearMessageAction,
  limit = 10,
}) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);

  const lastFetchParams = useRef(null);
  const hasFetched = useRef(false);

  // Fetch data với caching để tránh gọi API liên tục
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: 1,
          limit,
        };

        // Kiểm tra cache trước
        const cacheKey = cacheManager.createKey(fetchAction.typePrefix, params);
        const cachedData = cacheManager.get(cacheKey);
        
        // Kiểm tra xem params có thay đổi không
        const paramsChanged = JSON.stringify(params) !== JSON.stringify(lastFetchParams.current);
        
        // Chỉ fetch nếu chưa có cache hoặc params thay đổi
        if (cachedData && !paramsChanged && hasFetched.current) {
          console.log(`Using cached data for ${fetchAction.typePrefix}`);
          return;
        }

        // Clear previous errors nếu có
        if (clearErrorAction) dispatch(clearErrorAction());
        if (clearMessageAction) dispatch(clearMessageAction());

        console.log('Fetching data with status:', selectedStatus);
        const resultAction = await dispatch(fetchAction(params));

        setCurrentPage(1);
        lastFetchParams.current = params;
        hasFetched.current = true;

        // Cache successful response
        if (fetchAction.fulfilled.match(resultAction)) {
          console.log('Fetch data successful');
          cacheManager.set(cacheKey, resultAction.payload, CACHE_TTL.SHORT);
        } else if (fetchAction.rejected.match(resultAction)) {
          console.error('Fetch data failed:', resultAction.payload?.message);
        }
      } catch (err) {
        console.error('Fetch data error:', err);
      }
    };

    fetchData();
  }, [selectedStatus, fetchAction, clearErrorAction, clearMessageAction, limit, dispatch]); // Chỉ depend on selectedStatus


  // Handle refresh
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('Refreshing data');
      
      const resultAction = await dispatch(
        fetchAction({
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: 1,
          limit,
        })
      );

      setCurrentPage(1);

      if (fetchAction.fulfilled.match(resultAction)) {
        console.log('Refresh successful');
      } else if (fetchAction.rejected.match(resultAction)) {
        console.error('Refresh failed:', resultAction.payload?.message);
        Alert.alert(
          'Lỗi',
          resultAction.payload?.message || 'Không thể làm mới dữ liệu'
        );
      }
    } catch (err) {
      console.error('Refresh error:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi làm mới dữ liệu');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle load more (cho pagination)
  const handleLoadMore = async (pagination) => {
    if (pagination.currentPage < pagination.totalPages) {
      try {
        const nextPage = parseInt(pagination.currentPage, 10) + 1;
        console.log('Loading more data - Page:', nextPage, 'Total Pages:', pagination.totalPages);

        const resultAction = await dispatch(
          fetchAction({
            page: nextPage,
            limit,
            status: selectedStatus === 'all' ? '' : selectedStatus,
          })
        );

        if (fetchAction.fulfilled.match(resultAction)) {
          console.log('Load more successful');
        } else if (fetchAction.rejected.match(resultAction)) {
          console.error('Load more failed:', resultAction.payload?.message);
          Alert.alert(
            'Lỗi',
            resultAction.payload?.message || 'Không thể tải thêm dữ liệu'
          );
        }
      } catch (error) {
        console.error('Load more error:', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thêm dữ liệu');
      }
    }
  };

  // Handle submit form (tạo request mới)
  const handleSubmit = async (formData, successMessage = 'Yêu cầu đã được gửi thành công') => {
    if (!createAction) {
      console.warn('createAction not provided to useRequestList hook');
      return;
    }

    const resultAction = await dispatch(createAction(formData));

    if (createAction.fulfilled.match(resultAction)) {
      console.log('Create request successful:', resultAction.payload.message);
      Alert.alert('Thành công', successMessage);
      
      // Refresh the list after successful creation
      await dispatch(
        fetchAction({
          status: selectedStatus === 'all' ? '' : selectedStatus,
          page: 1,
          limit,
        })
      );
    } else if (createAction.rejected.match(resultAction)) {
      Alert.alert('Lỗi', resultAction.payload?.message || 'Có lỗi xảy ra');
      console.error('Failed to create request:', resultAction.payload?.message);
    }
    
    setModalVisible(false);
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Handle modal visibility
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return {
    // State
    selectedStatus,
    refreshing,
    currentPage,
    isModalVisible,
    
    // Actions
    handleRefresh,
    handleLoadMore,
    handleSubmit,
    handleStatusChange,
    showModal,
    hideModal,
    setSelectedStatus,
    setCurrentPage,
  };
};

export default useRequestList;