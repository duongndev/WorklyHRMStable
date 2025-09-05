import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';

const LeaveRequestFormModal = ({isModalVisible, onClose, onSubmit}) => {
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [leaveType, setLeaveType] = useState(''); // Updated to store name
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [leaveDurationType, setLeaveDurationType] = useState('full_day');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
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
    let formattedStartDate = startDate.toISOString().split('T')[0];
    let formattedEndDate = endDate.toISOString().split('T')[0];
    let formattedStartTime = null;
    let formattedEndTime = null;

    if (leaveDurationType === 'time_based') {
      formattedStartTime = startTime.toTimeString().split(' ')[0].substring(0, 5);
      formattedEndTime = endTime.toTimeString().split(' ')[0].substring(0, 5);
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
    onSubmit(newRequest);
    onClose();
    setReason('');
    setLeaveType('');
    setStartDate(new Date());
    setEndDate(new Date());
    setLeaveDurationType('full_day');
    setStartTime(new Date());
    setEndTime(new Date());
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (type === 'start') {
      setShowStartPicker(Platform.OS === 'ios');
      if (selectedDate) setStartDate(selectedDate);
    } else if (type === 'end') {
      setShowEndPicker(Platform.OS === 'ios');
      if (selectedDate) setEndDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime, type) => {
    if (type === 'start') {
      setShowStartTimePicker(Platform.OS === 'ios');
      if (selectedTime) setStartTime(selectedTime);
    } else if (type === 'end') {
      setShowEndTimePicker(Platform.OS === 'ios');
      if (selectedTime) setEndTime(selectedTime);
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tạo yêu cầu nghỉ phép</Text>
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
                      leaveDurationType === option.id && styles.leaveTypeButtonActive,
                    ]}
                    onPress={() => setLeaveDurationType(option.id)}>
                    <Text
                      style={[
                        styles.leaveTypeText,
                        leaveDurationType === option.id && styles.leaveTypeTextActive,
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
              keyboardType={'numeric'}
            />
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'start')}
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
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'end')}
              />
            )}

            {leaveDurationType === 'time_based' && (
              <View style={styles.timeInputContainer}>
                <View style={styles.timeInputColumn}>
                  <CustomTextInput
                    label="Giờ bắt đầu"
                    placeholder="HH:MM"
                    value={startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    onPress={() => setShowStartTimePicker(true)}
                  />
                  {showStartTimePicker && (
                    <DateTimePicker
                      value={startTime}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'start')}
                    />
                  )}
                </View>

                <View style={styles.timeInputColumn}>
                  <CustomTextInput
                    label="Giờ kết thúc"
                    placeholder="HH:MM"
                    value={endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    onPress={() => setShowEndTimePicker(true)}
                  />
                  {showEndTimePicker && (
                    <DateTimePicker
                      value={endTime}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'end')}
                    />
                  )}
                </View>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputColumn: {
    width: '48%',
  },
});

export default LeaveRequestFormModal;
