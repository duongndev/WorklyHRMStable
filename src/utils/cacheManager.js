/**
 * Cache Manager để tránh gọi API liên tục
 * Sử dụng memory cache với TTL (Time To Live)
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 phút
  }

  /**
   * Tạo cache key từ action type và params
   * @param {string} actionType - Redux action type
   * @param {Object} params - Parameters của API call
   * @returns {string} - Cache key
   */
  createKey(actionType, params = {}) {
    const paramString = JSON.stringify(params);
    return `${actionType}_${paramString}`;
  }

  /**
   * Lưu data vào cache
   * @param {string} key - Cache key
   * @param {*} data - Data cần cache
   * @param {number} ttl - Time to live (ms)
   */
  set(key, data, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now(),
    });
  }

  /**
   * Lấy data từ cache
   * @param {string} key - Cache key
   * @returns {*} - Cached data hoặc null nếu expired/không tồn tại
   */
  get(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Kiểm tra expiration
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Kiểm tra xem data có trong cache và còn valid không
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Xóa một cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Xóa tất cả cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Xóa cache đã expired
   */
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Lấy thông tin cache stats
   * @returns {Object} - Cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }

  /**
   * Invalidate cache theo pattern
   * @param {string} pattern - Pattern để match cache keys
   */
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
const cacheManager = new CacheManager();

// Auto cleanup mỗi 10 phút
setInterval(() => {
  cacheManager.cleanup();
}, 10 * 60 * 1000);

/**
 * Higher-order function để wrap async thunks với caching
 * @param {Function} asyncThunk - Redux async thunk
 * @param {Object} options - Cache options
 * @returns {Function} - Wrapped thunk
 */
export const withCache = (asyncThunk, options = {}) => {
  const {ttl = 5 * 60 * 1000, skipCache = false} = options;

  return params => async (dispatch, getState) => {
    if (skipCache) {
      return dispatch(asyncThunk(params));
    }

    const cacheKey = cacheManager.createKey(asyncThunk.typePrefix, params);
    const cachedData = cacheManager.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${asyncThunk.typePrefix}`);
      // Return cached data as fulfilled action
      return {
        type: asyncThunk.fulfilled.type,
        payload: cachedData,
        meta: {cached: true},
      };
    }

    console.log(`Cache miss for ${asyncThunk.typePrefix}, fetching...`);
    const result = await dispatch(asyncThunk(params));

    // Cache successful results
    if (result.type.endsWith('/fulfilled')) {
      cacheManager.set(cacheKey, result.payload, ttl);
    }

    return result;
  };
};

/**
 * Hook để sử dụng cache trong components
 */
export const useCache = () => {
  return {
    get: key => cacheManager.get(key),
    set: (key, data, ttl) => cacheManager.set(key, data, ttl),
    has: key => cacheManager.has(key),
    delete: key => cacheManager.delete(key),
    clear: () => cacheManager.clear(),
    invalidatePattern: pattern => cacheManager.invalidatePattern(pattern),
    getStats: () => cacheManager.getStats(),
  };
};

/**
 * Cache TTL constants
 */
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000, // 1 phút
  MEDIUM: 5 * 60 * 1000, // 5 phút
  LONG: 15 * 60 * 1000, // 15 phút
  VERY_LONG: 60 * 60 * 1000, // 1 giờ
};

export default cacheManager;
