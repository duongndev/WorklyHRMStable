import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import HeaderScreen from '../../../components/HeaderScreen';
import {useSelector, useDispatch} from 'react-redux';
import {
  clearError,
  clearMessage,
} from '../../../redux/notification/notifiSlice';
import {getMyNotifications} from '../../../redux/notification/notificationAction';
import moment from 'moment';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const notifiList = useSelector(state => state.notification.notifiList);
  const isLoading = useSelector(state => state.notification.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyNotification = async () => {
      const resultAction = await dispatch(getMyNotifications());

      if (getMyNotifications.rejected.match(resultAction)) {
        console.error(
          'Failed to fetch notifications:',
          resultAction.payload?.message,
        );
      }
    };
    fetchMyNotification();
  }, [dispatch]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const resultAction = await dispatch(getMyNotifications());

      if (getMyNotifications.rejected.match(resultAction)) {
        console.error(
          'Failed to refresh notifications:',
          resultAction.payload?.message,
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  const markAsRead = id => {
    setNotifications(
      notifications.map(notif =>
        notif.id === id ? {...notif, read: true} : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({...notif, read: true})));
  };

  const renderNotificationItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.isRead ? styles.readNotification : {},
      ]}
      onPress={() => markAsRead(item._id)}>
      <Text
        style={[styles.notificationTitle, item.read ? styles.readText : {}]}>
        {item.title}
      </Text>
      <Text
        style={[styles.notificationMessage, item.read ? styles.readText : {}]}>
        {item.content}
      </Text>
      <Text style={[styles.notificationDate, item.read ? styles.readText : {}]}>
        {moment(item.createdAt).locale('vi').format('dddd, DD/MM/YYYY HH:mm')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Thông báo" />
      <View style={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingIndicatorContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Đang tải thông báo...</Text>
          </View>
        ) : notifiList.length > 0 ? (
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={markAllAsRead}>
                <Text style={styles.buttonText}>Đánh dấu tất cả đã đọc</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={notifiList}
              renderItem={renderNotificationItem}
              keyExtractor={item => item._id}
              style={styles.list}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              removeClippedSubviews={false}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn không có thông báo nào.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  loadingIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginRight: 15,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  readNotification: {
    backgroundColor: '#e0e0e0',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  readText: {
    color: '#777',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default NotificationScreen;
