import React, { useCallback, useEffect, useState } from 'react';
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
import { getEmployeeDetailApi, updateEmployeeStatusApi, deleteEmployeeApi } from '../../../services/AdminApiService';

const AdminEmployeeDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { employee: initialEmployee } = route.params;
  const employeeId = initialEmployee?.id;
  
  const [employee, setEmployee] = useState(initialEmployee);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(employee.status);
  const [statusNote, setStatusNote] = useState('');

  const statusOptions = [
    { value: 'active', label: 'Hoạt động', color: '#4CAF50' },
    { value: 'inactive', label: 'Không hoạt động', color: '#F44336' },
    { value: 'suspended', label: 'Tạm dừng', color: '#FF9800' },
  ];

  const fetchEmployeeDetail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getEmployeeDetailApi(employeeId);
      if (response.success) {
        setEmployee(response.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin nhân viên');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployeeDetail();
  }, [fetchEmployeeDetail]);

  const handleUpdateStatus = async () => {
    if (selectedStatus === employee.status) {
      setShowStatusModal(false);
      return;
    }

    setLoading(true);
    try {
      const response = await updateEmployeeStatusApi(employee.id, selectedStatus, statusNote);
      if (response.success) {
        setEmployee({ ...employee, status: selectedStatus });
        setShowStatusModal(false);
        setStatusNote('');
        Alert.alert('Thành công', 'Cập nhật trạng thái nhân viên thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: confirmDeleteEmployee },
      ]
    );
  };

  const confirmDeleteEmployee = async () => {
    setLoading(true);
    try {
      const response = await deleteEmployeeApi(employee.id);
      if (response.success) {
        Alert.alert('Thành công', 'Xóa nhân viên thành công', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = () => {
    navigation.navigate('AdminEditEmployeeScreen', { employee });
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : '#666';
  };

  const getStatusText = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const InfoRow = ({ label, value, icon }) => (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color="#666" style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Chưa cập nhật'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen 
        title="Thông tin nhân viên" 
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleEditEmployee}>
            <Icon name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <View style={styles.employeeHeader}>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{employee.fullName}</Text>
              <Text style={styles.employeeId}>ID: {employee.employeeId}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(employee.status) }]}>
              <Text style={styles.statusText}>{getStatusText(employee.status)}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.card}>
            <InfoRow label="Email" value={employee.email} icon="mail-outline" />
            <InfoRow label="Số điện thoại" value={employee.phone} icon="call-outline" />
            <InfoRow label="Ngày sinh" value={employee.dateOfBirth} icon="calendar-outline" />
            <InfoRow label="Giới tính" value={employee.gender} icon="person-outline" />
            <InfoRow label="Địa chỉ" value={employee.address} icon="location-outline" />
          </View>
        </View>

        {/* Work Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin công việc</Text>
          <View style={styles.card}>
            <InfoRow label="Phòng ban" value={employee.department} icon="business-outline" />
            <InfoRow label="Chức vụ" value={employee.position} icon="briefcase-outline" />
            <InfoRow label="Ngày vào làm" value={employee.startDate} icon="calendar-outline" />
            <InfoRow label="Lương cơ bản" value={employee.salary ? `${employee.salary.toLocaleString()} VNĐ` : null} icon="card-outline" />
            <InfoRow label="Loại hợp đồng" value={employee.contractType} icon="document-text-outline" />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <CustomButton
            title="Thay đổi trạng thái"
            onPress={() => setShowStatusModal(true)}
            style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
          />
          <CustomButton
            title="Xóa nhân viên"
            onPress={handleDeleteEmployee}
            style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          />
        </View>
      </ScrollView>

      {/* Status Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thay đổi trạng thái</Text>
            
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  selectedStatus === option.value && styles.selectedStatusOption
                ]}
                onPress={() => setSelectedStatus(option.value)}
              >
                <View style={[styles.statusDot, { backgroundColor: option.color }]} />
                <Text style={styles.statusOptionText}>{option.label}</Text>
                {selectedStatus === option.value && (
                  <Icon name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.noteInput}
              placeholder="Ghi chú (tùy chọn)"
              value={statusNote}
              onChangeText={setStatusNote}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleUpdateStatus}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminEmployeeDetailScreen;

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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  employeeId: {
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
    marginBottom: 16,
    textAlign: 'center',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedStatusOption: {
    backgroundColor: '#f0f8ff',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
