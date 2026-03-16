import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';

const LeaveRequestFormModal = ({
  isModalVisible,
  onClose,
  onSubmit,
  leaveRequest,
}) => {
  const [reason, setReason] = useState(leaveRequest?.reason || '');
  const [startDate, setStartDate] = useState(
    leaveRequest?.startDate ? new Date(leaveRequest.startDate) : new Date(),
  );
  const [endDate, setEndDate] = useState(
    leaveRequest?.endDate ? new Date(leaveRequest.endDate) : new Date(),
  );
  const [leaveType, setLeaveType] = useState(leaveRequest?.leaveType || '');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [leaveDurationType, setLeaveDurationType] = useState(
    leaveRequest?.leaveDurationType || 'full_day',
  );
  // store times as strings like "08:30"
  const [startTime, setStartTime] = useState(leaveRequest?.startTime || '');
  const [endTime, setEndTime] = useState(leaveRequest?.endTime || '');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const leaveTypes = [
    {id: '1', name: 'Nghỉ phép năm'},
    {id: '2', name: 'Nghỉ ốm'},
    {id: '3', name: 'Nghỉ việc riêng'},
    {id: '4', name: 'Nghỉ không lương'},
  ];

  const leaveDurationOptions = [
    {id: 'full_day', name: 'Cả ngày'},
    {id: 'half_day', name: 'Nửa ngày'},
    {id: 'time_based', name: 'Theo thời gian'},
  ];

  const handleSubmit = () => {
    // basic validations
    if (!leaveType) {
      Alert.alert('Lỗi', 'Vui lòng chọn loại nghỉ phép.');
      return;
    }

    if (startDate > endDate) {
      Alert.alert('Lỗi', 'Ngày bắt đầu không được sau ngày kết thúc.');
      return;
    }

    let formattedStartDate = startDate.toISOString().split('T')[0];
    let formattedEndDate = endDate.toISOString().split('T')[0];
    let formattedStartTime = null;
    let formattedEndTime = null;

    if (leaveDurationType === 'time_based') {
      if (!startTime || !endTime) {
        Alert.alert('Lỗi', 'Vui lòng chọn giờ bắt đầu và giờ kết thúc.');
        return;
      }
      const tStart = new Date(`2000-01-01T${startTime}`);
      const tEnd = new Date(`2000-01-01T${endTime}`);
      if (tEnd <= tStart) {
        Alert.alert('Lỗi', 'Giờ kết thúc phải sau giờ bắt đầu.');
        return;
      }
      formattedStartTime = startTime;
      formattedEndTime = endTime;
    }

    const newRequest = {
      reason,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      leaveType,
      leaveDurationType,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    if (leaveRequest?._id) {
      onSubmit(leaveRequest._id, newRequest);
      onClose();
    } else {
      onSubmit(newRequest);
      onClose();
    }

    // reset local state
    setReason('');
    setLeaveType('');
    setStartDate(new Date());
    setEndDate(new Date());
    setLeaveDurationType('full_day');
    setStartTime('');
    setEndTime('');
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (type === 'start') {
      setShowStartPicker(false);
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    } else if (type === 'end') {
      setShowEndPicker(false);
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(
        selectedTime.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newEndTime = selectedTime.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const currentStartTime = new Date(`2000-01-01T${startTime}`);
      const selectedEndDateTime = new Date(`2000-01-01T${newEndTime}`);

      if (startTime && selectedEndDateTime <= currentStartTime) {
        Alert.alert('Lỗi', 'Giờ kết thúc phải sau giờ bắt đầu.');
        setEndTime('');
      } else {
        setEndTime(newEndTime);
      }
    }
  };

  useEffect(() => {
    if (leaveRequest) {
      setReason(leaveRequest.reason || '');
      setStartDate(
        leaveRequest.startDate ? new Date(leaveRequest.startDate) : new Date(),
      );
      setEndDate(
        leaveRequest.endDate ? new Date(leaveRequest.endDate) : new Date(),
      );
      setLeaveType(leaveRequest.leaveType || '');
      setLeaveDurationType(leaveRequest.leaveDurationType || 'full_day');
      setStartTime(leaveRequest.startTime || '');
      setEndTime(leaveRequest.endTime || '');
    }
  }, [leaveRequest]);

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {leaveRequest?._id
                ? 'Chỉnh sửa yêu cầu nghỉ phép'
                : 'Tạo yêu cầu nghỉ phép'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Loại nghỉ phép</Text>
              <View style={styles.leaveTypeContainer}>
                {leaveTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.leaveTypeButton,
                      leaveType === type.name && styles.leaveTypeButtonActive, // Changed from type.id to type.name
                    ]}
                    onPress={() => setLeaveType(type.name)}>
                    <Text
                      style={[
                        styles.leaveTypeText,
                        leaveType === type.name && styles.leaveTypeTextActive, // Changed from type.id to type.name
                      ]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Thời gian nghỉ</Text>
              <View style={styles.leaveTypeContainer}>
                {leaveDurationOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.leaveTypeButton,
                      leaveDurationType === option.id &&
                        styles.leaveTypeButtonActive,
                    ]}
                    onPress={() => setLeaveDurationType(option.id)}>
                    <Text
                      style={[
                        styles.leaveTypeText,
                        leaveDurationType === option.id &&
                          styles.leaveTypeTextActive,
                      ]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <CustomTextInput
              label="Ngày bắt đầu"
              placeholder="DD/MM/YYYY"
              value={startDate.toLocaleDateString('vi-VN')}
              onPress={() => setShowStartPicker(true)}
              editable={false}
            />
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, 'start')
                }
              />
            )}

            <CustomTextInput
              label="Ngày kết thúc"
              placeholder="DD/MM/YYYY"
              value={endDate.toLocaleDateString('vi-VN')}
              onPress={() => setShowEndPicker(true)}
            />
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, 'end')
                }
              />
            )}

            {leaveDurationType === 'time_based' && (
              <View style={styles.timeContainer}>
                <CustomTextInput
                  label="Giờ bắt đầu"
                  placeholder="00:00"
                  value={startTime}
                  onPress={() => setShowStartTimePicker(true)}
                  editable={false}
                />

                <View style={styles.separatorWrapper}>
                  <Text style={styles.separatorText}>–</Text>
                </View>

                <CustomTextInput
                  label="Giờ kết thúc"
                  placeholder="00:00"
                  value={endTime}
                  onPress={() => setShowEndTimePicker(true)}
                  editable={false}
                />

                {showStartTimePicker && (
                  <DateTimePicker
                    value={
                      startTime
                        ? new Date(`2000-01-01T${startTime}`)
                        : new Date()
                    }
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartTimeChange}
                  />
                )}

                {showEndTimePicker && (
                  <DateTimePicker
                    value={
                      endTime ? new Date(`2000-01-01T${endTime}`) : new Date()
                    }
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndTimeChange}
                  />
                )}
              </View>
            )}

            <CustomTextInput
              label="Lý do"
              placeholder="Nhập lý do nghỉ phép..."
              value={reason}
              onChangeText={setReason}
              textArea
            />

            <CustomButton
              title="Gửi yêu cầu"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  leaveTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  leaveTypeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  leaveTypeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  leaveTypeText: {
    color: '#666666',
    fontSize: 14,
  },
  leaveTypeTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  timeInputContainer: {
    flexDirection: 'row',
  },
  timeInputColumn: {
    width: '48%',
  },
  separatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 10,
  },
  separatorText: {
    color: '#666666',
  },
  timeContainer: {
    flexDirection: 'row',
  },
});

export default LeaveRequestFormModal;
