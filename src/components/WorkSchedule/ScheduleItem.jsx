import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMarkerColor, getMarkerStatusText } from '../../utils/helpers';

const ScheduleItem = ({ icon, time, note, status, title }) => {
  return (
    <View
      style={[styles.itemBox, { borderLeftColor: getMarkerColor(status) }]}>
      {/* <View style={styles.shiftTimeContainer}>
        <Icon name={icon} size={20} color={getMarkerColor(status)} />
        <Text style={styles.shiftTime}>
          {time}
        </Text>
      </View> */}
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.statusText}>
        Trạng thái:{' '}
        <Text style={{ color: getMarkerColor(status) }}>
          {getMarkerStatusText(status)}
        </Text>
      </Text>
        <Text style={styles.noteText}>
          Ghi chú: {note || 'Không có ghi chú'}
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  shiftTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  titleText: {
    fontSize: 16,
    marginTop: 4,
  },
  noteText: {
    marginTop: 4,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyBox: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  shiftTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default ScheduleItem;
