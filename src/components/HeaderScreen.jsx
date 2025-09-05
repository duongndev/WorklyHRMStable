import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

const HeaderScreen = ({title, showBack = true, rightComponent}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Check if we're in a bottom tab screen
  const isBottomTabScreen = route.name.includes('Tab');

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        {showBack && !isBottomTabScreen && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightComponent && (
        <View style={styles.headerRight}>{rightComponent}</View>
      )}
    </View>
  );
};

export default HeaderScreen;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2196F3',
    paddingTop: 10,
    padding: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
    marginTop: 25,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginLeft: 5,
  },
});
