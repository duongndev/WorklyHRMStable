import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import HeaderScreen from '../../../components/HeaderScreen';
import {getStatusText, getStatusColor} from '../../../utils/statusUtils';
import {formatDate, formatTime} from '../../../utils/formatDateTime';
import {useSelector, useDispatch} from 'react-redux';
import {clearError, clearMessage} from '../../../redux/leave/leaveSlice';
import {getLeaveRequestDetail, deleteLeaveRequest} from '../../../redux/leave/leaveAction';
import CustomButton from '../../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import LeaveRequestFormModal from '../../../components/LeaveRequest/LeaveRequestFormModal';
import CancelModalComponent from '../../../components/CancelModelComponent';

const LeaveRequestDetailScreen = ({route}) => {
  const {leaveRequest} = route.params;
  const dispatch = useDispatch();
  const {leaveDetail, loading, error} = useSelector(state => state.leave);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleCancel = async () => {
    try {
      const resultAction = await dispatch(deleteLeaveRequest(leaveRequest));
      if (deleteLeaveRequest.fulfilled.match(resultAction)) {
        console.log('Cancel leave request success');
        setCancelModalVisible(false);
        navigation.goBack();
      } else {
        console.error('Cancel leave request failed:', resultAction.payload?.message);
      }
    } catch (err) {
      console.error('Cancel leave request error:', err);
    }
  };

  useEffect(() => {
    const fetchLeaveRequestDetail = async () => {
      try {
        // Clear previous errors
        dispatch(clearError());
        dispatch(clearMessage());

        console.log('Fetching leave request detail for ID:', leaveRequest);
        const resultAction = await dispatch(
          getLeaveRequestDetail(leaveRequest),
        );

        if (getLeaveRequestDetail.fulfilled.match(resultAction)) {
          console.log('Fetch leave request detail successful');
        } else if (getLeaveRequestDetail.rejected.match(resultAction)) {
          console.error(
            'Fetch leave request detail failed:',
            resultAction.payload?.message,
          );
        }
      } catch (err) {
        console.error('Fetch leave request detail error:', err);
      }
    };
    fetchLeaveRequestDetail();
  }, [dispatch, leaveRequest]);

  const renderLeaveDurationType = type => {
    switch (type) {
      case 'full_day':
        return 'Cả ngày';
      case 'half_day':
        return 'Nửa ngày';
      case 'time_based':
        return 'Theo thời gian';
      default:
        return '';
    }
  };

  const renderView = () => {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin yêu cầu</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Họ và tên:</Text>
              <Text style={styles.value}>{leaveDetail.userId?.fullName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Phòng ban:</Text>
              <Text style={styles.value}>{leaveDetail.userId?.department}</Text>
              <Text style={styles.label}>Chức vụ:</Text>
              <Text style={styles.value}>{leaveDetail.userId?.position}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Loại nghỉ phép:</Text>
              <Text style={styles.value}>{leaveDetail.leaveType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Hình thức nghỉ:</Text>
              <Text style={styles.value}>
                {renderLeaveDurationType(leaveDetail.leaveDurationType)}
              </Text>
            </View>

            {leaveDetail.leaveDurationType === 'time_based' && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Từ giờ:</Text>
                <Text style={styles.value}>{leaveDetail.startTime}</Text>
                <Text style={styles.label}>Đến giờ:</Text>
                <Text style={styles.value}>{leaveDetail.endTime}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.label}>Từ ngày:</Text>
              <Text style={styles.value}>
                {formatDate(leaveDetail.startDate)}
              </Text>
              <Text style={styles.label}>Đến ngày:</Text>
              <Text style={styles.value}>
                {formatDate(leaveDetail.endDate)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Ngày tạo đơn:</Text>
              <Text style={styles.value}>
                {formatDate(leaveDetail.createdAt)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Trạng thái:</Text>
              <Text style={[styles.value, getStatusColor(leaveDetail.status)]}>
                {getStatusText(leaveDetail.status)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Lý do xin nghỉ:</Text>
              <Text style={styles.value}>{leaveDetail.reason}</Text>
            </View>

            {leaveDetail.approverBy && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Người phê duyệt:</Text>
                <Text style={styles.value}>
                  {leaveDetail.approverBy?.fullName}
                </Text>
              </View>
            )}

            {leaveDetail.approveAt && (
              <View style={styles.detailColumn}>
                <Text style={styles.label}>Thời gian phê duyệt:</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Ngày:</Text>
                  <Text style={styles.value}>
                    {formatDate(leaveDetail.approveAt)}
                  </Text>
                  <Text style={styles.label}>Giờ:</Text>
                  <Text style={styles.value}>
                    {formatTime(leaveDetail.approveAt)}
                  </Text>
                </View>
              </View>
            )}
            {leaveDetail.note && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Ghi chú:</Text>
                <Text style={styles.value}>{leaveDetail.note}</Text>
              </View>
            )}
          </View>
          {leaveDetail.status === 'pending' && (
            <View style={styles.cardButton}>
              <CustomButton
                title="Hủy"
                style={styles.button}
                onPress={() => {
                  setCancelModalVisible(true);
                }}
              />
              <CustomButton
                title="Cập nhật"
                style={styles.button}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
          )}

          <LeaveRequestFormModal
            isModalVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
            leaveRequest={leaveDetail}
            onSubmit={() => {
              setModalVisible(false);
            }}
          />
          <CancelModalComponent
            title="Hủy yêu cầu nghỉ phép"
            message="Bạn có chắc chắn muốn hủy yêu cầu nghỉ phép?"
            isVisible={isCancelModalVisible}
            onCancel={() => setCancelModalVisible(false)}
            onConfirm={() => {
              handleCancel(leaveDetail._id);
              setCancelModalVisible(false);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <>
      <HeaderScreen title="Chi tiết yêu cầu nghỉ phép" />
      <StatusBar translucent backgroundColor="transparent" barStyle="default" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : leaveDetail ? (
        renderView()
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Không tìm thấy thông tin yêu cầu nghỉ phép
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: '',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    padding: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  detailColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
  },
  cardButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    paddingBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default LeaveRequestDetailScreen;
