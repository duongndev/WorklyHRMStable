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
import { useNavigation } from '@react-navigation/native';
import HeaderScreen from '../../../components/HeaderScreen';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import { createEmployeeApi } from '../../../services/AdminApiService';

const AdminAddEmployeeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    department: '',
    position: '',
    startDate: '',
    salary: '',
    contractType: '',
    employeeId: '',
    password: '',
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

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Vui lòng nhập mã nhân viên';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
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

      const response = await createEmployeeApi(employeeData);
      if (response.success) {
        Alert.alert(
          'Thành công',
          'Tạo nhân viên mới thành công',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể tạo nhân viên mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen 
        title="Thêm nhân viên" 
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
              <CustomTextInput
                label="Mã nhân viên *"
                value={formData.employeeId}
                onChangeText={(value) => handleInputChange('employeeId', value)}
                error={errors.employeeId}
                placeholder="Nhập mã nhân viên"
              />
              
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

          {/* Thông tin tài khoản */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            <View style={styles.card}>
              <CustomTextInput
                label="Mật khẩu *"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                error={errors.password}
                placeholder="Nhập mật khẩu"
                secureTextEntry
              />
              
              <Text style={styles.noteText}>
                * Mật khẩu mặc định sẽ được gửi đến email của nhân viên
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Tạo nhân viên"
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

export default AdminAddEmployeeScreen;

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
  noteText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
});