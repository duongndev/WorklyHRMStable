import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from '../../../components/HeaderScreen';
import CustomButton from '../../../components/CustomButton';
import { getAttendanceDetailApi, updateAttendanceApi, deleteAttendanceApi } from '../../../services/AdminApiService';
import { formatDateTime } from '../../../utils/formatDateTime';

const AdminAttendanceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { attendance: initialAttendance } = route.params;
  
  const [attendance, setAttendance] = useState(initialAttendance);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    checkIn: '',
    checkOut: '',
    note: '',
  });

  useEffect(() => {
    fetchAttendanceDetail();
  }, []);

  const fetchAttendanceDetail = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceDetailApi(attendance.id);
      if (response.success) {
        setAttendance(response.data);
        setEditData({
          checkIn: response.data.checkIn ? formatDateTime.formatTime(response.data.checkIn) : '',
          checkOut: response.data.checkOut ? formatDateTime.formatTime(response.data.checkOut) : '',
          note: response.data.note || '',
        });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin chấm công');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async () => {
    setLoading(true);
    try {
      const updateData = {
        checkIn: editData.checkIn ? `${attendance.date} ${editData.checkIn}` : null,
        checkOut: editData.checkOut ? `${attendance.date} ${editData.checkOut}` : null,
        note: editData.note,
      };

      const response = await updateAttendanceApi(attendance.id, updateData);
      if (response.success) {
        setAttendance(response.data);
        setShowEditModal(false);
        Alert.alert('Thành công', 'Cập nhật thông tin chấm công thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin chấm công');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendance = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa bản ghi chấm công này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: confirmDeleteAttendance },
      ]
    );
  };

  const confirmDeleteAttendance = async () => {
    setLoading(true);
    try {
      const response = await deleteAttendanceApi(attendance.id);
      if (response.success) {
        Alert.alert('Thành công', 'Xóa bản ghi chấm công thành công', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa bản ghi chấm công');
    } finally {
      setLoading(false);
    }
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

  const calculateLateDuration = (checkIn, expectedTime) => {
    if (!checkIn || !expectedTime) return null;
    
    const checkInTime = new Date(checkIn);
    const expected = new Date(`${attendance.date} ${expectedTime}`);
    
    if (checkInTime <= expected) return null;
    
    const diffMs = checkInTime - expected;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} phút`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const InfoRow = ({ label, value, icon, color }) => (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color={color || '#666'} style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, color && { color }]}>{value || '--'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen 
        title="Chi tiết chấm công" 
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={() => setShowEditModal(true)}>
            <Icon name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <View style={styles.employeeHeader}>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{attendance.employee.fullName}</Text>
              <Text style={styles.employeeId}>ID: {attendance.employee.employeeId}</Text>
              <Text style={styles.dateText}>{formatDateTime.formatDate(attendance.date)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(attendance.status) }]}>
              <Text style={styles.statusText}>{getStatusText(attendance.status)}</Text>
            </View>
          </View>
        </View>

        {/* Time Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thời gian</Text>
          <View style={styles.card}>
            <InfoRow 
              label="Giờ vào" 
              value={attendance.checkIn ? formatDateTime.formatTime(attendance.checkIn) : 'Chưa chấm công'}
              icon="log-in-outline" 
              color="#4CAF50"
            />
            <InfoRow 
              label="Giờ ra" 
              value={attendance.checkOut ? formatDateTime.formatTime(attendance.checkOut) : 'Chưa chấm công'}
              icon="log-out-outline" 
              color="#F44336"
            />
            <InfoRow 
              label="Tổng thời gian làm việc" 
              value={calculateWorkingHours(attendance.checkIn, attendance.checkOut)}
              icon="time-outline"
            />
            {attendance.status === 'late' && (
              <InfoRow 
                label="Thời gian muộn" 
                value={calculateLateDuration(attendance.checkIn, '08:00')}
                icon="alert-circle-outline" 
                color="#FF9800"
              />
            )}
          </View>
        </View>

        {/* Work Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch làm việc</Text>
          <View style={styles.card}>
            <InfoRow 
              label="Giờ vào quy định" 
              value={attendance.schedule?.startTime || '08:00'}
              icon="time-outline"
            />
            <InfoRow 
              label="Giờ ra quy định" 
              value={attendance.schedule?.endTime || '17:00'}
              icon="time-outline"
            />
            <InfoRow 
              label="Ca làm việc" 
              value={attendance.schedule?.shiftName || 'Ca hành chính'}
              icon="calendar-outline"
            />
          </View>
        </View>

        {/* Location Information */}
        {(attendance.checkInLocation || attendance.checkOutLocation) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin vị trí</Text>
            <View style={styles.card}>
              {attendance.checkInLocation && (
                <InfoRow 
                  label="Vị trí chấm công vào" 
                  value={attendance.checkInLocation}
                  icon="location-outline"
                />
              )}
              {attendance.checkOutLocation && (
                <InfoRow 
                  label="Vị trí chấm công ra" 
                  value={attendance.checkOutLocation}
                  icon="location-outline"
                />
              )}
            </View>
          </View>
        )}

        {/* Notes */}
        {attendance.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.card}>
              <Text style={styles.noteText}>{attendance.note}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <CustomButton
            title="Chỉnh sửa thông tin"
            onPress={() => setShowEditModal(true)}
            style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
          />
          <CustomButton
            title="Xóa bản ghi"
            onPress={handleDeleteAttendance}
            style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          />
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa chấm công</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Giờ vào (HH:MM)</Text>
              <TextInput
                style={styles.timeInput}
                value={editData.checkIn}
                onChangeText={(text) => setEditData(prev => ({ ...prev, checkIn: text }))}
                placeholder="08:00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Giờ ra (HH:MM)</Text>
              <TextInput
                style={styles.timeInput}
                value={editData.checkOut}
                onChangeText={(text) => setEditData(prev => ({ ...prev, checkOut: text }))}
                placeholder="17:00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ghi chú</Text>
              <TextInput
                style={styles.noteInput}
                value={editData.note}
                onChangeText={(text) => setEditData(prev => ({ ...prev, note: text }))}
                placeholder="Nhập ghi chú..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleUpdateAttendance}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminAttendanceDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 12,
    width: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actionButton: {
    marginBottom: 12,
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
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