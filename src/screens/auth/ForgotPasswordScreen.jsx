import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Alert,
} from 'react-native';
import HeaderScreen from '../../components/HeaderScreen';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (!email) {
            Alert.alert('Lỗi', 'Vui lòng nhập email.');
            return;
        }
        // Logic để gửi yêu cầu đặt lại mật khẩu
        Alert.alert('Thành công', `Yêu cầu đặt lại mật khẩu đã được gửi đến ${email}.`);
        // Có thể điều hướng về màn hình đăng nhập hoặc màn hình xác nhận OTP
        // navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <HeaderScreen title="Quên mật khẩu" />
            <View style={styles.content}>
                <Text style={styles.instructionText}>
                    Vui lòng nhập địa chỉ email đã đăng ký của bạn để nhận liên kết đặt lại mật khẩu.
                </Text>
                <CustomTextInput
                    placeholder="Nhập email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <CustomButton title="Gửi yêu cầu" onPress={handleResetPassword} />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backToLoginText}>Quay lại Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    content: {
        padding: 16,
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    backToLoginText: {
        marginTop: 20,
        color: '#007BFF',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ForgotPasswordScreen;
