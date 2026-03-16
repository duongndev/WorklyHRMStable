import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import CustomButton from './CustomButton';

const CancelModalComponent = ({
  isVisible,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.actions}>
            <CustomButton
              title="Hủy"
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
              textStyle={styles.cancelText}
            />

            <CustomButton
              title="Xác nhận"
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
              textStyle={styles.confirmText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 26,
    paddingHorizontal: 22,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  /* Base button */
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginLeft: 12,
  },

  /* Cancel Button */
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  cancelText: {
    color: '#3b82f6',
    fontWeight: '600',
  },

  /* Confirm Button */
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CancelModalComponent;
