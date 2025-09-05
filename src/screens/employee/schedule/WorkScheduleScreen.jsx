import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  View,
  Text,
  Dimensions
} from 'react-native';

import { LocaleConfig } from 'react-native-calendars';
import CalendarSection from '../../../components/WorkSchedule/CalendarSection';
import ScheduleSection from '../../../components/WorkSchedule/ScheduleSection';
import HeaderScreen from '../../../components/HeaderScreen';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearError,
  clearMessage,
} from '../../../redux/schedule/scheduleSlice';
import { getMySchedulesMonth } from '../../../redux/schedule/scheduleAction';
import {
  groupByDate,
  generateMarkedDates,
  getMarkerColor,
  formatDate,
} from '../../../utils/helpers';

// Configure Vietnamese locale
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
  ],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};

LocaleConfig.defaultLocale = 'vi';

const screenHeight = Dimensions.get('window').height;

const WorkScheduleScreen = () => {
  const [selected, setSelected] = useState(true);
  const dispatch = useDispatch();
  const schedule = useSelector(state => state.schedule.schedules);
  const loading = useSelector(state => state.schedule.loading);
  const [groupedSchedules, setGroupedSchedules] = useState([]);
  const today = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);


  useEffect(() => {
    const fetchScheduleMonth = async () => {
      const resultAction = await dispatch(getMySchedulesMonth());

      if (getMySchedulesMonth.fulfilled.match(resultAction)) {
        const grouped = groupByDate(resultAction.payload.data.schedules);
        setGroupedSchedules(grouped);
      } else if (getMySchedulesMonth.rejected.match(resultAction)) {
        console.error('Failed to fetch monthly schedules:', resultAction.payload?.message);
      }
    };
    fetchScheduleMonth();
  }, [dispatch]);
  const dataForSelectedDate = groupedSchedules[selectedDate] || [];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Lịch làm việc" />
      <View style={styles.content}>
        <CalendarSection
          selected={selectedDate}
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={generateMarkedDates(groupedSchedules)}
          style={styles.calendar}
        />
        <ScheduleSection selected={selectedDate} schedule={dataForSelectedDate} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  content: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
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
  },
  statusText: {
    fontSize: 15,
    marginTop: 4,
  },
  noteText: {
    marginTop: 4,
    fontSize: 14,
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
  calendarContainer: {
    height: screenHeight * 0.4,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  calendar: {
    margin: 10,
    borderRadius: 10,
  },

  // Phần chi tiết chiếm 60% còn lại
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});

export default WorkScheduleScreen;
