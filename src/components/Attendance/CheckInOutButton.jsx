import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Component button cho check in/out
 * @param {Object} props
 * @param {boolean} props.isCheckedIn - Trạng thái đã check in hay chưa
 * @param {boolean} props.loading - Trạng thái loading
 * @param {Function} props.onCheckIn - Callback khi check in
 * @param {Function} props.onCheckOut - Callback khi check out
 * @param {Object} props.style - Custom style cho button
 * @param {boolean} props.disabled - Disable button
 */
const CheckInOutButton = ({
  isCheckedIn,
  loading,
  onCheckIn,
  onCheckOut,
  style,
  disabled = false,
}) => {
  const handlePress = () => {
    if (loading || disabled) return;
    
    if (isCheckedIn) {
      onCheckOut && onCheckOut();
    } else {
      onCheckIn && onCheckIn();
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.checkButton];
    
    if (isCheckedIn) {
      baseStyle.push(styles.checkOutButton);
    } else {
      baseStyle.push(styles.checkInButton);
    }
    
    if (loading || disabled) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getButtonText = () => {
    if (loading) return 'Đang xử lý...';
    return isCheckedIn ? 'Check Out' : 'Check In';
  };

  const getIconName = () => {
    return isCheckedIn ? 'logout' : 'login';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Icon
          name={getIconName()}
          size={24}
          color="#FFFFFF"
        />
      )}
      <Text style={styles.checkButtonText}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  checkInButton: {
    backgroundColor: '#2196F3',
  },
  checkOutButton: {
    backgroundColor: '#F44336',
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CheckInOutButton;