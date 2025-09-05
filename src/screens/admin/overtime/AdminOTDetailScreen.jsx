import React, { useEffect, useState } from 'react';
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
import { getStatusText } from '../../../utils/statusUtils';
import { formatDate, formatTime } from '../../../utils/formatDateTime';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearError,
  clearMessage,
  resetOvertimeDetail,
} from '../../../redux/overtime/overtimeSlice';
import {
  getOTDetail,
  updateStatusOT,
} from '../../../redux/overtime/overtimeAction';
import CustomButton from '../../../components/CustomButton';
import AdminOTModal from '../../../screens/admin/overtime/AdminOTModal';

const OvertimeRequestDetailScreen = ({ route }) => {
  const { overtimeRequest } = route.params;
  const dispatch = useDispatch();
  const overtimeDetail = useSelector(state => state.overtime.overtimeDetail);
  const loading = useSelector(state => state.overtime.loading);
  const [isModalVisible, setModalVisible] = useState(false);
  const [titleButton, setTitleButton] = useState('');

  useEffect(() => {
    const fetchOvertimeRequestDetail = async () => {
      const resultAction = await dispatch(getOTDetail(overtimeRequest._id));

      if (getOTDetail.rejected.match(resultAction)) {
        console.error('Failed to fetch overtime detail:', resultAction.payload?.message);
      }
    };

    fetchOvertimeRequestDetail();
  }, [dispatch, overtimeRequest._id]);

  const handleSubmit = async (data) => {
    console.log('id:', overtimeRequest._id, 'data', data);
    const resultAction = await dispatch(updateStatusOT({
      overtimeId: overtimeRequest._id,
      status: data.status,
      note: data.reason,
    }));

    if (updateStatusOT.fulfilled.match(resultAction)) {
      console.log('Status updated successfully:', resultAction.payload.message);
      // Refresh the detail
      dispatch(getOTDetail(overtimeRequest._id));
    } else if (updateStatusOT.rejected.match(resultAction)) {
      console.error('Failed to update status:', resultAction.payload?.message);
    }
    setModalVisible(false);
  };

  const handleApprove = async () => {
    const resultAction = await dispatch(updateStatusOT({
      overtimeId: overtimeRequest._id,
      status: 'approved',
      note: '',
    }));

    if (updateStatusOT.fulfilled.match(resultAction)) {
      console.log('Status approved successfully:', resultAction.payload.message);
      // Refresh the detail
      dispatch(getOTDetail(overtimeRequest._id));
    } else if (updateStatusOT.rejected.match(resultAction)) {
      console.error('Failed to approve status:', resultAction.payload?.message);
    }
  };


  const renderDetail = () => {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin yêu cầu OT</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Họ và tên:</Text>
              <Text style={styles.value}>
                {overtimeDetail.userId?.fullName}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Ngày:</Text>
              <Text style={styles.value}>
                {formatDate(overtimeDetail.otDate)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Giờ bắt đầu:</Text>
              <Text style={styles.value}>{overtimeDetail.startTime}</Text>
              <Text style={styles.label}>Giờ kết thúc:</Text>
              <Text style={styles.value}>{overtimeDetail.endTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Tổng số giờ:</Text>
              <Text style={styles.value}>{overtimeDetail.hoursWork}h</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Dự án:</Text>
              <Text style={styles.value}>{overtimeDetail.project}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Lý do:</Text>
              <Text style={styles.value}>{overtimeDetail.reason}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Trạng thái:</Text>
              <Text style={styles.value}>
                {getStatusText(overtimeDetail.status)}
              </Text>
            </View>

            {overtimeDetail.approverBy && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Người phê duyệt:</Text>
                <Text style={styles.value}>
                  {overtimeDetail.approverBy?.fullName}
                </Text>
              </View>
            )}

            {overtimeDetail.approverAt && (
              <View style={styles.detailColumn}>
                <Text style={styles.label}>Thời gian phê duyệt:</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Ngày:</Text>
                  <Text style={styles.value}>
                    {formatDate(overtimeDetail.approverAt)}
                  </Text>
                  <Text style={styles.label}>Giờ:</Text>
                  <Text style={styles.value}>
                    {formatTime(overtimeDetail.approverAt)}
                  </Text>
                </View>
              </View>
            )}
            {overtimeDetail.note && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Ghi chú:</Text>
                <Text style={styles.value}>{overtimeDetail.note}</Text>
              </View>
            )}
          </View>

          {overtimeDetail.status === 'pending' && (
            <View style={styles.cardButton}>
              <CustomButton
                title="Từ chối"
                style={styles.rejectButton}
                onPress={() => {
                  setModalVisible(true);
                  setTitleButton('Từ chối');
                }}
              />
              <CustomButton
                title="Phê duyệt"
                style={styles.approveButton}
                onPress={handleApprove}
              />
            </View>
          )}
        </ScrollView>

        <AdminOTModal
          isModalVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          titleButton={titleButton}
          onSubmit={handleSubmit}
        />

      </SafeAreaView>
    );
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="default" />
      <HeaderScreen title="Chi tiết yêu cầu OT" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        renderDetail()
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
    textAlign: 'right',
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
    marginTop: 15,
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
  approveButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#F44336',
  },
});

export default OvertimeRequestDetailScreen;
