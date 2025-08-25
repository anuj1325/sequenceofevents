// src/__tests__/setup.ts
/**
 * Test setup configuration for Timeline Communication App
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.REACT_APP_API_BASE_URL = 'http://localhost:3001/api';
process.env.REACT_APP_ENVIRONMENT = 'test';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock as any;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}

  observe(target: Element): void {}
  unobserve(target: Element): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock fetch
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});




// src/__tests__/mocks/server.ts
/**
 * Mock Service Worker server setup
 */



// ===================================

// src/App.test.tsx
/**
 * App component tests
 */


// ===================================

// src/components/TimelineView/TimelineView.test.tsx
/**
 * TimelineView component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '../../__tests__/utils';
import { TimelineView } from './TimelineView';
import { mockEvents } from '../../__tests__/utils';

describe('TimelineView Component', () => {
  test('renders timeline view correctly', () => {
    render(<TimelineView />);
    expect(screen.getByText('Timeline Reference')).toBeInTheDocument();
  });

  test('displays events in timeline', () => {
    render(<TimelineView />);
    expect(screen.getByText(mockEvents[0].subject)).toBeInTheDocument();
  });

  test('handles event click callback', () => {
    const mockOnEventClick = jest.fn();
    render(<TimelineView onEventClick={mockOnEventClick} />);
    
    const eventCard = screen.getByText(mockEvents[0].subject);
    fireEvent.click(eventCard);
    
    expect(mockOnEventClick).toHaveBeenCalledWith(mockEvents[0]);
  });

  test('renders in embedded mode', () => {
    render(<TimelineView embedded={true} />);
    expect(screen.getByText('Timeline Reference')).toBeInTheDocument();
  });
});

// ===================================

// package.json test scripts addition
/*
Add these to your package.json scripts section:

"scripts": {
  "test": "react-scripts test",
  "test:watch": "react-scripts test --watch",
  "test:coverage": "react-scripts test --coverage --watchAll=false",
  "test:ci": "react-scripts test --coverage --watchAll=false --ci",
  "test:e2e": "echo 'E2E tests not implemented yet'",
  "test:visual": "echo 'Visual regression tests not implemented yet'"
}
*/