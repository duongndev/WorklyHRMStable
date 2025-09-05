import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ViewEmptyComponent = ({title, description}) => {
  return (
    <>
      <View style={styles.viewEmpty}>
        <Text style={styles.textEmpty}>{title}</Text>
        {description && (
          <Text style={styles.textDescription}>{description}</Text>
        )}
      </View>
    </>
  );
};

export default ViewEmptyComponent;

const styles = StyleSheet.create({
  viewEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  textEmpty: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  textDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
