import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, clearMessage } from '../../../redux/auth/authSlice';
import { logoutUser } from '../../../redux/auth/authSlice';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    {
      id: 1,
      title: 'Thông tin cá nhân',
      icon: 'account',
      screen: 'PersonalInfo',
    },
    {
      id: 2,
      title: 'Đổi mật khẩu',
      icon: 'lock',
      screen: 'ChangePassword',
    },
    {
      id: 3,
      title: 'Cài đặt thông báo',
      icon: 'bell',
      screen: 'NotificationSettings',
    },
    {
      id: 4,
      title: 'Ngôn ngữ',
      icon: 'translate',
      screen: 'Language',
    },
    {
      id: 5,
      title: 'Đăng xuất',
      icon: 'logout',
      screen: 'Logout',
    },
  ];

  const handleLogout = async () => {
    // khi bấm đăng xuất thì hiển thị  confirm, nếu nhấn đăng xuất thì loading, sau 3 giây thì ẩn
    Alert.alert('Thông báo', 'Bạn có chắc chắn muốn đăng xuất không?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          setIsLoading(true);
          const resultAction = await dispatch(logoutUser());

          if (logoutUser.fulfilled.match(resultAction)) {
            console.log('Logout successful:', resultAction.payload.message);
            navigation.replace('LoginScreen');
          } else if (logoutUser.rejected.match(resultAction)) {
            console.error('Logout failed:', resultAction.payload?.message);
            // Vẫn navigate về login screen vì logout có thể fail nhưng vẫn cần đăng xuất
            navigation.replace('LoginScreen');
          }
          setIsLoading(false);
        },
        style: 'destructive',
        isPreferred: true,
      },
    ]);
  };

  // Loại bỏ setTimeout không cần thiết - loading state sẽ được quản lý bởi async operations


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://placehold.co/600x400',
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.department}>{user?.department}</Text>
        <Text style={styles.position}>{user?.position}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => {
              if (item.screen === 'Logout') {
                handleLogout();
              } else {
                navigation.navigate(item.screen);
              }
            }}>
            <View style={styles.menuItemLeft}>
              <Icon name={item.icon} size={24} color="#2196F3" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Phiên bản 1.0.0</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  department: {
    fontSize: 16,
    color: '#888',
  },
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  appInfo: {
    padding: 16,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
