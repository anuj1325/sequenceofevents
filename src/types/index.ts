// src/types/index.ts
/**
 * Type definitions for Timeline Communication App
 */

// Core Event Interface
import React, { ReactNode } from 'react';

export interface Event {
  id: number;
  from: 'Contractor' | 'NHAI';
  to: 'Contractor' | 'NHAI';
  date: string;
  letterNo: string;
  subject: string;
  description: string;
  assignee: string;
  attachments: string[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
  contractDeadline?: string;
  isOverdue?: boolean;
  status?: EventStatus;
  category?: EventCategory;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
// editor types
// User and Authentication Types
export interface User {
  id?: string;
  name: string;
  email: string;
  plan: 'Free Plan' | 'Pro Plan' | 'Enterprise Plan';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Session and History Types
export interface Session {
  id?: string;
  title: string;
  date: string;
  type?: 'document' | 'research' | 'pdf-chat' | 'memo' | 'argument';
  lastModified?: string;
}

// Feature and Navigation Types
export interface FeatureOption {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  route: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current?: boolean;
  badge?: string | number;
}

// Typography and Editor Types
export interface Font {
  value: string;
  label: string;
  category?: 'serif' | 'sans-serif' | 'monospace';
}

export interface Size {
  value: string;
  label: string;
}

export interface LineSpacing {
  value: string;
  label: string;
}

// Document Types
export interface Document {
  id: string;
  title: string;
  content: string;
  htmlContent?: string;
  type: 'draft' | 'memo' | 'research' | 'argument' | 'template';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  author: string;
  tags?: string[];
  metadata?: DocumentMetadata;
}

export interface DocumentMetadata {
  wordCount?: number;
  characterCount?: number;
  readingTime?: number;
  lastAutoSave?: string;
  version?: number;
}

// Editor State Types
export interface EditorState {
  content: string;
  htmlContent: string;
  currentFont: string;
  currentSize: string;
  currentLineSpacing: string;
  isModified: boolean;
  lastSaved: Date | null;
  wordCount: number;
  characterCount: number;
}

export interface EditorPreferences {
  font: string;
  fontSize: string;
  lineSpacing: string;
  showLineNumbers: boolean;
  wordWrap: boolean;
  spellCheck: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
}

// Component Props Types
export interface TopNavigationProps {
  currentUser: User;
  onUpgrade: () => void;
}

export interface LeftNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  recentSessions: Session[];
  currentUser: User;
}

export interface FeatureCardProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export interface LayoutProps {
  children: ReactNode;
}

// Editor Component Props
export interface EditorToolbarProps {
  currentFont: string;
  currentSize: string;
  currentLineSpacing: string;
  fonts: Font[];
  textSizes: Size[];
  lineSpacings: LineSpacing[];
  formatText: (command: string, value?: string | null) => void;
  undo: () => void;
  redo: () => void;
  undoStack: string[];
  redoStack: string[];
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface SidebarProps {
  activeTab: 'research' | 'notes' | 'outline';
  onTabChange: (tab: 'research' | 'notes' | 'outline') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

// Research Types
export interface LegalResearchQuery {
  query: string;
  jurisdiction?: string;
  practiceArea?: string;
  courtLevel?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  maxResults?: number;
}

export interface LegalResearchResult {
  id: string;
  title: string;
  summary: string;
  relevanceScore: number;
  source: string;
  jurisdiction: string;
  court: string;
  date: string;
  citations: string[];
  url?: string;
  excerpt?: string;
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  page?: number;
  section?: string;
  url?: string;
  type: 'case' | 'statute' | 'regulation' | 'article' | 'book';
}

// PDF and File Types
export interface PDFFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  pages?: number;
  metadata?: PDFMetadata;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  attachments?: string[];
}

// API Types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LegalMemoForm {
  title: string;
  client: string;
  matter: string;
  issue: string;
  facts: string;
  jurisdiction: string;
  practiceArea: string;
}

export interface ArgumentGenerationForm {
  caseType: string;
  caseDetails: string;
  argumentFocus: string;
  jurisdiction: string;
  supportingDocuments?: File[];
}

// Utility Types
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it';
export type PlanType = 'free' | 'pro' | 'enterprise';
export type DocumentType = 'draft' | 'memo' | 'research' | 'argument' | 'template';
export type FileType = 'pdf' | 'doc' | 'docx' | 'txt' | 'rtf';

// Event Types
export interface DocumentEvent {
  type: 'save' | 'share' | 'export' | 'delete' | 'duplicate';
  documentId: string;
  timestamp: Date;
  userId: string;
}

export interface UserPreferences {
  theme: Theme;
  language: Language;
  autoSave: boolean;
  notifications: boolean;
  editorSettings: EditorPreferences;
  privacy: {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
  };
}

// Hook Return Types
export interface UseEditorReturn {
  // State
  text: string;
  htmlContent: string;
  currentFont: string;
  currentSize: string;
  currentLineSpacing: string;
  isModified: boolean;
  lastSaved: Date | null;
  undoStack: string[];
  redoStack: string[];
  
  // Refs
  editorRef: React.RefObject<HTMLDivElement>;
  
  // Actions
  formatText: (command: string, value?: string | null) => void;
  undo: () => void;
  redo: () => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  saveDocument: () => Promise<{ success: boolean; message: string }>;
  loadDocument: (content: string) => void;
  clearDocument: () => void;
  updateContent: () => void;
  
  // Utilities
  getDocumentStats: () => {
    words: number;
    characters: number;
    charactersNoSpaces: number;
    paragraphs: number;
  };
  
  // Settings
  setCurrentFont: (font: string) => void;
  setCurrentSize: (size: string) => void;
  setCurrentLineSpacing: (spacing: string) => void;
}

export interface UseLocalStorageReturn<T> {
  storedValue: T;
  setValue: (value: T | ((val: T) => T)) => void;
}


// Event Status
export type EventStatus = 
  | 'draft'
  | 'sent'
  | 'received'
  | 'acknowledged'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'overdue';

// Event Categories
export type EventCategory = 
  | 'contract'
  | 'technical'
  | 'administrative'
  | 'financial'
  | 'safety'
  | 'environmental'
  | 'quality'
  | 'legal'
  | 'other';

// Priority levels
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

// View types for timeline
export type ViewType = 'vertical' | 'horizontal' | 'table';

// Page types for navigation
export type PageType = 'dashboard' | 'timeline' | 'table' | 'drafting' | 'reports' | 'settings';

// Component Props Interfaces
export interface AppProps {
  embedded?: boolean;
  onEventClick?: (event: Event) => void;
  theme?: 'light' | 'dark';
  locale?: string;
}

export interface TimelineViewProps {
  viewType?: ViewType;
  embedded?: boolean;
  onEventClick?: (event: Event) => void;
  height?: string;
  showTitle?: boolean;
  events?: Event[];
  filters?: TimelineFilters;
  showControls?: boolean;
}

export interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
  side?: 'left' | 'right';
  onEventClick?: (event: Event) => void;
  compact?: boolean;
  showActions?: boolean;
}

// Filter and Search Interfaces
export interface TimelineFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  priority?: Priority[];
  status?: EventStatus[];
  category?: EventCategory[];
  sender?: ('Contractor' | 'NHAI')[];
  searchText?: string;
  tags?: string[];
  isOverdue?: boolean;
}

