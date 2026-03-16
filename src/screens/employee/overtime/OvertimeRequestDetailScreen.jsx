import React, { useEffect, useMemo, useState } from 'react';
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
import { Provider, ReactReduxContext, useSelector, useDispatch } from 'react-redux';
import {
  getOvertimeRequestDetail,
  updateOvertimeRequest,
  cancelOvertimeRequest,
} from '../../../redux/overtime/overtimeAction';
import CustomButton from '../../../components/CustomButton';
import OvertimeRequestFormModal from '../../../components/OvertimeRequest/OvertimeRequestFormModal';
import { useNavigation } from '@react-navigation/native';
import CancelModalComponent from '../../../components/CancelModelComponent';
import { store } from '../../../redux/store';

const OvertimeRequestDetailScreenInner = ({ route }) => {
  const navigation = useNavigation();
  const overtimeRequest = route?.params?.overtimeRequest;
  const dispatch = useDispatch();
  const overtimeDetail = useSelector(state => state.overtime.overtimeDetail);
  const loading = useSelector(state => state.overtime.loading);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);

  const overtimeRequestId = overtimeRequest?._id;

  useEffect(() => {
    if (!overtimeRequestId) {
      return;
    }
    const fetchOvertimeRequestDetail = async () => {
      const resultAction = await dispatch(
        getOvertimeRequestDetail(overtimeRequestId),
      );

      if (getOvertimeRequestDetail.rejected.match(resultAction)) {
        console.error(
          'Failed to fetch overtime detail:',
          resultAction.payload?.message,
        );
      }
    };

    fetchOvertimeRequestDetail();
  }, [dispatch, overtimeRequestId]);

  const handleSubmit = async (id, overtimeRequestUpdate) => {
    const resultAction = await dispatch(
      updateOvertimeRequest({
        overtimeId: id,
        overtimeData: overtimeRequestUpdate,
      }),
    );

    if (updateOvertimeRequest.fulfilled.match(resultAction)) {
      console.log(
        'Overtime request updated successfully:',
        resultAction.payload.message,
      );
      // Refresh the detail
      if (overtimeRequestId) {
        dispatch(getOvertimeRequestDetail(overtimeRequestId));
      }
    } else if (updateOvertimeRequest.rejected.match(resultAction)) {
      console.error(
        'Failed to update overtime request:',
        resultAction.payload?.message,
      );
    }
    setModalVisible(false);
  };

  const handleCancel = async (id) => {
    const resultAction = await dispatch(cancelOvertimeRequest(id));
    console.log(resultAction);

    if (cancelOvertimeRequest.fulfilled.match(resultAction)) {
      console.log(
        'Overtime request cancelled successfully:',
        resultAction.payload.message,
      );
      // dispatch(resetOvertimeList());
      navigation.goBack();
    } else if (cancelOvertimeRequest.rejected.match(resultAction)) {
      console.log(
        'Failed to cancel overtime request:',
        resultAction.payload?.message,
      );
    }
    // navigation.goBack();
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
              <View style={styles.timeSeparator} />
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
        </ScrollView>

        <OvertimeRequestFormModal
          isModalVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          overtimeRequest={overtimeRequest}
          onSubmit={handleSubmit}
        />
        <CancelModalComponent
          title="Hủy yêu cầu OT"
          message="Bạn có chắc chắn muốn hủy yêu cầu OT?"
          isVisible={isCancelModalVisible}
          onCancel={() => setCancelModalVisible(false)}
          onConfirm={() => {
            if (overtimeDetail?._id) {
              handleCancel(overtimeDetail._id);
            }
            setCancelModalVisible(false);
          }}
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

const OvertimeRequestDetailScreen = (props) => {
  const reduxContext = React.useContext(ReactReduxContext);
  const hasStore = Boolean(reduxContext && reduxContext.store);
  const content = useMemo(() => <OvertimeRequestDetailScreenInner {...props} />, [props]);

  if (hasStore) {
    return content;
  }

  return <Provider store={store}>{content}</Provider>;
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
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeSeparator: {
    width: 16,
  },
});

export default OvertimeRequestDetailScreen;
