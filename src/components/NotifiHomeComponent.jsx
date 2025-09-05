/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';

const NotifiHomeComponent = ({notifications}) => {
  return (
    <>
      <View style={styles.notificationBox}>
        <Text style={styles.sectionTitle}>🔔 Thông báo mới</Text>
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <Text style={styles.notification}>• {item.text}</Text>
          )}
          ListEmptyComponent={
            <Text style={{color: '#888'}}>Không có thông báo</Text>
          }
        />
      </View>
    </>
  );
};

export default NotifiHomeComponent;

const styles = StyleSheet.create({
  notification: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  notificationBox: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
});
