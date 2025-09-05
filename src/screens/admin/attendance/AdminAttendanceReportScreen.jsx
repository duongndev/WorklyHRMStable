import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from '../../../components/HeaderScreen';
import CustomButton from '../../../components/CustomButton';
import { getAttendanceReportApi, exportAttendanceReportApi } from '../../../services/AdminApiService';
import { formatDateTime } from '../../../utils/formatDateTime';

const { width } = Dimensions.get('window');

const AdminAttendanceReportScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const periodOptions = [
    { label: 'Tháng này', value: 'thisMonth' },
    { label: 'Tháng trước', value: 'lastMonth' },
    { label: 'Quý này', value: 'thisQuarter' },
    { label: 'Năm này', value: 'thisYear' },
  ];

  const departmentOptions = [
    { label: 'Tất cả phòng ban', value: 'all' },
    { label: 'Phòng IT', value: 'IT' },
    { label: 'Phòng HR', value: 'HR' },
    { label: 'Phòng Kế toán', value: 'Accounting' },
    { label: 'Phòng Marketing', value: 'Marketing' },
  ];

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, selectedDepartment]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceReportApi({
        period: selectedPeriod,
        department: selectedDepartment === 'all' ? '' : selectedDepartment,
      });
      
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải báo cáo chấm công');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    setLoading(true);
    try {
      const response = await exportAttendanceReportApi({
        period: selectedPeriod,
        department: selectedDepartment === 'all' ? '' : selectedDepartment,
        format: 'excel',
      });
      
      if (response.success) {
        Alert.alert('Thành công', 'Báo cáo đã được xuất thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xuất báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = '#007AFF' }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statHeader}>
          <Text style={styles.statTitle}>{title}</Text>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const FilterButton = ({ options, selectedValue, onValueChange, title }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterOption,
                selectedValue === option.value && styles.selectedFilterOption
              ]}
              onPress={() => onValueChange(option.value)}
            >
              <Text style={[
                styles.filterOptionText,
                selectedValue === option.value && styles.selectedFilterOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const ChartSection = ({ title, data }) => (
    <View style={styles.chartSection}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartItem}>
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill,
                  { 
                    height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                    backgroundColor: item.color || '#007AFF'
                  }
                ]}
              />
            </View>
            <Text style={styles.chartLabel}>{item.label}</Text>
            <Text style={styles.chartValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (!reportData) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderScreen 
          title="Báo cáo chấm công" 
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text>Đang tải báo cáo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen 
        title="Báo cáo chấm công" 
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleExportReport}>
            <Icon name="download-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <FilterButton
          title="Thời gian"
          options={periodOptions}
          selectedValue={selectedPeriod}
          onValueChange={setSelectedPeriod}
        />
        
        <FilterButton
          title="Phòng ban"
          options={departmentOptions}
          selectedValue={selectedDepartment}
          onValueChange={setSelectedDepartment}
        />

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng quan</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Tổng nhân viên"
              value={reportData.totalEmployees}
              icon="people-outline"
              color="#007AFF"
            />
            <StatCard
              title="Tỷ lệ chấm công"
              value={`${reportData.attendanceRate}%`}
              subtitle={`${reportData.totalAttendance}/${reportData.totalWorkingDays} ngày`}
              icon="checkmark-circle-outline"
              color="#4CAF50"
            />
            <StatCard
              title="Đi muộn"
              value={reportData.lateCount}
              subtitle={`${reportData.lateRate}% tổng số`}
              icon="time-outline"
              color="#FF9800"
            />
            <StatCard
              title="Vắng mặt"
              value={reportData.absentCount}
              subtitle={`${reportData.absentRate}% tổng số`}
              icon="close-circle-outline"
              color="#F44336"
            />
          </View>
        </View>

        {/* Charts */}
        <View style={styles.section}>
          <ChartSection
            title="Thống kê theo trạng thái"
            data={[
              { label: 'Đúng giờ', value: reportData.onTimeCount, color: '#4CAF50' },
              { label: 'Muộn', value: reportData.lateCount, color: '#FF9800' },
              { label: 'Sớm', value: reportData.earlyCount, color: '#2196F3' },
              { label: 'Vắng', value: reportData.absentCount, color: '#F44336' },
            ]}
          />
        </View>

        {/* Department Stats */}
        {reportData.departmentStats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thống kê theo phòng ban</Text>
            <View style={styles.departmentList}>
              {reportData.departmentStats.map((dept, index) => (
                <View key={index} style={styles.departmentItem}>
                  <View style={styles.departmentInfo}>
                    <Text style={styles.departmentName}>{dept.name}</Text>
                    <Text style={styles.departmentEmployees}>{dept.employeeCount} nhân viên</Text>
                  </View>
                  <View style={styles.departmentStats}>
                    <View style={styles.departmentStat}>
                      <Text style={styles.departmentStatValue}>{dept.attendanceRate}%</Text>
                      <Text style={styles.departmentStatLabel}>Chấm công</Text>
                    </View>
                    <View style={styles.departmentStat}>
                      <Text style={[styles.departmentStatValue, { color: '#FF9800' }]}>{dept.lateRate}%</Text>
                      <Text style={styles.departmentStatLabel}>Muộn</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Late Employees */}
        {reportData.topLateEmployees && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nhân viên đi muộn nhiều nhất</Text>
            <View style={styles.employeeList}>
              {reportData.topLateEmployees.map((employee, index) => (
                <View key={index} style={styles.employeeItem}>
                  <View style={styles.employeeRank}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{employee.fullName}</Text>
                    <Text style={styles.employeeId}>{employee.employeeId}</Text>
                  </View>
                  <View style={styles.employeeStats}>
                    <Text style={styles.lateCount}>{employee.lateCount} lần</Text>
                    <Text style={styles.lateAverage}>TB: {employee.averageLateMinutes}p</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Export Button */}
        <View style={styles.exportSection}>
          <CustomButton
            title="Xuất báo cáo Excel"
            onPress={handleExportReport}
            loading={loading}
            style={styles.exportButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminAttendanceReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    marginVertical: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFilterOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chartSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 30,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  departmentList: {
    gap: 8,
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  departmentEmployees: {
    fontSize: 12,
    color: '#666',
  },
  departmentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  departmentStat: {
    alignItems: 'center',
  },
  departmentStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  departmentStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  employeeList: {
    gap: 8,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  employeeRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  employeeId: {
    fontSize: 12,
    color: '#666',
  },
  employeeStats: {
    alignItems: 'flex-end',
  },
  lateCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
  },
  lateAverage: {
    fontSize: 12,
    color: '#666',
  },
  exportSection: {
    paddingVertical: 20,
  },
  exportButton: {
    backgroundColor: '#4CAF50',
  },
});