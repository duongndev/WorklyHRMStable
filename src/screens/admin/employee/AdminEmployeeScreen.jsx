import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from '../../../components/HeaderScreen';
import ViewEmptyComponent from '../../../components/ViewEmptyComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../../redux/employee/employeeAction';

const AdminEmployeeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector(state => state.employee);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchText, employees]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchEmployees()).then(() => setRefreshing(false));
  };

  const handleEmployeePress = (employee) => {
    navigation.navigate('AdminEmployeeDetailScreen', { employee });
  };

  const handleAddEmployee = () => {
    navigation.navigate('AdminAddEmployeeScreen');
  };

  const renderEmployeeItem = ({ item }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return '#4CAF50';
        case 'inactive': return '#F44336';
        case 'suspended': return '#FF9800';
        default: return '#666';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'active': return 'Hoạt động';
        case 'inactive': return 'Không hoạt động';
        case 'suspended': return 'Tạm dừng';
        default: return status;
      }
    };

    return (
      <TouchableOpacity
        style={styles.employeeItem}
        onPress={() => handleEmployeePress(item)}
      >
        <View style={styles.employeeInfo}>
          <View style={styles.employeeHeader}>
            <Text style={styles.employeeName}>{item.fullName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
          <Text style={styles.employeeId}>ID: {item.employeeId}</Text>
          <Text style={styles.employeeEmail}>{item.email}</Text>
          <Text style={styles.employeeDepartment}>{item.department} - {item.position}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Quản lý nhân viên"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleAddEmployee}>
            <Icon name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm nhân viên..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {loading && employees.length === 0 ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : error ? (
          <ViewEmptyComponent
            title="Lỗi tải dữ liệu"
            description={error.message || "Không thể tải danh sách nhân viên."}
          />
        ) : (
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item) => item._id.toString()} // Assuming _id is the unique key
            renderItem={renderEmployeeItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <ViewEmptyComponent
                title="Không có nhân viên nào"
                description="Chưa có nhân viên nào trong hệ thống"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminEmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  employeeId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  employeeEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  employeeDepartment: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});