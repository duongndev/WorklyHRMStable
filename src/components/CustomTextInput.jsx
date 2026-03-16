import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  placeholderTextColor,
  style,
  textArea,
  onPress,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.formGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          style,
          secureTextEntry && styles.passwordInputContainer,
        ]}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onPress={onPress}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry && !showPassword}
          placeholderTextColor={placeholderTextColor}
          style={[
            styles.input,
            textArea && styles.textArea,
            secureTextEntry && styles.passwordInput,
          ]}
          multiline={textArea}
          numberOfLines={textArea ? 4 : 1}
          textAlignVertical={textArea ? 'top' : 'center'}
          editable={!disabled}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
  },
  textArea: {
    height: 100,
  },
  passwordInputContainer: {
    // No specific styles needed here, mainly for identifying password input
  },
  passwordInput: {
    // No specific styles needed here, flex: 1 handles width
  },
  eyeIcon: {
    padding: 12,
  },
});

export default CustomTextInput;
