/**
 * Global Application Context
 */

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { eventsApi, userApi } from '../services/api';
import { AppError, AppSettings, Event, User } from '../types';

interface AppState {
  user: User | null;
  events: Event[];
  settings: AppSettings | null;
  loading: boolean;
  error: AppError | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: { id: number; event: Event } }
  | { type: 'DELETE_EVENT'; payload: number }
  | { type: 'SET_SETTINGS'; payload: AppSettings };

const initialState: AppState = {
  user: null,
  events: [],
  settings: null,
  loading: false,
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload.event : event
        )
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};

interface AppContextType extends AppState {
  refreshEvents: () => Promise<void>;
  createEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: number, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Load user profile
        const userResponse = await userApi.getProfile();
        if (userResponse.success) {
          dispatch({ type: 'SET_USER', payload: userResponse.data });
        }

        // Load user settings
        const settingsResponse = await userApi.getSettings();
        if (settingsResponse.success) {
          dispatch({ type: 'SET_SETTINGS', payload: settingsResponse.data });
        }

        // Load events
        const eventsResponse = await eventsApi.getEvents();
        if (eventsResponse.success) {
          dispatch({ type: 'SET_EVENTS', payload: eventsResponse.data });
        }
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: {
            code: 'INIT_ERROR',
            message: 'Failed to load initial data',
            timestamp: new Date().toISOString()
          }
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  const refreshEvents = async () => {
    try {
      const response = await eventsApi.getEvents();
      if (response.success) {
        dispatch({ type: 'SET_EVENTS', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'EVENTS_ERROR',
          message: 'Failed to refresh events',
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      const response = await eventsApi.createEvent(eventData);
      if (response.success) {
        dispatch({ type: 'ADD_EVENT', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'CREATE_EVENT_ERROR',
          message: 'Failed to create event',
          timestamp: new Date().toISOString()
        }
      });
      throw error;
    }
  };

  const updateEvent = async (id: number, updates: Partial<Event>) => {
    try {
      const response = await eventsApi.updateEvent(id, updates);
      if (response.success) {
        dispatch({ type: 'UPDATE_EVENT', payload: { id, event: response.data } });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'UPDATE_EVENT_ERROR',
          message: 'Failed to update event',
          timestamp: new Date().toISOString()
        }
      });
      throw error;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      const response = await eventsApi.deleteEvent(id);
      if (response.success) {
        dispatch({ type: 'DELETE_EVENT', payload: id });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'DELETE_EVENT_ERROR',
          message: 'Failed to delete event',
          timestamp: new Date().toISOString()
        }
      });
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const response = await userApi.updateSettings(newSettings);
      if (response.success) {
        dispatch({ type: 'SET_SETTINGS', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'SETTINGS_ERROR',
          message: 'Failed to update settings',
          timestamp: new Date().toISOString()
        }
      });
      throw error;
    }
  };

  const value: AppContextType = {
    ...state,
    refreshEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    updateSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};