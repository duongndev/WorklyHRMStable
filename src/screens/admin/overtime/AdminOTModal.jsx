import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';

const AdminOTModal = ({ isModalVisible, onClose, onSubmit, titleButton }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (titleButton === 'Phê duyệt') {
      onSubmit({
        status: 'approved',
      });
      onClose();
    } else {
      if (!reason) {
        Alert.alert('Vui lòng nhập lý do từ chối');
        return;
      }
      onSubmit({
        status: 'rejected',
        reason,
      });
      setReason('');
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setReason('');
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{titleButton}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <CustomTextInput
              label="Lý do"
              placeholder="Nhập lý do..."
              value={reason}
              onChangeText={setReason}
              textArea
            />

            <CustomButton
              title={titleButton}
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
    marginBottom: 20,
  },
  datePickerInput: {
    marginBottom: 16,
  },
  timePickerInput: {
    flex: 1,
    marginRight: 8,
    marginLeft: 8,
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

export default AdminOTModal;
