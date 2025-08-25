// src/utils/index.ts
/**
 * Utility functions for Timeline Communication App
 */

import { Event, EventStatus, Priority, TimelineFilters } from '../types';

// Date and Time Utilities
export const dateUtils = {
  // Format date to readable string
  formatDate: (date: string | Date, locale: string = 'en-US'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Format date with time
  formatDateTime: (date: string | Date, locale: string = 'en-US'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get relative time (e.g., "2 days ago")
  getRelativeTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  },

  // Check if date is overdue
  isOverdue: (deadline: string | Date): boolean => {
    const deadlineObj = typeof deadline === 'string' ? new Date(deadline) : deadline;
    return deadlineObj.getTime() < new Date().getTime();
  },

  // Get days until deadline
  getDaysUntilDeadline: (deadline: string | Date): number => {
    const deadlineObj = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const now = new Date();
    const diffInMs = deadlineObj.getTime() - now.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  },

  // Get date range for filters
  getDateRange: (period: 'week' | 'month' | 'quarter' | 'year'): { start: string; end: string } => {
    const now = new Date();
    const end = now.toISOString().split('T')[0];
    
    let start: Date;
    switch (period) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        start = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end
    };
  }
};

// String Utilities
export const stringUtils = {
  // Truncate text with ellipsis
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  },

  // Capitalize first letter
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Convert to title case
  toTitleCase: (text: string): string => {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Generate random ID
  generateId: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Sanitize filename
  sanitizeFilename: (filename: string): string => {
    return filename.replace(/[^a-z0-9.-]/gi, '_');
  },

  // Extract file extension
  getFileExtension: (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

// Array Utilities
export const arrayUtils = {
  // Group array by key
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  // Sort array by multiple keys
  sortBy: <T>(array: T[], ...keys: (keyof T)[]): T[] => {
    return [...array].sort((a, b) => {
      for (const key of keys) {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
      }
      return 0;
    });
  },

  // Remove duplicates from array
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  // Chunk array into smaller arrays
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

// Event Utilities
export const eventUtils = {
  // Check if event is overdue
  isEventOverdue: (event: Event): boolean => {
    if (!event.contractDeadline) return false;
    return dateUtils.isOverdue(event.contractDeadline);
  },

  // Get priority color class
  getPriorityColor: (priority: Priority): string => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority];
  },

  // Get status color class
  getStatusColor: (status: EventStatus): string => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      received: 'bg-green-100 text-green-800',
      acknowledged: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status];
  },

  // Get sender color class
  getSenderColor: (sender: 'Contractor' | 'NHAI'): string => {
    return sender === 'Contractor' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  },

  // Filter events based on criteria
  filterEvents: (events: Event[], filters: TimelineFilters): Event[] => {
    return events.filter(event => {
      // Date range filter
      if (filters.dateRange) {
        const eventDate = new Date(event.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (eventDate < startDate || eventDate > endDate) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(event.priority)) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0 && event.status) {
        if (!filters.status.includes(event.status)) return false;
      }

      // Sender filter
      if (filters.sender && filters.sender.length > 0) {
        if (!filters.sender.includes(event.from)) return false;
      }

      // Search text filter
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase();
        const searchFields = [
          event.subject,
          event.description,
          event.letterNo,
          event.assignee
        ];
        const matches = searchFields.some(field => 
          field.toLowerCase().includes(searchText)
        );
        if (!matches) return false;
      }

      // Overdue filter
      if (filters.isOverdue !== undefined) {
        const isOverdue = eventUtils.isEventOverdue(event);
        if (filters.isOverdue !== isOverdue) return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0 && event.tags) {
        const hasMatchingTag = filters.tags.some(tag => 
          event.tags?.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  },

  // Sort events by various criteria
  sortEvents: (events: Event[], sortBy: keyof Event, direction: 'asc' | 'desc' = 'desc'): Event[] => {
    return [...events].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle date sorting
      if (sortBy === 'date' || sortBy === 'contractDeadline') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      // Handle priority sorting
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aVal = priorityOrder[aVal as Priority];
        bVal = priorityOrder[bVal as Priority];
      }

      if ((aVal ?? 0) < (bVal ?? 0 ?? 0)) return direction === 'asc' ? -1 : 1;
      if ((aVal ?? 0) > (bVal ?? 0 ?? 0)) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
};

// Validation Utilities
export const validationUtils = {
  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate required fields
  validateRequired: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value != null && value !== undefined;
  },

  // Validate date format
  isValidDate: (date: string): boolean => {
    return !isNaN(Date.parse(date));
  },

  // Validate file type
  isValidFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  // Validate file size
  isValidFileSize: (file: File, maxSizeInMB: number): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }
};

// Local Storage Utilities
export const storageUtils = {
  // Set item in localStorage with error handling
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Get item from localStorage with error handling
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  // Clear all localStorage
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// URL and Query Utilities
export const urlUtils = {
  // Build query string from object
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    return searchParams.toString();
  },

  // Parse query string to object
  parseQueryString: (queryString: string): Record<string, any> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, any> = {};
    
    for (const [key, value] of params.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
};

// Export utilities
export const utils = {
  date: dateUtils,
  string: stringUtils,
  array: arrayUtils,
  event: eventUtils,
  validation: validationUtils,
  storage: storageUtils,
  url: urlUtils
};

export default utils;