import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { formatCurrentTime } from '../utils/formatDateTime';

const CheckInOutBoxComponent = ({ checkInTime, checkOutTime, location }) => {

  // hiển thị thời gian realtime
  const [currentTime, setCurrentTime] = useState(formatCurrentTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const displayCheckIn = formatCurrentTime(checkInTime) || currentTime;
  const displayCheckOut = formatCurrentTime(checkOutTime) || currentTime;
  const displayLocation = (() => {
    if (typeof location === 'string') return location;
    if (location && typeof location === 'object') {
      const lat = location.lat ?? location.latitude;
      const lng = location.lng ?? location.longitude;
      if (lat != null && lng != null) return `${lat}, ${lng}`;
      try { return JSON.stringify(location); } catch { return '—'; }
    }
    return '';
  })();

  return (
    <>
      <View style={styles.checkBox}>
        <Text style={styles.motto}>
          Sáng trưa chiều tối điểm danh{'\n'}
          Quanh năm lương thưởng cả nhà đều vui.
        </Text>

        <View style={styles.shiftBox}>
          <Text style={styles.shiftText}>Ca làm: 08:00 - 17:00</Text>
        </View>
        <View style={styles.timeRow}>
          <View style={styles.checkInBox}>
            <Text style={styles.checkLabel}>CHECK IN</Text>
            <Text style={styles.checkTime}>{displayCheckIn}</Text>
          </View>
          <View style={styles.checkOutBox}>
            <Text style={styles.checkLabel}>CHECK OUT</Text>
            <Text style={styles.checkTimeOut}>{displayCheckOut}</Text>
          </View>
        </View>

        <Text style={styles.location}>
          ✅ Địa điểm được phép checkin{'\n'}
          <Text style={styles.textLocation}>{displayLocation || '—'}</Text>
        </Text>
      </View>
    </>
  );
};

export default CheckInOutBoxComponent;

const styles = StyleSheet.create({
  checkBox: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  motto: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkInBox: {
    backgroundColor: '#e0fbe2',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  checkOutBox: {
    backgroundColor: '#ece6fd',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  checkLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  checkTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d8a4f',
  },
  checkTimeOut: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7c5ce5',
  },
  location: {
    fontSize: 13,
    color: '#444',
  },
  textLocation: {
    fontSize: 13,
    color: '#444',
    fontWeight: 'bold',
  },
  shiftBox: {
    backgroundColor: '#F0F4FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  shiftText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
