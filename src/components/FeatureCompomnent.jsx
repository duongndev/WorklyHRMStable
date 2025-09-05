import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const FeatureCompomnent = ({toAttendance, toLeaveRequest, toOvertimeRequest, toWorkSchedule}) => {


  return (
    <View style={styles.featureRowFixed}>
      <TouchableOpacity style={styles.featureItemFixed} onPress={toAttendance}>
        <Icon name="finger-print-outline" size={24} color="#4e6cef" />
        <Text style={styles.featureLabelFixed}>Chấm công</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.featureItemFixed} onPress={toLeaveRequest}>
        <Icon name="calendar-outline" size={24} color="#00a86b" />
        <Text style={styles.featureLabelFixed}>Xin nghỉ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.featureItemFixed} onPress={toOvertimeRequest}>
        <Icon name="time-outline" size={24} color="#e67e22" />
        <Text style={styles.featureLabelFixed}>Xin OT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.featureItemFixed} onPress={toWorkSchedule}>
        <Icon name="calendar-number-outline" size={24} color="#6c5ce7" />
        <Text style={styles.featureLabelFixed}>Lịch làm việc</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeatureCompomnent;

const styles = StyleSheet.create({
  featureRowFixed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 1,
    marginTop: 16,
  },
  featureItemFixed: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  featureLabelFixed: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});
