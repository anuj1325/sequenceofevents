// src/services/mockData.ts
/**
 * Mock data for development and testing
 */

import { AppSettings, DashboardStats, Event, LetterTemplate, User } from '../types';

// Mock Events Data
export const mockEvents: Event[] = [
  {
    id: 1,
    from: 'Contractor',
    to: 'NHAI',
    date: '2024-01-15',
    letterNo: 'ABC/LET/001',
    subject: 'Award of contract and LOA issuance',
    description: 'Official award of contract and Letter of Acceptance issuance. We may ask to provide the length of contents, e.g 250 words etc.',
    assignee: 'Project Manager - John Doe',
    attachments: ['Contract_Document.pdf', 'LOA_Letter.pdf', 'Technical_Specs.pdf'],
    priority: 'high',
    contractDeadline: '2024-01-20',
    isOverdue: false,
    status: 'completed',
    category: 'contract',
    tags: ['contract', 'LOA', 'award'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    createdBy: 'john.doe@contractor.com',
    updatedBy: 'john.doe@contractor.com'
  },
  {
    id: 2,
    from: 'NHAI',
    to: 'Contractor',
    date: '2024-02-20',
    letterNo: 'ABC/LET/002',
    subject: 'Site handover process completed',
    description: 'Site handover process has been completed successfully. All clearances and permissions have been provided.',
    assignee: 'Site Engineer - Jane Smith',
    attachments: ['Site_Handover.pdf', 'Clearance_Certificate.pdf'],
    priority: 'medium',
    contractDeadline: '2024-02-15',
    isOverdue: true,
    status: 'overdue',
    category: 'administrative',
    tags: ['handover', 'site', 'clearance'],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-20T16:45:00Z',
    createdBy: 'jane.smith@nhai.gov.in',
    updatedBy: 'jane.smith@nhai.gov.in'
  },
  {
    id: 3,
    from: 'Contractor',
    to: 'NHAI',
    date: '2024-03-10',
    letterNo: 'ABC/LET/003',
    subject: 'Intimation of delay due to utility shifting',
    description: 'Formal intimation regarding project delay due to pending utility shifting requirements.',
    assignee: 'Operations Head - Mike Johnson',
    attachments: ['Delay_Notice.pdf', 'Utility_Report.pdf'],
    priority: 'high',
    contractDeadline: '2024-03-05',
    isOverdue: true,
    status: 'overdue',
    category: 'technical',
    tags: ['delay', 'utility', 'shifting'],
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-10T13:20:00Z',
    createdBy: 'mike.johnson@contractor.com',
    updatedBy: 'mike.johnson@contractor.com'
  },
  {
    id: 4,
    from: 'NHAI',
    to: 'Contractor',
    date: '2024-03-22',
    letterNo: 'NHAI/LET/054',
    subject: 'Instruction to expedite utility clearance',
    description: 'Official instruction to expedite the utility clearance process to minimize project delays.',
    assignee: 'Project Director - Sarah Wilson',
    attachments: ['Instructions.pdf', 'Timeline_Revised.pdf'],
    priority: 'urgent',
    contractDeadline: '2024-03-25',
    isOverdue: false,
    status: 'in_progress',
    category: 'administrative',
    tags: ['urgent', 'utility', 'clearance', 'expedite'],
    createdAt: '2024-03-20T08:30:00Z',
    updatedAt: '2024-03-22T12:15:00Z',
    createdBy: 'sarah.wilson@nhai.gov.in',
    updatedBy: 'sarah.wilson@nhai.gov.in'
  },
  {
    id: 5,
    from: 'Contractor',
    to: 'NHAI',
    date: '2024-03-29',
    letterNo: 'ABC/LET/005',
    subject: 'Alternate arrangements executed',
    description: 'Alternate arrangements have been successfully executed to proceed with the project timeline.',
    assignee: 'Site Supervisor - Tom Brown',
    attachments: ['Alternate_Plan.pdf', 'Execution_Report.pdf'],
    priority: 'medium',
    contractDeadline: '2024-04-01',
    isOverdue: false,
    status: 'completed',
    category: 'technical',
    tags: ['alternate', 'execution', 'plan'],
    createdAt: '2024-03-25T09:45:00Z',
    updatedAt: '2024-03-29T17:30:00Z',
    createdBy: 'tom.brown@contractor.com',
    updatedBy: 'tom.brown@contractor.com'
  },
  {
    id: 6,
    from: 'NHAI',
    to: 'Contractor',
    date: '2024-04-05',
    letterNo: 'NHAI/LET/055',
    subject: 'Environmental clearance documentation',
    description: 'Request for submission of environmental clearance documentation as per project requirements.',
    assignee: 'Environmental Officer - Lisa Chen',
    attachments: ['Environmental_Guidelines.pdf'],
    priority: 'high',
    contractDeadline: '2024-04-10',
    isOverdue: false,
    status: 'sent',
    category: 'environmental',
    tags: ['environment', 'clearance', 'documentation'],
    createdAt: '2024-04-03T14:20:00Z',
    updatedAt: '2024-04-05T11:10:00Z',
    createdBy: 'lisa.chen@nhai.gov.in',
    updatedBy: 'lisa.chen@nhai.gov.in'
  }
];

// Mock Dashboard Statistics
export const mockDashboardStats: DashboardStats = {
  totalEvents: mockEvents.length,
  contractorEvents: mockEvents.filter(e => e.from === 'Contractor').length,
  nhaiEvents: mockEvents.filter(e => e.from === 'NHAI').length,
  urgentEvents: mockEvents.filter(e => e.priority === 'urgent').length,
  overdueEvents: mockEvents.filter(e => e.isOverdue).length,
  completedEvents: mockEvents.filter(e => e.status === 'completed').length,
  pendingEvents: mockEvents.filter(e => e.status !== 'completed').length,
  averageResponseTime: 2.5, // days
  trendsData: [
    { date: '2024-01', count: 8, category: 'contract' },
    { date: '2024-02', count: 12, category: 'administrative' },
    { date: '2024-03', count: 15, category: 'technical' },
    { date: '2024-04', count: 6, category: 'environmental' }
  ]
};

// Mock User Data
export const mockUser: User = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@contractor.com',
  role: 'project_manager',
  organization: 'Contractor',
  permissions: [
    { resource: 'events', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'drafts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'templates', actions: ['read'] }
  ],
  avatar: 'https://via.placeholder.com/150',
  lastLogin: '2024-04-05T09:30:00Z',
  isActive: true
};

// Mock App Settings
export const mockAppSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  timezone: 'Asia/Kolkata',
  notifications: {
    email: true,
    push: true,
    overdueReminders: true,
    deadlineAlerts: true,
    newEventNotifications: true,
    reminderFrequency: 'daily'
  },
  display: {
    defaultView: 'vertical',
    itemsPerPage: 20,
    showAttachments: true,
    compactMode: false,
    animationsEnabled: true
  },
  privacy: {
    shareAnalytics: false,
    allowTracking: false,
    dataSharingConsent: false
  }
};

