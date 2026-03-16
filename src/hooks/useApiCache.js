import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import cacheManager, { CACHE_TTL } from '../utils/cacheManager';

/**
 * Custom hook để quản lý API calls với caching
 * Tránh gọi API liên tục và cải thiện performance
 */
export const useApiCache = ({
  asyncThunk,
  params = {},
  dependencies = [],
  ttl = CACHE_TTL.MEDIUM,
  enabled = true,
  skipCache = false,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const hasFetched = useRef(false);
  const lastParams = useRef(null);

  const paramsKey = useMemo(() => JSON.stringify(params), [params]);
  const dependenciesKey = useMemo(
    () => JSON.stringify(dependencies),
    [dependencies],
  );

  const cacheKey = useMemo(
    () => cacheManager.createKey(asyncThunk.typePrefix, params),
    [asyncThunk.typePrefix, params],
  );

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Kiểm tra cache trước nếu không force refresh
      if (!forceRefresh && !skipCache) {
        const cachedData = cacheManager.get(cacheKey);
        if (cachedData) {
          console.log(`Cache hit for ${asyncThunk.typePrefix}`);
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      console.log(`Fetching data for ${asyncThunk.typePrefix}`);
      const resultAction = await dispatch(asyncThunk(params));

      if (asyncThunk.fulfilled.match(resultAction)) {
        const responseData = resultAction.payload;
        setData(responseData);
        
        // Cache successful response
        if (!skipCache) {
          cacheManager.set(cacheKey, responseData, ttl);
        }
        
        return responseData;
      } else if (asyncThunk.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload?.message || 'API call failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error(`Error fetching ${asyncThunk.typePrefix}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncThunk, cacheKey, dispatch, params, skipCache, ttl]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchData();
    hasFetched.current = true;
    lastParams.current = params;
  }, [dependenciesKey, enabled, fetchData, params, paramsKey]);

  // Refresh function
  const refresh = () => fetchData(true);

  // Invalidate cache
  const invalidateCache = () => {
    cacheManager.delete(cacheKey);
  };

  return {
    data,
    loading,
    error,
    refresh,
    invalidateCache,
    fetchData,
  };
};

/**
 * Hook đặc biệt cho HomeScreen để tránh gọi API liên tục
 */
export const useHomeScreenData = () => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  const initializeHomeData = useCallback(async () => {
    if (initialized) return;

    try {
      // Chỉ fetch nếu chưa có trong cache
      const dailyScheduleKey = cacheManager.createKey('schedule/getDailySchedules');
      const notificationCountKey = cacheManager.createKey('notification/getUnreadNotificationCount');

      const promises = [];

      if (!cacheManager.has(dailyScheduleKey)) {
        promises.push(
          dispatch({ type: 'schedule/getDailySchedules' })
        );
      }

      if (!cacheManager.has(notificationCountKey)) {
        promises.push(
          dispatch({ type: 'notification/getUnreadNotificationCount' })
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      setInitialized(true);
    } catch (error) {
      console.error('Error initializing home screen data:', error);
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    initializeHomeData();
  }, [initializeHomeData]);

  return {
    initialized,
    refresh: () => {
      setInitialized(false);
      // Clear cache để force refresh
      cacheManager.invalidatePattern('schedule|notification');
      initializeHomeData();
    },
  };
};

/**
 * Hook để quản lý request list với caching
 */
export const useRequestListCache = ({
  fetchAction,
  selectedStatus = 'all',
  page = 1,
  limit = 10,
}) => {
  const cacheKey = cacheManager.createKey(fetchAction.typePrefix, {
    status: selectedStatus === 'all' ? '' : selectedStatus,
    page,
    limit,
  });

  return useApiCache({
    asyncThunk: fetchAction,
    params: {
      status: selectedStatus === 'all' ? '' : selectedStatus,
      page,
      limit,
    },
    dependencies: [selectedStatus, page],
    ttl: CACHE_TTL.SHORT, // Request lists cần fresh data hơn
  });
};

export default useApiCache;
