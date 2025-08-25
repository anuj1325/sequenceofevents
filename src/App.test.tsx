import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from './__tests__/utils';
import App from './App';

// Mock the TimelineView component to avoid complex rendering in tests
jest.mock('./components/TimelineView', () => ({
  TimelineView: () => <div data-testid="timeline-view">Timeline View</div>
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Project Communication Hub')).toBeInTheDocument();
  });

  test('displays navigation elements', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Table')).toBeInTheDocument();
  });

  test('shows dashboard by default', () => {
    render(<App />);
    expect(screen.getByText('Project Communication Dashboard')).toBeInTheDocument();
  });
});
