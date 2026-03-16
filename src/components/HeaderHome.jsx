import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {logoutUser} from '../redux/auth/authSlice';

const HeaderHome = ({username, onNotificationPress, unreadCount = 0}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };
  
  const handleLogout = async () => {
    Alert.alert('Thông báo', 'Bạn có chắc chắn muốn đăng xuất không?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          const resultAction = await dispatch(logoutUser());

          if (logoutUser.fulfilled.match(resultAction)) {
            console.log('Logout successful:', resultAction.payload.message);
            navigation.replace('LoginScreen');
          } else if (logoutUser.rejected.match(resultAction)) {
            console.error('Logout failed:', resultAction.payload?.message);
            // Vẫn navigate về login screen vì logout có thể fail nhưng vẫn cần đăng xuất
            navigation.replace('LoginScreen');
          }
        },
        style: 'destructive',
        isPreferred: true,
      },
    ]);
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcome}>Chào bạn,</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleNotificationPress}>
            <Icon name="notifications" size={24} color="#FFF" />
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}>
            <Icon name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HeaderHome;

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
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  welcome: {
    color: '#fff',
    fontSize: 16,
    marginTop: 25,
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  logoutButton: {
    padding: 4,
  },
  badgeContainer: {
    position: 'absolute',
    left: 16,
    top: 2,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
