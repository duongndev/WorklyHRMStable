import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDate } from '../../utils/formatDateTime';

const LeaveRequestCard = ({
  item,
  getStatusColor,
  getStatusText,
  onClickLeave,
}) => {
  const handleClickLeave = () => {
    onClickLeave(item);
  };
  return (
    <>
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => handleClickLeave()}>
        <View>
          <View style={styles.requestHeader}>
            <Text style={styles.requestType}>{item.leaveType}</Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}>
              <Text style={styles.statusText}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.dateText}>
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </Text>
            <Text style={styles.reasonText}>{item.reason}</Text>
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
    marginBottom: 8,
  },
  requestType: {
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
    marginTop: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
});

export default LeaveRequestCard;
