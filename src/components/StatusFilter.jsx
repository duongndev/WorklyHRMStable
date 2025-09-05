import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const StatusFilter = ({
  statusFilters, 
  selectedStatus, 
  setSelectedStatus,
  // New props for compatibility
  options,
  selectedValue,
  onValueChange
}) => {
  // Use new props if available, otherwise fall back to old props
  const filters = options || statusFilters;
  const selected = selectedValue !== undefined ? selectedValue : selectedStatus;
  const onChange = onValueChange || setSelectedStatus;
  
  return (
    <>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(filter => {
            const key = filter.id || filter.value;
            const label = filter.label;
            const isSelected = selected === key;
            
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterButton,
                  isSelected && styles.filterButtonActive,
                ]}
                onPress={() => onChange(key)}>
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
