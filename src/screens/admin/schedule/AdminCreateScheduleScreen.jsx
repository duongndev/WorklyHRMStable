import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from '../../../components/HeaderScreen';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import {
  getAllSchedulesApi,
  createScheduleApi,
  updateScheduleApi,
  deleteScheduleApi,
  assignScheduleToEmployeeApi,
  getAllEmployeesApi,
} from '../../../services/AdminApiService';
import {formatDateTime} from '../../../utils/formatDateTime';

const AdminCreateScheduleScreen = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    startTime: '',
    endTime: '',
    workDays: [],
    description: '',
    isActive: true,
  });

  const weekDays = [
    {label: 'Thứ 2', value: 'monday'},
    {label: 'Thứ 3', value: 'tuesday'},
    {label: 'Thứ 4', value: 'wednesday'},
    {label: 'Thứ 5', value: 'thursday'},
    {label: 'Thứ 6', value: 'friday'},
    {label: 'Thứ 7', value: 'saturday'},
    {label: 'Chủ nhật', value: 'sunday'},
  ];

  useEffect(() => {
    fetchSchedules();
    fetchEmployees();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await getAllSchedulesApi({page: 1, limit: 50});
      if (response.success) {
        setSchedules(response.data.schedules || []);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployeesApi(1, 100);
      if (response.success) {
        setEmployees(response.data.employees || []);
      }
    } catch (error) {
      console.log('Error fetching employees:', error);
    }
  };

  const handleCreateSchedule = async () => {
    if (
      !newSchedule.name.trim() ||
      !newSchedule.startTime ||
      !newSchedule.endTime
    ) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (newSchedule.workDays.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một ngày làm việc');
      return;
    }

    setLoading(true);
    try {
      const response = await createScheduleApi(newSchedule);
      if (response.success) {
        setSchedules([response.data, ...schedules]);
        setShowCreateModal(false);
        setNewSchedule({
          name: '',
          startTime: '',
          endTime: '',
          workDays: [],
          description: '',
          isActive: true,
        });
        Alert.alert('Thành công', 'Tạo lịch làm việc thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = schedule => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa lịch làm việc này?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => confirmDeleteSchedule(schedule.id),
        },
      ],
    );
  };

  const confirmDeleteSchedule = async id => {
    try {
      const response = await deleteScheduleApi(id);
      if (response.success) {
        setSchedules(schedules.filter(s => s.id !== id));
        Alert.alert('Thành công', 'Xóa lịch làm việc thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa lịch làm việc');
    }
  };

  const handleAssignSchedule = schedule => {
    setSelectedSchedule(schedule);
    setSelectedEmployees([]);
    setShowAssignModal(true);
  };

  const confirmAssignSchedule = async () => {
    if (selectedEmployees.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một nhân viên');
      return;
    }

    try {
      const response = await assignScheduleToEmployeeApi(
        selectedSchedule.id,
        selectedEmployees,
      );
      if (response.success) {
        setShowAssignModal(false);
        Alert.alert('Thành công', 'Gán lịch làm việc thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gán lịch làm việc');
    }
  };

  const toggleWorkDay = day => {
    const updatedWorkDays = newSchedule.workDays.includes(day)
      ? newSchedule.workDays.filter(d => d !== day)
      : [...newSchedule.workDays, day];

    setNewSchedule(prev => ({...prev, workDays: updatedWorkDays}));
  };

  const toggleEmployeeSelection = employeeId => {
    const updatedSelection = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId];

    setSelectedEmployees(updatedSelection);
  };

  const renderScheduleItem = ({item}) => {
    const workDaysText =
      item.workDays
        ?.map(day => {
          const dayObj = weekDays.find(d => d.value === day);
          return dayObj ? dayObj.label : day;
        })
        .join(', ') || 'Chưa thiết lập';

    return (
      <View style={styles.scheduleItem}>
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleName}>{item.name}</Text>
            <Text style={styles.scheduleTime}>
              {item.startTime} - {item.endTime}
            </Text>
            <Text style={styles.workDays}>{workDaysText}</Text>
            {item.description && (
              <Text style={styles.scheduleDescription}>{item.description}</Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: item.isActive ? '#4CAF50' : '#F44336'},
            ]}>
            <Text style={styles.statusText}>
              {item.isActive ? 'Hoạt động' : 'Tạm dừng'}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleActions}>
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: '#007AFF'}]}
            onPress={() => handleAssignSchedule(item)}>
            <Icon name="people-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Gán NV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: '#F44336'}]}
            onPress={() => handleDeleteSchedule(item)}>
            <Icon name="trash-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmployeeItem = ({item}) => {
    const isSelected = selectedEmployees.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.employeeItem, isSelected && styles.selectedEmployeeItem]}
        onPress={() => toggleEmployeeSelection(item.id)}>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.fullName}</Text>
          <Text style={styles.employeeId}>ID: {item.employeeId}</Text>
          <Text style={styles.employeeDepartment}>{item.department}</Text>
        </View>
        {isSelected && (
          <Icon name="checkmark-circle" size={24} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Quản lý lịch làm việc"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={() => setShowCreateModal(true)}>
            <Icon name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <FlatList
          data={schedules}
          keyExtractor={item => item.id.toString()}
          renderItem={renderScheduleItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có lịch làm việc nào</Text>
              <Text style={styles.emptySubText}>
                Tạo lịch làm việc đầu tiên
              </Text>
            </View>
          }
        />
      </View>

      {/* Create Schedule Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo lịch làm việc mới</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomTextInput
                label="Tên lịch làm việc *"
                value={newSchedule.name}
                onChangeText={text =>
                  setNewSchedule(prev => ({...prev, name: text}))
                }
                placeholder="VD: Ca hành chính"
              />

              <View style={styles.timeContainer}>
                <View style={styles.timeInput}>
                  <CustomTextInput
                    label="Giờ bắt đầu *"
                    value={newSchedule.startTime}
                    onChangeText={text =>
                      setNewSchedule(prev => ({...prev, startTime: text}))
                    }
                    placeholder="08:00"
                  />
                </View>
                <View style={styles.timeInput}>
                  <CustomTextInput
                    label="Giờ kết thúc *"
                    value={newSchedule.endTime}
                    onChangeText={text =>
                      setNewSchedule(prev => ({...prev, endTime: text}))
                    }
                    placeholder="17:00"
                  />
                </View>
              </View>

              <View style={styles.workDaysContainer}>
                <Text style={styles.workDaysLabel}>Ngày làm việc *</Text>
                <View style={styles.workDaysGrid}>
                  {weekDays.map(day => (
                    <TouchableOpacity
                      key={day.value}
                      style={[
                        styles.workDayButton,
                        newSchedule.workDays.includes(day.value) &&
                          styles.selectedWorkDayButton,
                      ]}
                      onPress={() => toggleWorkDay(day.value)}>
                      <Text
                        style={[
                          styles.workDayButtonText,
                          newSchedule.workDays.includes(day.value) &&
                            styles.selectedWorkDayButtonText,
                        ]}>
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <CustomTextInput
                label="Mô tả"
                value={newSchedule.description}
                onChangeText={text =>
                  setNewSchedule(prev => ({...prev, description: text}))
                }
                placeholder="Mô tả về lịch làm việc"
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateSchedule}
                disabled={loading}>
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Đang tạo...' : 'Tạo lịch'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign Schedule Modal */}
      <Modal
        visible={showAssignModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gán lịch làm việc</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedSchedule && (
              <View style={styles.selectedScheduleInfo}>
                <Text style={styles.selectedScheduleName}>
                  {selectedSchedule.name}
                </Text>
                <Text style={styles.selectedScheduleTime}>
                  {selectedSchedule.startTime} - {selectedSchedule.endTime}
                </Text>
              </View>
            )}

            <Text style={styles.employeeListTitle}>
              Chọn nhân viên ({selectedEmployees.length} đã chọn)
            </Text>

            <FlatList
              data={employees}
              keyExtractor={item => item.id.toString()}
              renderItem={renderEmployeeItem}
              showsVerticalScrollIndicator={false}
              style={styles.employeeList}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAssignModal(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmAssignSchedule}>
                <Text style={styles.confirmButtonText}>Gán lịch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminCreateScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  workDays: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
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
  timeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  workDaysContainer: {
    marginBottom: 16,
  },
  workDaysLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  workDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  workDayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedWorkDayButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  workDayButtonText: {
    fontSize: 12,
    color: '#666',
  },
  selectedWorkDayButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  selectedScheduleInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedScheduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedScheduleTime: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  employeeListTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  employeeList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedEmployeeItem: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  employeeId: {
    fontSize: 12,
    color: '#666',
  },
  employeeDepartment: {
    fontSize: 12,
    color: '#666',
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
