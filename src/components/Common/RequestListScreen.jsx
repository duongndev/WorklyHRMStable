import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderScreen from '../HeaderScreen';
import StatusFilter from '../StatusFilter';
import ViewEmptyComponent from '../ViewEmptyComponent';
import useRequestList from '../../hooks/useRequestList';
import { useSelector } from 'react-redux';

/**
 * Component chung cho các màn hình danh sách requests
 * @param {Object} props
 * @param {string} props.title - Tiêu đề màn hình
 * @param {Function} props.fetchAction - Redux async thunk để fetch data
 * @param {Function} props.createAction - Redux async thunk để tạo request mới (optional)
 * @param {Function} props.clearErrorAction - Action để clear error (optional)
 * @param {Function} props.clearMessageAction - Action để clear message (optional)
 * @param {Function} props.dataSelector - Selector để lấy data từ Redux store
 * @param {Function} props.loadingSelector - Selector để lấy loading state
 * @param {Function} props.paginationSelector - Selector để lấy pagination (optional)
 * @param {Function} props.renderItem - Function để render từng item
 * @param {Function} props.onItemPress - Callback khi press vào item
 * @param {Array} props.statusFilters - Array các status filters
 * @param {boolean} props.showAddButton - Có hiển thị nút thêm không (default: false)
 * @param {Function} props.onAddPress - Callback khi press nút thêm
 * @param {string} props.emptyMessage - Thông báo khi không có data
 * @param {boolean} props.enablePagination - Có enable pagination không (default: false)
 * @param {Object} props.containerStyle - Custom style cho container
 */
const RequestListScreen = ({
  title,
  fetchAction,
  createAction,
  clearErrorAction,
  clearMessageAction,
  dataSelector,
  loadingSelector,
  paginationSelector,
  renderItem,
  onItemPress,
  statusFilters,
  showAddButton = false,
  onAddPress,
  emptyMessage = 'Không có dữ liệu',
  enablePagination = false,
  containerStyle,
}) => {
  const {
    selectedStatus,
    refreshing,
    handleRefresh,
    handleLoadMore,
    handleStatusChange,
  } = useRequestList({
    fetchAction,
    createAction,
    clearErrorAction,
    clearMessageAction,
  });

  const data = useSelector(dataSelector);
  const loading = useSelector(loadingSelector);
  const pagination = useSelector(state =>
    paginationSelector ? paginationSelector(state) : null,
  );

  const handleItemPress = (item) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  const renderRequestItem = ({ item }) => {
    return renderItem({ item, onPress: () => handleItemPress(item) });
  };

  const handleLoadMoreData = () => {
    if (enablePagination && pagination && !loading) {
      handleLoadMore(pagination);
    }
  };

  const renderFooter = () => {
    if (enablePagination && loading && data.length > 0) {
      return (
        <View style={styles.loadMoreContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <HeaderScreen title={title} />

      {statusFilters && (
        <View style={styles.filterContainer}>
          <StatusFilter
            statusFilters={statusFilters}
            selectedStatus={selectedStatus}
            setSelectedStatus={handleStatusChange}
          />
        </View>
      )}

      {loading && data.length === 0 ? (
        <View style={styles.viewLoading}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : data.length === 0 ? (
        <ViewEmptyComponent title={emptyMessage} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item._id || item.id}
          removeClippedSubviews={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={enablePagination ? handleLoadMoreData : null}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      )}

      {showAddButton && (
        <TouchableOpacity
          style={styles.fab}
          onPress={onAddPress}
          activeOpacity={0.8}
        >
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default RequestListScreen;
