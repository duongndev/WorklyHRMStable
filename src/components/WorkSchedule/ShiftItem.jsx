import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShiftItem = ({ shift }) => {
  const shiftStatus = status => {
    // ["present", "late", "absent", "leave", "off", "ot"],
    switch (status) {
      case 'present':
        return 'Làm việc';
      case 'late':
        return 'Muộn giờ';
      case 'absent':
        return 'Vắng mặt';
      case 'leave':
        return 'Nghỉ phép';
      case 'off':
        return 'Vắng mặt';
      case 'ot':
        return 'OT';
      default:
        return 'Làm việc';
    }
  };
  const shiftType = shiftt => {
    // ["present", "late", "absent", "leave", "off", "ot"],
    switch (shiftt) {
      case 'morning':
        return 'Buổi sáng';
      case 'afternoon':
        return 'Buổi chiều';
      case 'evening':
        return 'Buổi tối';
      default:
        return 'Không xác định';
    }
  };
  return (
    <>
      <View style={styles.shiftBox} key={shift.type}>
        {shift.shifts && Array.isArray(shift.shifts) && shift.shifts.length > 0 ? (
          shift.shifts.map((item, idx) => (
            <View key={item.type || idx}>
              <Text style={styles.shiftTitle}>
                {shiftType(item.type)} - {shiftStatus(item.status)}
              </Text>
              {item.tasks && item.tasks.length > 0 ? (
                item.tasks.map((task, tIdx) => (
                  <Text style={styles.taskItem} key={tIdx}>
                    • {task}
                  </Text>
                ))
              ) : (
                <Text style={styles.taskEmpty}>Không có công việc</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.taskEmpty}>Không có ca làm việc</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  shiftBox: {
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
  },
  shiftTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#3b82f6',
  },
  taskItem: {
    marginLeft: 10,
    color: '#333',
  },
  taskEmpty: {
    marginLeft: 10,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default ShiftItem;
