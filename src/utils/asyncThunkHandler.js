import {Alert} from 'react-native';

/**
 * Utility class để xử lý các async thunk responses một cách consistent
 */
export class AsyncThunkHandler {
  /**
   * Xử lý kết quả của async thunk với error handling
   * @param {Object} resultAction - Kết quả từ dispatch async thunk
   * @param {Object} thunkAction - Async thunk action (để check fulfilled/rejected)
   * @param {Object} options - Tùy chọn xử lý
   * @param {string} options.successMessage - Thông báo khi thành công
   * @param {string} options.errorMessage - Thông báo lỗi mặc định
   * @param {Function} options.onSuccess - Callback khi thành công
   * @param {Function} options.onError - Callback khi có lỗi
   * @param {boolean} options.showSuccessAlert - Có hiển thị alert thành công không (default: false)
   * @param {boolean} options.showErrorAlert - Có hiển thị alert lỗi không (default: true)
   * @param {boolean} options.logResult - Có log kết quả không (default: true)
   * @returns {boolean} - true nếu thành công, false nếu thất bại
   */
  static async handle(resultAction, thunkAction, options = {}) {
    const {
      successMessage = 'Thao tác thành công',
      errorMessage = 'Có lỗi xảy ra',
      onSuccess,
      onError,
      showSuccessAlert = false,
      showErrorAlert = true,
      logResult = true,
    } = options;

    if (thunkAction.fulfilled.match(resultAction)) {
      if (logResult) {
        console.log(
          'AsyncThunk success:',
          resultAction.payload?.message || successMessage,
        );
      }

      if (showSuccessAlert) {
        Alert.alert(
          'Thành công',
          resultAction.payload?.message || successMessage,
        );
      }

      if (onSuccess) {
        await onSuccess(resultAction.payload);
      }

      return true;
    } else if (thunkAction.rejected.match(resultAction)) {
      const error = resultAction.payload?.message || errorMessage;

      if (logResult) {
        console.error('AsyncThunk error:', error);
      }

      if (showErrorAlert) {
        Alert.alert('Lỗi', error);
      }

      if (onError) {
        await onError(resultAction.payload);
      }

      return false;
    }

    return false;
  }

  /**
   * Xử lý async thunk với loading state
   * @param {Function} asyncThunk - Async thunk function
   * @param {Function} setLoading - Function để set loading state
   * @param {Object} options - Tùy chọn (giống như handle method)
   * @returns {boolean} - true nếu thành công, false nếu thất bại
   */
  static async handleWithLoading(asyncThunk, setLoading, options = {}) {
    try {
      setLoading(true);
      const result = await asyncThunk();
      return result;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Wrapper cho việc dispatch async thunk với error handling
   * @param {Function} dispatch - Redux dispatch function
   * @param {Function} thunkAction - Async thunk action creator
   * @param {*} payload - Payload cho thunk action
   * @param {Object} options - Tùy chọn xử lý
   * @returns {boolean} - true nếu thành công, false nếu thất bại
   */
  static async dispatch(dispatch, thunkAction, payload, options = {}) {
    const resultAction = await dispatch(thunkAction(payload));
    return this.handle(resultAction, thunkAction, options);
  }

  /**
   * Batch xử lý nhiều async thunks
   * @param {Array} thunks - Array of {dispatch, thunkAction, payload, options}
   * @returns {Array} - Array of results
   */
  static async batchHandle(thunks) {
    const results = [];

    for (const thunk of thunks) {
      const {dispatch, thunkAction, payload, options = {}} = thunk;
      const result = await this.dispatch(
        dispatch,
        thunkAction,
        payload,
        options,
      );
      results.push(result);

      // Nếu có lỗi và stopOnError = true, dừng lại
      if (!result && options.stopOnError) {
        break;
      }
    }

    return results;
  }
}

/**
 * Shorthand functions cho các use cases phổ biến
 */

// Xử lý fetch data
export const handleFetch = (resultAction, thunkAction, options = {}) => {
  return AsyncThunkHandler.handle(resultAction, thunkAction, {
    successMessage: 'Tải dữ liệu thành công',
    errorMessage: 'Không thể tải dữ liệu',
    showSuccessAlert: false,
    ...options,
  });
};

// Xử lý create/update operations
export const handleMutation = (resultAction, thunkAction, options = {}) => {
  return AsyncThunkHandler.handle(resultAction, thunkAction, {
    successMessage: 'Lưu thành công',
    errorMessage: 'Không thể lưu dữ liệu',
    showSuccessAlert: true,
    ...options,
  });
};

// Xử lý delete operations
export const handleDelete = (resultAction, thunkAction, options = {}) => {
  return AsyncThunkHandler.handle(resultAction, thunkAction, {
    successMessage: 'Xóa thành công',
    errorMessage: 'Không thể xóa',
    showSuccessAlert: true,
    ...options,
  });
};

export default AsyncThunkHandler;
