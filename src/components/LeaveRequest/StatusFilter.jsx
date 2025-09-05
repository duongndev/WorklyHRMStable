import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const StatusFilter = ({statusFilters, selectedStatus, setSelectedStatus}) => {
  return (
    <>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedStatus === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedStatus(filter.id)}>
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === filter.id && styles.filterTextActive,
                ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F6FA',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#666666',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});

export default StatusFilter;
