import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform, // Import Platform for OS-specific logic
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';

const OvertimeRequestFormModal = ({ isModalVisible, onClose, onSubmit, overtimeRequest }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [otDate, setOtDate] = useState(overtimeRequest?.otDate ? new Date(overtimeRequest.otDate) : new Date());
  const [startTime, setStartTime] = useState(overtimeRequest?.startTime || '');
  const [endTime, setEndTime] = useState(overtimeRequest?.endTime || '');
  const [reason, setReason] = useState(overtimeRequest?.reason || '');
  const [project, setProject] = useState(overtimeRequest?.project || '');
  const [totalTime, setTotalTime] = useState('');

  useEffect(() => {
    if (overtimeRequest) {
      setOtDate(overtimeRequest.otDate ? new Date(overtimeRequest.otDate) : new Date());
      setStartTime(overtimeRequest.startTime || '');
      setEndTime(overtimeRequest.endTime || '');
      setReason(overtimeRequest.reason || '');
      setProject(overtimeRequest.project || '');
    }
  }, [overtimeRequest]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setOtDate(selectedDate);
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newEndTime = selectedTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const currentStartTime = new Date(`2000-01-01T${startTime}`);
      const selectedEndDateTime = new Date(`2000-01-01T${newEndTime}`);

      if (selectedEndDateTime <= currentStartTime) {
        Alert.alert('Lỗi', 'Giờ kết thúc phải sau giờ bắt đầu.');
        setEndTime(''); // Clear end time if invalid
      } else {
        setEndTime(newEndTime);
      }
    }
  };

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      Alert.alert('Lỗi', 'Vui lòng chọn đầy đủ Giờ bắt đầu và Giờ kết thúc.');
      return;
    }

    const timeStart = new Date(`2000-01-01T${startTime}`);
    const timeEnd = new Date(`2000-01-01T${endTime}`);

    if (timeEnd <= timeStart) {
      Alert.alert('Lỗi', 'Giờ kết thúc phải sau giờ bắt đầu.');
      return;
    }
    if (!reason) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do.');
      return;
    }
    if (!project) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên dự án.');
      return;
    }
    const newOvertimeRequest = {
      otDate: otDate.toISOString().split('T')[0],
      startTime,
      endTime,
      reason,
      project,
    };
    // nếu có id thì truyền id + newOvertimeRequest, không thì chỉ truyền newOvertimeRequest
    if (overtimeRequest?._id) {
      onSubmit(overtimeRequest._id, newOvertimeRequest);
      onClose();
    } else {
      onSubmit(newOvertimeRequest);
      // onClose();
      // setStartTime('');
      // setEndTime('');
      // setReason('');
      // setProject('');
    }
  };

  const handleCancel = () => {
    onClose();
    setTotalTime('');
    setStartTime('');
    setEndTime('');
    setReason('');
    setProject('');
  };

  useEffect(() => {
    if (startTime && endTime) {
      const timeStart = new Date(`2000-01-01T${startTime}`);
      const timeEnd = new Date(`2000-01-01T${endTime}`);
      const diff = timeEnd - timeStart;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      // tổng thời gian không quá 8 tiếng
      if (hours > 8) {
        Alert.alert('Lỗi', 'Tổng thời gian làm thêm không được vượt quá 8 tiếng.');
        setTotalTime('');
        setStartTime('');
        setEndTime('');
        return;
      }
      setTotalTime(`${hours}h${minutes}p`);
    } else {
      setTotalTime('');
    }
  }, [startTime, endTime]);

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{overtimeRequest?._id ? 'Chỉnh sửa yêu cầu OT' : 'Tạo yêu cầu OT'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <CustomTextInput
              label="Ngày làm thêm"
              placeholder="DD/MM/YYYY"
              value={otDate.toLocaleDateString('vi-VN')}
              onPress={() => setShowDatePicker(true)}
              editable={false} // Make it not directly editable
            />

            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={otDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <View style={styles.timeContainer}>
              <View style={{ flexDirection: 'row' }}>
                <CustomTextInput
                  label="Giờ bắt đầu"
                  placeholder="00:00"
                  value={startTime}
                  onPress={() => setShowStartTimePicker(true)}
                  editable={false} // Make it not directly editable
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginTop: 10 }}>
                  <Text style={{ color: '#666666' }}>–</Text>
                </View>

                <CustomTextInput
                  label="Giờ kết thúc"
                  placeholder="00:00"
                  value={endTime}
                  onPress={() => setShowEndTimePicker(true)}
                  editable={false} // Make it not directly editable
                />
              </View>
            </View>


            {showStartTimePicker && (
              <DateTimePicker
                testID="startTimePicker"
                value={startTime ? new Date(`2000-01-01T${startTime}`) : new Date()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onStartTimeChange}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                testID="endTimePicker"
                value={endTime ? new Date(`2000-01-01T${endTime}`) : new Date()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onEndTimeChange}
              />
            )}

            <CustomTextInput
              label="Dự án"
              placeholder="Nhập tên dự án..."
              value={project}
              onChangeText={setProject}
            />

            <CustomTextInput
              label="Lý do"
              placeholder="Nhập lý do làm thêm giờ..."
              value={reason}
              onChangeText={setReason}
              textArea
            />

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Tổng thời gian</Text>
              <Text style={styles.summaryTime}>{totalTime}</Text>
            </View>

            <CustomButton
              title={overtimeRequest?._id ? 'Cập nhật yêu cầu' : 'Tạo mới yêu cầu'}
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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerInput: {
    marginBottom: 16,
  },
  timePickerInput: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  summaryTime: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2196F3',
  },
  submitButton: {
    marginBottom: 40,
  },
});

export default OvertimeRequestFormModal;
