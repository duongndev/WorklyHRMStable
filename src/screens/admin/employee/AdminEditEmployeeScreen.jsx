import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderScreen from '../../../components/HeaderScreen';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import { updateEmployeeApi } from '../../../services/AdminApiService';

const AdminEditEmployeeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { employee } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: employee.fullName || '',
    email: employee.email || '',
    phone: employee.phone || '',
    dateOfBirth: employee.dateOfBirth || '',
    gender: employee.gender || '',
    address: employee.address || '',
    department: employee.department || '',
    position: employee.position || '',
    startDate: employee.startDate || '',
    salary: employee.salary ? employee.salary.toString() : '',
    contractType: employee.contractType || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Vui lòng nhập phòng ban';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Vui lòng nhập chức vụ';
    }

    if (formData.salary && isNaN(formData.salary)) {
      newErrors.salary = 'Lương phải là số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const employeeData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
      };

      const response = await updateEmployeeApi(employee.id, employeeData);
      if (response.success) {
        Alert.alert(
          'Thành công',
          'Cập nhật thông tin nhân viên thành công',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật thông tin nhân viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen 
        title="Chỉnh sửa nhân viên" 
        onBackPress={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Thông tin cá nhân */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <View style={styles.card}>
              <CustomTextInput
                label="Họ và tên *"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                error={errors.fullName}
                placeholder="Nhập họ và tên"
              />
              
              <CustomTextInput
                label="Email *"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                placeholder="Nhập email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <CustomTextInput
                label="Số điện thoại *"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                error={errors.phone}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
              
              <CustomTextInput
                label="Ngày sinh"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                placeholder="DD/MM/YYYY"
              />
              
              <CustomTextInput
                label="Giới tính"
                value={formData.gender}
                onChangeText={(value) => handleInputChange('gender', value)}
                placeholder="Nam/Nữ"
              />
              
              <CustomTextInput
                label="Địa chỉ"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Nhập địa chỉ"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Thông tin công việc */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin công việc</Text>
            <View style={styles.card}>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyLabel}>Mã nhân viên</Text>
                <Text style={styles.readOnlyValue}>{employee.employeeId}</Text>
              </View>
              
              <CustomTextInput
                label="Phòng ban *"
                value={formData.department}
                onChangeText={(value) => handleInputChange('department', value)}
                error={errors.department}
                placeholder="Nhập phòng ban"
              />
              
              <CustomTextInput
                label="Chức vụ *"
                value={formData.position}
                onChangeText={(value) => handleInputChange('position', value)}
                error={errors.position}
                placeholder="Nhập chức vụ"
              />
              
              <CustomTextInput
                label="Ngày vào làm"
                value={formData.startDate}
                onChangeText={(value) => handleInputChange('startDate', value)}
                placeholder="DD/MM/YYYY"
              />
              
              <CustomTextInput
                label="Lương cơ bản (VNĐ)"
                value={formData.salary}
                onChangeText={(value) => handleInputChange('salary', value)}
                error={errors.salary}
                placeholder="Nhập lương cơ bản"
                keyboardType="numeric"
              />
              
              <CustomTextInput
                label="Loại hợp đồng"
                value={formData.contractType}
                onChangeText={(value) => handleInputChange('contractType', value)}
                placeholder="Thử việc/Chính thức/Thời vụ"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cập nhật thông tin"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminEditEmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  readOnlyField: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  readOnlyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  readOnlyValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
});