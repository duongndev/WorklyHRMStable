import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { formatTime } from '../../utils/formatDateTime';

/**
 * Component hiển thị thời gian check in/out
 * @param {Object} props
 * @param {string} props.checkInTime - Thời gian check in (ISO string)
 * @param {string} props.checkOutTime - Thời gian check out (ISO string)
 * @param {Object} props.style - Custom style cho container
 */
const AttendanceTimeCard = ({ checkInTime, checkOutTime, style }) => {


  return (
    <View style={[styles.timeCard, style]}>
      <View style={styles.timeItem}>
        <Text style={styles.timeLabel}>Giờ vào</Text>
        <Text style={styles.timeValue}>{formatTime(checkInTime)}</Text>
      </View>
      <View style={styles.timeItem}>
        <Text style={styles.timeLabel}>Giờ ra</Text>
        <Text style={styles.timeValue}>{formatTime(checkOutTime)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default AttendanceTimeCard;