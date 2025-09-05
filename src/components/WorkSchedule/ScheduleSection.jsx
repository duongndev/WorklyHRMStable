import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import ScheduleItem from './ScheduleItem';
import {formatDate} from '../../utils/helpers';

const ScheduleSection = ({schedule, selected}) => {
  const renderItem = ({item}) => {
    return (
      <ScheduleItem
        icon="clock-outline"
        note={item.note}
        status={item.status}
        title={item.shift}
      />
    );
  };

  return (
    <>
      <View style={styles.scheduleContainer}>
        {/* <Text style={styles.scheduleTitle}>{selected ? formatDate(selected) : 'Chọn ngày'}</Text> */}

        {schedule.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Không có lịch làm việc</Text>
          </View>
        ) : (
          <FlatList
            data={schedule}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            removeClippedSubviews={false}
            style={styles.listContainer}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scheduleContainer: {
    margin: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '400',
    color: '#444444',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ScheduleSection;