// Mock Letter Templates
export const mockLetterTemplates: LetterTemplate[] = [
  {
    id: 'template-001',
    name: 'Delay Notification Template',
    subject: 'Intimation of Delay - {{PROJECT_NAME}}',
    content: `Dear {{RECIPIENT_NAME}},

We would like to inform you about a potential delay in the {{PROJECT_NAME}} project due to {{DELAY_REASON}}.

Expected new timeline: {{NEW_TIMELINE}}
Impact: {{IMPACT_DESCRIPTION}}

We are taking following measures to minimize the delay:
{{MITIGATION_MEASURES}}

Best regards,
{{SENDER_NAME}}
{{SENDER_DESIGNATION}}`,
    category: 'administrative',
    variables: [
      { name: 'PROJECT_NAME', placeholder: 'Enter project name', required: true, type: 'text' },
      { name: 'RECIPIENT_NAME', placeholder: 'Enter recipient name', required: true, type: 'text' },
      { name: 'DELAY_REASON', placeholder: 'Enter reason for delay', required: true, type: 'text' },
      { name: 'NEW_TIMELINE', placeholder: 'Enter new timeline', required: true, type: 'date' },
      { name: 'IMPACT_DESCRIPTION', placeholder: 'Describe impact', required: false, type: 'text' },
      { name: 'MITIGATION_MEASURES', placeholder: 'List mitigation measures', required: false, type: 'text' },
      { name: 'SENDER_NAME', placeholder: 'Enter your name', required: true, type: 'text' },
      { name: 'SENDER_DESIGNATION', placeholder: 'Enter your designation', required: true, type: 'text' }
    ],
    isActive: true,
    createdBy: 'john.doe@contractor.com',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'template-002',
    name: 'Progress Update Template',
    subject: 'Progress Update - {{PROJECT_NAME}} - {{REPORT_PERIOD}}',
    content: `Dear {{RECIPIENT_NAME}},

Please find below the progress update for {{PROJECT_NAME}} for the period {{REPORT_PERIOD}}.

Current Status: {{CURRENT_STATUS}}
Completion Percentage: {{COMPLETION_PERCENTAGE}}%

Achievements:
{{ACHIEVEMENTS}}

Challenges:
{{CHALLENGES}}

Next Steps:
{{NEXT_STEPS}}

Best regards,
{{SENDER_NAME}}`,
    category: 'technical',
    variables: [
      { name: 'PROJECT_NAME', placeholder: 'Enter project name', required: true, type: 'text' },
      { name: 'REPORT_PERIOD', placeholder: 'Enter reporting period', required: true, type: 'text' },
      { name: 'RECIPIENT_NAME', placeholder: 'Enter recipient name', required: true, type: 'text' },
      { name: 'CURRENT_STATUS', placeholder: 'Describe current status', required: true, type: 'text' },
      { name: 'COMPLETION_PERCENTAGE', placeholder: 'Enter completion %', required: true, type: 'number' },
      { name: 'ACHIEVEMENTS', placeholder: 'List achievements', required: false, type: 'text' },
      { name: 'CHALLENGES', placeholder: 'List challenges', required: false, type: 'text' },
      { name: 'NEXT_STEPS', placeholder: 'List next steps', required: false, type: 'text' },
      { name: 'SENDER_NAME', placeholder: 'Enter your name', required: true, type: 'text' }
    ],
    isActive: true,
    createdBy: 'jane.smith@nhai.gov.in',
    createdAt: '2024-01-15T14:30:00Z'
  }
];

// Mock API Response Helper
export const createMockApiResponse = <T>(data: T, success: boolean = true, message: string = 'Success') => ({
  data,
  success,
  message,
  timestamp: new Date().toISOString()
});

// Mock API Delay Helper
export const mockApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Export all mock data
export const mockData = {
  events: mockEvents,
  dashboardStats: mockDashboardStats,
  user: mockUser,
  settings: mockAppSettings,
  templates: mockLetterTemplates,
  createMockApiResponse,
  mockApiDelay
};

export default mockData;
