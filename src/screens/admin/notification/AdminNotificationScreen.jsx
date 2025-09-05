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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from '../../../components/HeaderScreen';
import ViewEmptyComponent from '../../../components/ViewEmptyComponent';
import CustomButton from '../../../components/CustomButton';
import CustomTextInput from '../../../components/CustomTextInput';
import { getAllNotificationsApi, createNotificationApi, deleteNotificationApi } from '../../../services/AdminApiService';
import { formatDateTime } from '../../../utils/formatDateTime';

const AdminNotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    type: 'general',
    targetAudience: 'all',
  });

  const notificationTypes = [
    { label: 'Thông báo chung', value: 'general' },
    { label: 'Khẩn cấp', value: 'urgent' },
    { label: 'Thông tin', value: 'info' },
    { label: 'Cảnh báo', value: 'warning' },
  ];

  const targetAudiences = [
    { label: 'Tất cả nhân viên', value: 'all' },
    { label: 'Phòng IT', value: 'IT' },
    { label: 'Phòng HR', value: 'HR' },
    { label: 'Phòng Kế toán', value: 'Accounting' },
    { label: 'Phòng Marketing', value: 'Marketing' },
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [searchText, notifications]);

  const fetchNotifications = async (page = 1, isRefresh = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await getAllNotificationsApi(page, 20);
      if (response.success) {
        const newNotifications = isRefresh ? response.data.notifications : [...notifications, ...response.data.notifications];
        setNotifications(newNotifications);
        setHasMore(response.data.hasMore);
        setCurrentPage(page);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách thông báo');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterNotifications = () => {
    if (!searchText.trim()) {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter(notification => 
        notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
        notification.content.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredNotifications(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchNotifications(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(currentPage + 1);
    }
  };

  const handleCreateNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.content.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await createNotificationApi(newNotification);
      if (response.success) {
        setNotifications([response.data, ...notifications]);
        setShowCreateModal(false);
        setNewNotification({
          title: '',
          content: '',
          type: 'general',
          targetAudience: 'all',
        });
        Alert.alert('Thành công', 'Tạo thông báo thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo thông báo');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteNotification = (notification) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa thông báo này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => confirmDeleteNotification(notification.id) },
      ]
    );
  };

  const confirmDeleteNotification = async (id) => {
    try {
      const response = await deleteNotificationApi(id);
      if (response.success) {
        setNotifications(notifications.filter(n => n.id !== id));
        Alert.alert('Thành công', 'Xóa thông báo thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa thông báo');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'urgent': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      case 'general': return '#4CAF50';
      default: return '#666';
    }
  };

  const getTypeText = (type) => {
    const typeOption = notificationTypes.find(option => option.value === type);
    return typeOption ? typeOption.label : type;
  };

  const getAudienceText = (audience) => {
    const audienceOption = targetAudiences.find(option => option.value === audience);
    return audienceOption ? audienceOption.label : audience;
  };

  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <View style={styles.notificationMeta}>
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
                <Text style={styles.typeText}>{getTypeText(item.type)}</Text>
              </View>
              <Text style={styles.audienceText}>{getAudienceText(item.targetAudience)}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteNotification(item)}
          >
            <Icon name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.notificationContent} numberOfLines={3}>
          {item.content}
        </Text>
        
        <View style={styles.notificationFooter}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="eye-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.readCount || 0} đã đọc</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="people-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.sentCount || 0} đã gửi</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{formatDateTime.formatDateTime(item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  const TypeSelector = ({ selectedValue, onValueChange }) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>Loại thông báo</Text>
      <View style={styles.selectorOptions}>
        {notificationTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.selectorOption,
              selectedValue === type.value && styles.selectedSelectorOption
            ]}
            onPress={() => onValueChange(type.value)}
          >
            <Text style={[
              styles.selectorOptionText,
              selectedValue === type.value && styles.selectedSelectorOptionText
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const AudienceSelector = ({ selectedValue, onValueChange }) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>Đối tượng nhận</Text>
      <View style={styles.selectorOptions}>
        {targetAudiences.map((audience) => (
          <TouchableOpacity
            key={audience.value}
            style={[
              styles.selectorOption,
              selectedValue === audience.value && styles.selectedSelectorOption
            ]}
            onPress={() => onValueChange(audience.value)}
          >
            <Text style={[
              styles.selectorOptionText,
              selectedValue === audience.value && styles.selectedSelectorOptionText
            ]}>
              {audience.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen 
        title="Quản lý thông báo" 
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={() => setShowCreateModal(true)}>
            <Icon name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.content}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm thông báo..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Statistics */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredNotifications.length}</Text>
            <Text style={styles.statLabel}>Tổng thông báo</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F44336' }]}>
              {filteredNotifications.filter(item => item.type === 'urgent').length}
            </Text>
            <Text style={styles.statLabel}>Khẩn cấp</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
              {filteredNotifications.filter(item => item.status === 'sent').length}
            </Text>
            <Text style={styles.statLabel}>Đã gửi</Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={
            <ViewEmptyComponent 
              title="Không có thông báo nào"
              description="Chưa có thông báo nào được tạo"
            />
          }
        />
      </View>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo thông báo mới</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <CustomTextInput
              label="Tiêu đề *"
              value={newNotification.title}
              onChangeText={(text) => setNewNotification(prev => ({ ...prev, title: text }))}
              placeholder="Nhập tiêu đề thông báo"
            />
            
            <CustomTextInput
              label="Nội dung *"
              value={newNotification.content}
              onChangeText={(text) => setNewNotification(prev => ({ ...prev, content: text }))}
              placeholder="Nhập nội dung thông báo"
              multiline
              numberOfLines={4}
            />

            <TypeSelector
              selectedValue={newNotification.type}
              onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}
            />

            <AudienceSelector
              selectedValue={newNotification.targetAudience}
              onValueChange={(value) => setNewNotification(prev => ({ ...prev, targetAudience: value }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateNotification}
                disabled={createLoading}
              >
                <Text style={styles.confirmButtonText}>
                  {createLoading ? 'Đang tạo...' : 'Tạo thông báo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminNotificationScreen;

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
  statsCard: {
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
  notificationItem: {
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
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  audienceText: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 4,
  },
  notificationContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  selectorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSelectorOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectorOptionText: {
    fontSize: 12,
    color: '#666',
  },
  selectedSelectorOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});