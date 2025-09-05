import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarSection = ({ selected, onDayPress, markedDates, style }) => {
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        markingType={'multi-dot'}
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selected]: {
            selected: true,
            selectedColor: '#2196F3',
            ...markedDates[selected],
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: '#00adf5',
          textSectionTitleColor: '#444',
        }}
        enableSwipeMonths={true}
        showWeekNumbers={false}
        hideExtraDays={false}
        disableAllTouchEventsForDisabledDays={false}
        firstDay={1}
        style={style}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    padding: 8,
    elevation: 2,

  },
});

export default CalendarSection;
