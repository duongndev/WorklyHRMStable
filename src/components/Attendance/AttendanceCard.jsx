import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';


const getStatusStyles = status => {
  const base = {container: styles.statusBadge, text: styles.statusText};
  if (!status) return base;
  const s = `${status}`.toLowerCase();
  if (s.includes('') || s.includes('muộn')) {
    return {
      container: [styles.statusBadge, styles.statusWarning],
      text: styles.statusText,
    };
  }
  if (s.includes('absent') || s.includes('nghỉ')) {
    return {
      container: [styles.statusBadge, styles.statusDanger],
      text: styles.statusText,
    };
  }
  return {container: [styles.statusBadge, styles.statusSuccess], text: styles.statusText};
};

const AttendanceCard = ({item}) => {
  console.log(item);
  const key = item?.id || item?._id || `${item?.date}-${item?.checkInTime}`;
  const statusStyles = getStatusStyles(item?.status);

  return (
    <View style={styles.card} key={key}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {item?.date ? moment(item.date).format('DD/MM/YYYY') : ''}
        </Text>
        <View style={statusStyles.container}>
          <Text style={statusStyles.text}>{item?.status || '—'}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Icon name="clock-in" size={20} color="#666666" />
          <Text style={styles.timeLabel}>Giờ vào</Text>
          <Text style={styles.timeValue}>{item?.checkInTime}</Text>
        </View>
        <View style={styles.timeItem}>
          <Icon name="clock-out" size={20} color="#666666" />
          <Text style={styles.timeLabel}>Giờ ra</Text>
          <Text style={styles.timeValue}>{item?.checkOutTime}</Text>
        </View>
      </View>
        <View style={styles.durationContainer}>
          <Icon name="timer-outline" size={18} color="#555" />
          <Text style={styles.durationText}>Tổng giờ: {item?.workDuration}</Text>
        </View>

      {/* <View style={styles.locationContainer}>
        <Icon name="map-marker" size={20} color="#666666" />
        <Text style={styles.locationText}>{item?.location || '—'}</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusSuccess: {
    backgroundColor: '#4CAF50',
  },
  statusWarning: {
    backgroundColor: '#FF9800',
  },
  statusDanger: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  durationText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
});

export default AttendanceCard;

