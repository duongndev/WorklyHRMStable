import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ShiftItem from './ShiftItem';
import moment from 'moment';

const ScheduleCard = (schedules) => {
    // format moment to Vietnamese local
    moment.updateLocale('vi', {
      months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm',
      },
    });
    moment.locale('vi');

  return (
    <>
        <View style={styles.dayCard}>
        <Text style={styles.dateText}>
          {moment(schedules.date).format('dddd, DD/MM/YYYY')}
        </Text>
        <ShiftItem shift={schedules.schedules}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dayCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    marginTop: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  taskEmpty: {
    marginLeft: 10,
    fontStyle: 'italic',
    color: '#888',
  },
  contentContainer: {
    padding: 16,
  },
});

export default ScheduleCard;
