import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Component hiển thị menu items trong ProfileScreen
 * @param {Object} props
 * @param {Array} props.menuItems - Array các menu items
 * @param {Function} props.onItemPress - Callback khi press vào item
 * @param {Object} props.containerStyle - Custom style cho container
 */
const ProfileMenuItems = ({ menuItems, onItemPress, containerStyle }) => {
  const handleItemPress = (item) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  const renderMenuItem = (item, index) => {
    const isLastItem = index === menuItems.length - 1;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.menuItem,
          isLastItem && styles.lastMenuItem,
        ]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <Icon name={item.icon} size={24} color="#666" />
          <Text style={styles.menuItemText}>{item.title}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#CCC" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.menuSection, containerStyle]}>
      {menuItems.map((item, index) => renderMenuItem(item, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuSection: {
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
});

export default ProfileMenuItems;