/**
 * Test utilities and helpers
 */

import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { Event } from '../types';

// Mock event data for testing
export const mockEvent: Event = {
  id: 1,
  from: 'Contractor',
  to: 'NHAI',
  date: '2024-01-15',
  letterNo: 'ABC/LET/001',
  subject: 'Test Event Subject',
  description: 'Test event description',
  assignee: 'Test Assignee',
  attachments: ['test-file.pdf'],
  priority: 'high',
  contractDeadline: '2024-01-20',
  isOverdue: false,
};

export const mockEvents: Event[] = [
  mockEvent,
  {
    id: 2,
    from: 'NHAI',
    to: 'Contractor',
    date: '2024-02-20',
    letterNo: 'NHAI/LET/002',
    subject: 'Response to contractor request',
    description: 'Official response to the contractor request',
    assignee: 'NHAI Officer',
    attachments: ['response.pdf'],
    priority: 'medium',
    contractDeadline: '2024-02-15',
    isOverdue: true,
  },
];

// Custom render function that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

