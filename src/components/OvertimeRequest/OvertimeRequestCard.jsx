import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDate } from '../../utils/formatDateTime';

const OvertimeRequestCard = ({ item, getStatusColor, getStatusText, onCardPress }) => {
  return (
    <>
      <TouchableOpacity style={styles.requestCard} onPress={() => onCardPress(item)}>
        <View>
          <View style={styles.requestHeader}>
            <Text style={styles.projectText}>{item.project}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
          <View style={styles.requestInfo}>
            <View style={styles.dateTimeContainer}>
              <Icon name="event" size={16} color="#666666" style={styles.icon} />
              <Text style={styles.dateText}>{formatDate(item.otDate)}</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <Icon
                name="access-time"
                size={16}
                color="#666666"
                style={styles.icon}
              />
              <Text style={styles.timeText}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
            <Text style={styles.reasonText}>{item.reason}</Text>
            <View style={styles.totalHoursContainer}>
              <Text style={styles.totalHoursText}>
                Tổng thời gian: {item.hoursWork} giờ
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  requestInfo: {
    marginTop: 4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  reasonText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  totalHoursContainer: {
    backgroundColor: '#F5F6FA',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  totalHoursText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
});

export default OvertimeRequestCard;
