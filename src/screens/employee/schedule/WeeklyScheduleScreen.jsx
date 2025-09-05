import React, {useEffect} from 'react';
import moment from 'moment';
import {getMyWeekSchedulesApi} from '../../../services/ApiService';
import HeaderScreen from '../../../components/HeaderScreen';
import ScheduleCard from '../../../components/WorkSchedule/ScheduleCard';
import {useSelector, useDispatch} from 'react-redux';
import {clearError, clearMessage} from '../../../redux/schedule/scheduleSlice';
import {getMySchedulesWeek} from '../../../redux/schedule/scheduleAction';

const WeeklyScheduleScreen = () => {
  const weeklySchedules = useSelector(state => state.schedule.schedules);
  const dispatch = useDispatch();

  // format moment to Vietnamese local
  moment.updateLocale('vi', {
    months: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
    weekdays: [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
    ],
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY HH:mm',
      LLLL: 'dddd, D MMMM YYYY HH:mm',
    },
  });
  moment.locale('vi');

  useEffect(() => {
    const fetchWeekSchedule = async () => {
      const resultAction = await dispatch(getMySchedulesWeek());

      if (getMySchedulesWeek.fulfilled.match(resultAction)) {
        console.log(
          'Weekly schedules fetched successfully:',
          JSON.stringify(resultAction.payload),
        );
      } else if (getMySchedulesWeek.rejected.match(resultAction)) {
        console.error(
          'Failed to fetch weekly schedules:',
          resultAction.payload?.message,
        );
      }
    };
    fetchWeekSchedule();
  }, [dispatch]);

  return (
    <>
      <HeaderScreen title={'Lịch làm việc'} />
      <ScheduleCard schedules={weeklySchedules} />
    </>
  );
};

export default WeeklyScheduleScreen;
