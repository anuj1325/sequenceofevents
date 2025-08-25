// src/services/api.ts
/**
 * API Service Layer for Timeline Communication App
 * Handles all HTTP requests and API interactions
 */

import {
    ApiResponse,
    AppSettings,
    DashboardStats,
    Event,
    LetterDraft,
    LetterTemplate,
    PaginatedResponse,
    SearchOptions,
    TimelineFilters,
    User
} from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const API_VERSION = 'v1';
const BASE_URL = `${API_BASE_URL}/${API_VERSION}`;

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, timeout: number = REQUEST_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type']; // Let browser set content-type for FormData

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  // Error handling
  private handleError(error: any): Error {
    if (error.name === 'AbortError') {
      return new Error('Request timeout');
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return new Error('Network error - please check your connection');
    }

    return error;
  }
}

// Create API client instance
const apiClient = new ApiClient(BASE_URL);

// Events API
export const eventsApi = {
  // Get all events with optional filtering
  getEvents: async (filters?: TimelineFilters): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events', filters as any);
  },

  // Get events with pagination
  getEventsPaginated: async (options: SearchOptions): Promise<PaginatedResponse<Event>> => {
    return apiClient.get<Event[]>('/events/paginated', options as any) as Promise<PaginatedResponse<Event>>;
  },

  // Get single event by ID
  getEvent: async (id: number): Promise<ApiResponse<Event>> => {
    return apiClient.get<Event>(`/events/${id}`);
  },

  // Create new event
  createEvent: async (event: Omit<Event, 'id'>): Promise<ApiResponse<Event>> => {
    return apiClient.post<Event>('/events', event);
  },

  // Update existing event
  updateEvent: async (id: number, updates: Partial<Event>): Promise<ApiResponse<Event>> => {
    return apiClient.patch<Event>(`/events/${id}`, updates);
  },

  // Delete event
  deleteEvent: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/events/${id}`);
  },

  // Bulk operations
  bulkUpdate: async (updates: Array<{ id: number; data: Partial<Event> }>): Promise<ApiResponse<Event[]>> => {
    return apiClient.post<Event[]>('/events/bulk-update', { updates });
  },

  // Search events
  searchEvents: async (query: string): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events/search', { q: query });
  },

  // Get event statistics
  getEventStats: async (filters?: TimelineFilters): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get<DashboardStats>('/events/stats', filters as any);
  },
};

// Drafts API
export const draftsApi = {
  // Get all drafts
  getDrafts: async (): Promise<ApiResponse<LetterDraft[]>> => {
    return apiClient.get<LetterDraft[]>('/drafts');
  },

  // Get single draft
  getDraft: async (id: string): Promise<ApiResponse<LetterDraft>> => {
    return apiClient.get<LetterDraft>(`/drafts/${id}`);
  },

  // Create draft
  createDraft: async (draft: Omit<LetterDraft, 'id'>): Promise<ApiResponse<LetterDraft>> => {
    return apiClient.post<LetterDraft>('/drafts', draft);
  },

  // Update draft
  updateDraft: async (id: string, updates: Partial<LetterDraft>): Promise<ApiResponse<LetterDraft>> => {
    return apiClient.patch<LetterDraft>(`/drafts/${id}`, updates);
  },

  // Delete draft
  deleteDraft: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/drafts/${id}`);
  },

  // Send draft as event
  sendDraft: async (id: string): Promise<ApiResponse<Event>> => {
    return apiClient.post<Event>(`/drafts/${id}/send`);
  },
};

// Templates API
export const templatesApi = {
  // Get all templates
  getTemplates: async (): Promise<ApiResponse<LetterTemplate[]>> => {
    return apiClient.get<LetterTemplate[]>('/templates');
  },

  // Get single template
  getTemplate: async (id: string): Promise<ApiResponse<LetterTemplate>> => {
    return apiClient.get<LetterTemplate>(`/templates/${id}`);
  },

  // Create template
  createTemplate: async (template: Omit<LetterTemplate, 'id'>): Promise<ApiResponse<LetterTemplate>> => {
    return apiClient.post<LetterTemplate>('/templates', template);
  },

  // Update template
  updateTemplate: async (id: string, updates: Partial<LetterTemplate>): Promise<ApiResponse<LetterTemplate>> => {
    return apiClient.patch<LetterTemplate>(`/templates/${id}`, updates);
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/templates/${id}`);
  },
};

// File Upload API
export const filesApi = {
  // Upload single file
  uploadFile: async (file: File, eventId?: number): Promise<ApiResponse<{ url: string; id: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (eventId) {
      formData.append('eventId', eventId.toString());
    }
    return apiClient.upload<{ url: string; id: string }>('/files/upload', formData);
  },

  // Upload multiple files
  uploadFiles: async (files: File[], eventId?: number): Promise<ApiResponse<Array<{ url: string; id: string }>>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (eventId) {
      formData.append('eventId', eventId.toString());
    }
    return apiClient.upload<Array<{ url: string; id: string }>>('/files/upload-multiple', formData);
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/files/${fileId}`);
  },
};

// User API
export const userApi = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/user/profile');
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.patch<User>('/user/profile', updates);
  },

  // Get user settings
  getSettings: async (): Promise<ApiResponse<AppSettings>> => {
    return apiClient.get<AppSettings>('/user/settings');
  },

  // Update user settings
  updateSettings: async (settings: Partial<AppSettings>): Promise<ApiResponse<AppSettings>> => {
    return apiClient.patch<AppSettings>('/user/settings', settings);
  },
};

// Authentication API
export const authApi = {
  // Login
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiClient.post<{ token: string; user: User }>('/auth/login', credentials);
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<void>('/auth/logout');
    apiClient.removeAuthToken();
    localStorage.removeItem('authToken');
    return response;
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },

  // Verify token
  verifyToken: async (): Promise<ApiResponse<{ valid: boolean; user: User }>> => {
    return apiClient.get<{ valid: boolean; user: User }>('/auth/verify');
  },
};

// Analytics API
export const analyticsApi = {
  // Get dashboard analytics
  getDashboardAnalytics: async (filters?: TimelineFilters): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get<DashboardStats>('/analytics/dashboard', filters as any);
  },

  // Get communication trends
  getCommunicationTrends: async (period: 'week' | 'month' | 'quarter' | 'year'): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/analytics/trends', { period });
  },

  // Get performance metrics
  getPerformanceMetrics: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/analytics/performance');
  },
};

// Initialize authentication token from localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    apiClient.setAuthToken(token);
  }
};

// Initialize auth on import
initializeAuth();

// Export API client for advanced usage
export { apiClient };

// Default export
export default {
  events: eventsApi,
  drafts: draftsApi,
  templates: templatesApi,
  files: filesApi,
  user: userApi,
  auth: authApi,
  analytics: analyticsApi,
};