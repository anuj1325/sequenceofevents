// src/hooks/index.ts
/**
 * Custom React Hooks for Timeline Communication App
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { analyticsApi, draftsApi, eventsApi, userApi } from '../services/api';
import {
    AppSettings,
    DashboardStats,
    Event,
    LetterDraft,
    TimelineFilters
} from '../types';
import { eventUtils, storageUtils } from '../utils';

// Hook for managing events data
// Ensure this is the only declaration of useEvents in the file
export const useEvents = (initialFilters?: TimelineFilters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TimelineFilters>(initialFilters || {});

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.getEvents(filters);
      if (response.success) {
        setEvents(response.data);
      } else {
        setError(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create new event
  const createEvent = useCallback(async (eventData: Omit<Event, 'id'>) => {
    try {
      const response = await eventsApi.createEvent(eventData);
      if (response.success) {
        setEvents(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create event');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  }, []);

  // Update existing event
  const updateEvent = useCallback(async (id: number, updates: Partial<Event>) => {
    try {
      const response = await eventsApi.updateEvent(id, updates);
      if (response.success) {
        setEvents(prev => 
          prev.map(event => event.id === id ? response.data : event)
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (id: number) => {
    try {
      const response = await eventsApi.deleteEvent(id);
      if (response.success) {
        setEvents(prev => prev.filter(event => event.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TimelineFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get filtered events
  const filteredEvents = useMemo(() => {
    return eventUtils.filterEvents(events, filters);
  }, [events, filters]);

  // Fetch events when filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events: filteredEvents,
    allEvents: events,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents
  };
};

// Hook for managing dashboard statistics
export const useDashboardStats = (filters?: TimelineFilters) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsApi.getDashboardAnalytics(filters);
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
};

// Hook for managing user settings
export const useUserSettings = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getSettings();
      if (response.success) {
        setSettings(response.data);
        // Cache settings locally
        storageUtils.setItem('userSettings', response.data);
      } else {
        setError(response.message || 'Failed to fetch settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      // Try to load from local storage as fallback
      const cachedSettings = storageUtils.getItem<AppSettings | null>('userSettings', null);
      if (cachedSettings) {
        setSettings(cachedSettings);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    try {
      const response = await userApi.updateSettings(newSettings);
      if (response.success) {
        setSettings(response.data);
        storageUtils.setItem('userSettings', response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, updateSettings, refresh: fetchSettings };
};

// Hook for managing drafts
export const useDrafts = () => {
  const [drafts, setDrafts] = useState<LetterDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await draftsApi.getDrafts();
      if (response.success) {
        setDrafts(response.data);
      } else {
        setError(response.message || 'Failed to fetch drafts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drafts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDraft = useCallback(async (draftData: Omit<LetterDraft, 'id'>) => {
    try {
      const response = await draftsApi.createDraft(draftData);
      if (response.success) {
        setDrafts(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create draft');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create draft');
      throw err;
    }
  }, []);

  const updateDraft = useCallback(async (id: string, updates: Partial<LetterDraft>) => {
    try {
      const response = await draftsApi.updateDraft(id, updates);
      if (response.success) {
        setDrafts(prev => 
          prev.map(draft => draft.id === id ? response.data : draft)
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update draft');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update draft');
      throw err;
    }
  }, []);

  const deleteDraft = useCallback(async (id: string) => {
    try {
      const response = await draftsApi.deleteDraft(id);
      if (response.success) {
        setDrafts(prev => prev.filter(draft => draft.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete draft');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete draft');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  return {
    drafts,
    loading,
    error,
    createDraft,
    updateDraft,
    deleteDraft,
    refresh: fetchDrafts
  };
};

// Hook for local storage state management
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storageUtils.getItem(key, initialValue);
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageUtils.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Hook for debounced value
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for managing async operations
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error as E);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success'
  };
};

// Hook for managing previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Hook for managing intersection observer (for timeline animations)
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
};

// Hook for managing window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for managing keyboard shortcuts
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean } = {}
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { ctrlKey = false, altKey = false, shiftKey = false } = options;
      
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrlKey &&
        event.altKey === altKey &&
        event.shiftKey === shiftKey
      ) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, options]);
};

// Hook for managing notification system
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<
    Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>
  >([]);

  const addNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 5000
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };
};

// Export all hooks (removed redundant export block)