export interface SearchOptions {
  query: string;
  filters: TimelineFilters;
  sortBy: SortOption;
  page: number;
  limit: number;
}

export interface SortOption {
  field: keyof Event;
  direction: 'asc' | 'desc';
}

// Statistics and Analytics
export interface DashboardStats {
  totalEvents: number;
  contractorEvents: number;
  nhaiEvents: number;
  urgentEvents: number;
  overdueEvents: number;
  completedEvents: number;
  pendingEvents: number;
  averageResponseTime: number;
  trendsData: TrendData[];
}

export interface TrendData {
  date: string;
  count: number;
  category: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  metadata?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: 'Contractor' | 'NHAI';
  permissions: Permission[];
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
}

export type UserRole = 
  | 'admin'
  | 'project_manager'
  | 'engineer'
  | 'supervisor'
  | 'viewer';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Settings and Configuration
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  display: DisplaySettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  overdueReminders: boolean;
  deadlineAlerts: boolean;
  newEventNotifications: boolean;
  reminderFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface DisplaySettings {
  defaultView: ViewType;
  itemsPerPage: number;
  showAttachments: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
}

export interface PrivacySettings {
  shareAnalytics: boolean;
  allowTracking: boolean;
  dataSharingConsent: boolean;
}

// Draft and Templates
export interface LetterDraft {
  id?: string;
  referenceEventId?: number;
  subject: string;
  content: string;
  recipientType: 'Contractor' | 'NHAI';
  priority: Priority;
  category: EventCategory;
  attachments: File[];
  tags: string[];
  scheduledSend?: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  updatedAt: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: EventCategory;
  variables: TemplateVariable[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface TemplateVariable {
  name: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'date' | 'number' | 'select';
  options?: string[];
}

// Attachment and File Types
export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// Navigation and Routing
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavigationItem[];
  permissions?: string[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

// Timeline Specific Types
export interface TimelineEvent extends Event {
  position: {
    x: number;
    y: number;
  };
  isVisible: boolean;
  animationDelay: number;
}

export interface TimelineConfig {
  showAnimation: boolean;
  animationDuration: number;
  autoScroll: boolean;
  compactMode: boolean;
  showMilestones: boolean;
  groupByDate: boolean;
}

// Form and Input Types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Context Types
export interface AppContextType {
  user: User | null;
  settings: AppSettings;
  events: Event[];
  loading: boolean;
  error: AppError | null;
  updateSettings: (settings: Partial<AppSettings>) => void;
  refreshEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: number, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

// Export utility types
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Constants
export const PRIORITY_COLORS = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
} as const;

export const EVENT_STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  received: 'bg-green-100 text-green-800',
  acknowledged: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  overdue: 'bg-red-100 text-red-800'
} as const;