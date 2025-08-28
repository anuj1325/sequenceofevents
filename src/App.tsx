// src/App.tsx
/**
 * Main Application Component for Timeline Communication App
 * Handles routing, navigation, and main layout
 */

import { AlertTriangle, Bell, Calendar, Clock, FileText, Home, Menu, Paperclip, User } from 'lucide-react';
import React, { useState } from 'react';
import Editor from './components/Editor';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/UI/table";

// Types
export interface Letter {
  id: string;
  letterNo: string;
  date: string;
  from: 'Contractor' | 'NHAI';
  to: 'Contractor' | 'NHAI';
  subject: string;
  description: string;
  assignee: string;
  attachments: string[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status?: EventStatus;
  contractDeadline?: string;
  isOverdue?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Event {
  id: number;
  eventTitle: string;
  category?: EventCategory;
  tags?: string[];
  letters: Letter[];
  // Main event properties for backward compatibility
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
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type EventStatus =
  | 'draft'
  | 'sent'
  | 'received'
  | 'acknowledged'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'overdue';

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

// Sequence of Events Structure
export interface SequenceOfEvents {
  id: number;
  sequenceTitle: string;
  phase: 'Pre-Contract Phase' | 'Contract Execution Phase' | 'Operational Phase' | 'Resolution Phase';
  category: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  expectedDuration: string;
  keyDocuments: string[];
  relatedEventIds: number[]; // Links to actual events that are part of this sequence
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  isOverdue?: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

export type ViewType = 'vertical' | 'horizontal' | 'table';
export type PageType = 'dashboard' | 'timeline' | 'table' | 'drafting' | 'draft-management';

// Function to get all letters from an event, returning Letter objects
const getAllLettersFromEvent = (event: Event): Letter[] => {
  if (event.letters && event.letters.length > 0) {
    return event.letters.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  // Fallback: create a letter from the main event properties for backward compatibility
  return [{
    id: `${event.id}-main`,
    letterNo: event.letterNo,
    date: event.date,
    from: event.from,
    to: event.to,
    subject: event.subject,
    description: event.description,
    assignee: event.assignee,
    attachments: event.attachments,
    priority: event.priority,
    status: event.status,
    contractDeadline: event.contractDeadline,
    isOverdue: event.isOverdue,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    createdBy: event.createdBy,
    updatedBy: event.updatedBy
  }];
};

// Function to get related letters from selected event
const getRelatedLetters = (selectedEvent: Event | null): Letter[] => {
  if (!selectedEvent) return [];
  
  return getAllLettersFromEvent(selectedEvent);
};

// Function to get all letters related to a selected sequence
const getLettersForSequence = (selectedSequence: SequenceOfEvents | null): Letter[] => {
  if (!selectedSequence) return [];
  
  // Get all events that are part of this sequence
  const relatedEvents = mockData.events.filter(event => 
    selectedSequence.relatedEventIds.includes(event.id)
  );
  
  // Get all letters from these events
  const allLetters = relatedEvents.flatMap(event => getAllLettersFromEvent(event));
  
  // Sort chronologically
  return allLetters.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Function to get related events based on subject similarity, letter references, or conversation thread
const getRelatedEvents = (selectedEvent: Event | null, allEvents: Event[]): Event[] => {
  if (!selectedEvent) return allEvents;
  
  // For now, we'll consider events related if they:
  // 1. Have similar subjects (keywords match)
  // 2. Are part of the same conversation thread (bidirectional communication)
  // 3. Reference the same contract/project aspects
  
  const selectedSubjectKeywords = selectedEvent.subject.toLowerCase().split(' ');
  const selectedTags = selectedEvent.tags || [];
  
  return allEvents.filter(event => {
    // Always include the selected event
    if (event.id === selectedEvent.id) return true;
    
    // Check for subject keyword matches
    const eventKeywords = event.subject.toLowerCase().split(' ');
    const keywordMatches = selectedSubjectKeywords.some(keyword => 
      keyword.length > 3 && eventKeywords.some(eventKeyword => eventKeyword.includes(keyword))
    );
    
    // Check for tag matches
    const tagMatches = selectedTags.some(tag => 
      event.tags?.includes(tag)
    );
    
    // Check for category matches
    const categoryMatch = event.category === selectedEvent.category;
    
    // Check for conversation thread (same parties involved)
    const sameParties = (event.from === selectedEvent.from && event.to === selectedEvent.to) ||
                       (event.from === selectedEvent.to && event.to === selectedEvent.from);
    
    return keywordMatches || tagMatches || (categoryMatch && sameParties);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Draft interface for draft management
export interface Draft {
  id: string;
  draftName: string;
  description: string;
  subject: string;
  draftNumber: string;
  letterInReference: string; // Reference to original letter
  to: string;
  copyTo: string[];
  status: 'In Draft' | 'Published' | 'Sent for Review' | 'Approved' | 'Sent to Authority';
  createdDate: string;
  lastModified: string;
  content: string;
  createdBy: string;
}

// Mock Data for Sequence of Events
const sequenceOfEventsData: { sequences: SequenceOfEvents[] } = {
  sequences: [
    {
      id: 1,
      sequenceTitle: "Tender Identification & Registration",
      phase: "Pre-Contract Phase",
      category: "Tender Management",
      description: "Complete process of identifying tender opportunities and registering for participation including NIT review and e-portal registration.",
      status: "completed",
      expectedDuration: "5-7 days",
      keyDocuments: ["Notice Inviting Tender (NIT)", "Registration Certificate", "Portal Access Credentials"],
      relatedEventIds: [1],
      startDate: "2024-01-10",
      targetDate: "2024-01-17",
      completedDate: "2024-01-15",
      isOverdue: false,
      priority: "high"
    },
    {
      id: 2,
      sequenceTitle: "Bid Preparation & Submission",
      phase: "Pre-Contract Phase", 
      category: "Tender Management",
      description: "Comprehensive bid preparation including technical and financial proposals, EMD submission and online bid submission process.",
      status: "completed",
      expectedDuration: "15-20 days",
      keyDocuments: ["Technical Proposal", "Financial Proposal", "EMD Receipt", "Bid Submission Receipt"],
      relatedEventIds: [1],
      startDate: "2024-01-15",
      targetDate: "2024-02-05",
      completedDate: "2024-01-26",
      isOverdue: false,
      priority: "high"
    },
    {
      id: 3,
      sequenceTitle: "Bid Evaluation & Award",
      phase: "Pre-Contract Phase",
      category: "Contract Award",
      description: "Complete bid evaluation process from opening ceremony through technical and financial evaluation to LOA issuance.",
      status: "completed",
      expectedDuration: "30-45 days",
      keyDocuments: ["Bid Opening Minutes", "Technical Evaluation Report", "Financial Evaluation Report", "Letter of Award (LOA)"],
      relatedEventIds: [1],
      startDate: "2024-01-26",
      targetDate: "2024-03-15",
      completedDate: "2024-01-26",
      isOverdue: false,
      priority: "high"
    },
    {
      id: 4,
      sequenceTitle: "Contract Agreement",
      phase: "Contract Execution Phase",
      category: "Contract Formalization",
      description: "Formal contract signing process including performance security submission and appointed date declaration.",
      status: "in_progress",
      expectedDuration: "7-10 days",
      keyDocuments: ["Signed Contract Agreement", "Performance Security", "Appointed Date Letter"],
      relatedEventIds: [1],
      startDate: "2024-01-26",
      targetDate: "2024-02-05",
      isOverdue: false,
      priority: "urgent"
    },
    {
      id: 5,
      sequenceTitle: "Project Initiation",
      phase: "Contract Execution Phase",
      category: "Project Setup",
      description: "Project kick-off activities including kick-off meeting within 7 days, site handover and programme submission.",
      status: "not_started",
      expectedDuration: "10-14 days",
      keyDocuments: ["Kick-off Meeting Minutes", "Site Handover Memorandum", "Project Programme"],
      relatedEventIds: [2],
      startDate: "2024-02-05",
      targetDate: "2024-02-20",
      isOverdue: false,
      priority: "high"
    },
    {
      id: 6,
      sequenceTitle: "Project Milestone-I (20% progress)",
      phase: "Contract Execution Phase",
      category: "Progress Milestones",
      description: "First major project milestone representing 20% completion of overall project scope with quality and progress verification.",
      status: "not_started",
      expectedDuration: "45-60 days",
      keyDocuments: ["Milestone Certificate", "Progress Report", "Quality Compliance Certificate", "IPC"],
      relatedEventIds: [],
      startDate: "2024-02-20",
      targetDate: "2024-04-15",
      isOverdue: false,
      priority: "medium"
    },
    {
      id: 7,
      sequenceTitle: "Project Milestone-II",
      phase: "Contract Execution Phase",
      category: "Progress Milestones", 
      description: "Second major project milestone with interim progress assessment and payment processing.",
      status: "not_started",
      expectedDuration: "60-75 days",
      keyDocuments: ["Milestone Certificate", "Progress Report", "IPC", "Test Reports"],
      relatedEventIds: [],
      startDate: "2024-04-15",
      targetDate: "2024-06-30",
      isOverdue: false,
      priority: "medium"
    },
    {
      id: 8,
      sequenceTitle: "Project Milestone-III",
      phase: "Contract Execution Phase",
      category: "Progress Milestones",
      description: "Third major project milestone approaching scheduled completion with comprehensive testing and quality verification.",
      status: "not_started", 
      expectedDuration: "45-60 days",
      keyDocuments: ["Milestone Certificate", "Completion Tests", "Quality Reports", "Final IPC"],
      relatedEventIds: [],
      startDate: "2024-06-30",
      targetDate: "2024-08-30",
      isOverdue: false,
      priority: "medium"
    },
    {
      id: 9,
      sequenceTitle: "Monthly Progress Reports",
      phase: "Contract Execution Phase",
      category: "Progress Monitoring",
      description: "Regular monthly progress reporting including IPC processing and quality compliance certification.",
      status: "in_progress",
      expectedDuration: "Ongoing monthly",
      keyDocuments: ["Monthly Progress Reports", "IPCs", "Quality Certificates", "Test Reports"],
      relatedEventIds: [],
      startDate: "2024-02-01",
      targetDate: "2024-12-31",
      isOverdue: false,
      priority: "high"
    },
    {
      id: 10,
      sequenceTitle: "Completion & Testing",
      phase: "Operational Phase",
      category: "Project Completion",
      description: "Final completion activities including completion certificate issuance, tests on completion and final payment processing.",
      status: "not_started",
      expectedDuration: "30-45 days",
      keyDocuments: ["Completion Certificate", "Test Reports", "Final Payment Certificate", "Handover Documents"],
      relatedEventIds: [],
      startDate: "2024-08-30",
      targetDate: "2024-10-15",
      isOverdue: false,
      priority: "high"
    },
    {
      id: 11,
      sequenceTitle: "Maintenance & Compliance",
      phase: "Operational Phase",
      category: "Post-Completion",
      description: "Post-completion maintenance period with defect notifications, joint inspections and compliance verification.",
      status: "not_started",
      expectedDuration: "12 months",
      keyDocuments: ["Defect Notification Letters", "Joint Inspection Reports", "Compliance Certificates"],
      relatedEventIds: [],
      startDate: "2024-10-15",
      targetDate: "2025-10-15",
      isOverdue: false,
      priority: "medium"
    },
    {
      id: 12,
      sequenceTitle: "Extension of Time Requests",
      phase: "Resolution Phase",
      category: "Dispute Resolution",
      description: "Processing of extension of time requests due to unforeseen circumstances or delays beyond contractor control.",
      status: "not_started",
      expectedDuration: "30-60 days per request",
      keyDocuments: ["EOT Application", "Supporting Documents", "Assessment Reports", "Approval/Rejection Letters"],
      relatedEventIds: [3, 4],
      startDate: "2024-03-10",
      targetDate: "2024-05-10",
      isOverdue: false,
      priority: "high"
    },
    {
      id: 13,
      sequenceTitle: "Variation Order Processing",
      phase: "Resolution Phase",
      category: "Contract Variations",
      description: "Processing of variation orders for scope changes, additional works or modifications to original contract terms.",
      status: "not_started",
      expectedDuration: "20-30 days per variation",
      keyDocuments: ["Variation Order", "Cost Analysis", "Approval Letters", "Revised Drawings"],
      relatedEventIds: [],
      startDate: "2024-04-01",
      targetDate: "2024-05-01",
      isOverdue: false,
      priority: "medium"
    },
    {
      id: 14,
      sequenceTitle: "Final Assessments & Project Handover",
      phase: "Resolution Phase", 
      category: "Contract Closure",
      description: "Final project assessments, complete handover process and final settlements including all pending payments.",
      status: "not_started",
      expectedDuration: "45-60 days",
      keyDocuments: ["Final Assessment Report", "Handover Certificate", "Final Settlement Statement", "Closure Documents"],
      relatedEventIds: [],
      startDate: "2025-10-15",
      targetDate: "2025-12-15",
      isOverdue: false,
      priority: "high"
    }
  ]
};

// Mock JSON Data with contract deadlines and overdue scenarios
const mockData: { events: Event[] } = {
  events: [
    {
      id: 1,
      eventTitle: "Contract Award and LOA Process",
      // Main event properties (first letter for backward compatibility)
      from: "Contractor",
      to: "NHAI",
      date: "2024-01-15",
      letterNo: "ABC/LET/001",
      subject: "Award of contract and LOA issuance",
      description: "Official award of contract and Letter of Acceptance issuance.",
      assignee: "Project Manager - John Doe",
      attachments: ["Contract_Document.pdf", "LOA_Letter.pdf", "Technical_Specs.pdf"],
      priority: "high",
      contractDeadline: "2024-01-20",
      isOverdue: false,
      status: "completed",
      category: "contract",
      tags: ["contract", "LOA", "award"],
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
      createdBy: "john.doe@contractor.com",
      updatedBy: "john.doe@contractor.com",
      letters: [
        {
          id: "1-1",
          letterNo: "ABC/LET/001",
          date: "2024-01-15",
          from: "Contractor",
          to: "NHAI",
          subject: "Award of contract and LOA issuance",
          description: "Official award of contract and Letter of Acceptance issuance. This letter confirms our acceptance of the awarded contract and outlines the initial project requirements.",
          assignee: "Project Manager - John Doe",
          attachments: ["Contract_Document.pdf", "LOA_Letter.pdf", "Technical_Specs.pdf"],
          priority: "high",
          status: "completed",
          contractDeadline: "2024-01-20",
          isOverdue: false,
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
          createdBy: "john.doe@contractor.com",
          updatedBy: "john.doe@contractor.com"
        },
        {
          id: "1-2",
          letterNo: "NHAI/ACK/001",
          date: "2024-01-16",
          from: "NHAI",
          to: "Contractor",
          subject: "Acknowledgment of LOA acceptance",
          description: "Acknowledgment of Letter of Acceptance and confirmation of contract award. Please proceed with preliminary arrangements as per contract terms.",
          assignee: "Contract Administrator - Sarah Wilson",
          attachments: ["Acknowledgment_Letter.pdf", "Project_Guidelines.pdf"],
          priority: "high",
          status: "completed",
          createdAt: "2024-01-16T10:30:00Z",
          updatedAt: "2024-01-16T15:45:00Z",
          createdBy: "sarah.wilson@nhai.gov.in",
          updatedBy: "sarah.wilson@nhai.gov.in"
        },
        {
          id: "1-3",
          letterNo: "ABC/LET/002",
          date: "2024-01-18",
          from: "Contractor",
          to: "NHAI",
          subject: "Request for project commencement meeting",
          description: "Request to schedule project commencement meeting to discuss timeline, resource allocation, and initial project phases.",
          assignee: "Project Manager - John Doe",
          attachments: ["Meeting_Request.pdf", "Proposed_Agenda.pdf"],
          priority: "medium",
          status: "completed",
          createdAt: "2024-01-17T14:20:00Z",
          updatedAt: "2024-01-18T11:15:00Z",
          createdBy: "john.doe@contractor.com",
          updatedBy: "john.doe@contractor.com"
        },
        {
          id: "1-4",
          letterNo: "NHAI/SCH/001",
          date: "2024-01-19",
          from: "NHAI",
          to: "Contractor",
          subject: "Project commencement meeting scheduled",
          description: "Meeting scheduled for January 22, 2024, at 10:00 AM at NHAI Regional Office. Agenda and required documents attached.",
          assignee: "Project Director - Sarah Wilson",
          attachments: ["Meeting_Schedule.pdf", "Required_Documents_List.pdf", "Venue_Details.pdf"],
          priority: "high",
          status: "completed",
          createdAt: "2024-01-19T09:30:00Z",
          updatedAt: "2024-01-19T16:45:00Z",
          createdBy: "sarah.wilson@nhai.gov.in",
          updatedBy: "sarah.wilson@nhai.gov.in"
        },
        {
          id: "1-5",
          letterNo: "ABC/LET/003",
          date: "2024-01-20",
          from: "Contractor",
          to: "NHAI",
          subject: "Confirmation of meeting attendance",
          description: "Confirming attendance for the project commencement meeting scheduled on January 22, 2024. Team members and required documents listed.",
          assignee: "Project Manager - John Doe",
          attachments: ["Attendance_Confirmation.pdf", "Team_Details.pdf"],
          priority: "medium",
          status: "completed",
          createdAt: "2024-01-20T08:45:00Z",
          updatedAt: "2024-01-20T12:30:00Z",
          createdBy: "john.doe@contractor.com",
          updatedBy: "john.doe@contractor.com"
        },
        {
          id: "1-6",
          letterNo: "ABC/LET/004",
          date: "2024-01-22",
          from: "Contractor",
          to: "NHAI",
          subject: "Post-meeting action items and clarifications",
          description: "Follow-up letter outlining action items discussed in the commencement meeting and requesting clarifications on specific contract clauses.",
          assignee: "Project Manager - John Doe",
          attachments: ["Action_Items.pdf", "Meeting_Minutes.pdf", "Clarification_Points.pdf"],
          priority: "high",
          status: "in_progress",
          contractDeadline: "2024-01-25",
          createdAt: "2024-01-22T15:20:00Z",
          updatedAt: "2024-01-22T17:45:00Z",
          createdBy: "john.doe@contractor.com",
          updatedBy: "john.doe@contractor.com"
        },
        {
          id: "1-7",
          letterNo: "NHAI/CLR/001",
          date: "2024-01-23",
          from: "NHAI",
          to: "Contractor",
          subject: "Clarifications on contract clauses",
          description: "Providing clarifications on contract clauses as requested in your letter ABC/LET/004. Additional guidelines and interpretations attached.",
          assignee: "Legal Advisor - Michael Chen",
          attachments: ["Contract_Clarifications.pdf", "Legal_Guidelines.pdf", "Interpretation_Notes.pdf"],
          priority: "high",
          status: "completed",
          createdAt: "2024-01-23T10:15:00Z",
          updatedAt: "2024-01-23T14:30:00Z",
          createdBy: "michael.chen@nhai.gov.in",
          updatedBy: "michael.chen@nhai.gov.in"
        },
        {
          id: "1-8",
          letterNo: "ABC/LET/005",
          date: "2024-01-24",
          from: "Contractor",
          to: "NHAI",
          subject: "Submission of insurance documents",
          description: "Submitting required insurance documents and performance guarantees as per contract requirements. All policies are effective from contract start date.",
          assignee: "Finance Manager - Lisa Zhang",
          attachments: ["Insurance_Policy.pdf", "Performance_Guarantee.pdf", "Bank_Details.pdf", "Premium_Receipts.pdf"],
          priority: "high",
          status: "completed",
          createdAt: "2024-01-24T09:00:00Z",
          updatedAt: "2024-01-24T16:20:00Z",
          createdBy: "lisa.zhang@contractor.com",
          updatedBy: "lisa.zhang@contractor.com"
        },
        {
          id: "1-9",
          letterNo: "NHAI/APP/001",
          date: "2024-01-25",
          from: "NHAI",
          to: "Contractor",
          subject: "Approval of insurance documents",
          description: "Insurance documents and performance guarantees have been reviewed and approved. Project can now proceed to the next phase.",
          assignee: "Financial Controller - Robert Kim",
          attachments: ["Approval_Certificate.pdf", "Next_Phase_Guidelines.pdf"],
          priority: "medium",
          status: "completed",
          createdAt: "2024-01-25T11:30:00Z",
          updatedAt: "2024-01-25T15:45:00Z",
          createdBy: "robert.kim@nhai.gov.in",
          updatedBy: "robert.kim@nhai.gov.in"
        },
        {
          id: "1-10",
          letterNo: "ABC/LET/006",
          date: "2024-01-26",
          from: "Contractor",
          to: "NHAI",
          subject: "Project mobilization plan submission",
          description: "Submitting detailed project mobilization plan including resource allocation, timeline, and key milestones for the first phase of the project.",
          assignee: "Project Manager - John Doe",
          attachments: ["Mobilization_Plan.pdf", "Resource_Schedule.pdf", "Timeline_Chart.pdf", "Milestone_List.pdf", "Equipment_List.pdf"],
          priority: "high",
          status: "sent",
          contractDeadline: "2024-01-30",
          createdAt: "2024-01-26T08:30:00Z",
          updatedAt: "2024-01-26T13:15:00Z",
          createdBy: "john.doe@contractor.com",
          updatedBy: "john.doe@contractor.com"
        }
      ]
    },
    {
      id: 2,
      eventTitle: "Site Handover and Clearance Process",
      from: "NHAI",
      to: "Contractor",
      date: "2024-02-20",
      letterNo: "NHAI/SITE/001",
      subject: "Site handover process completed",
      description: "Site handover process has been completed successfully. All clearances and permissions have been provided.",
      assignee: "Site Engineer - Jane Smith",
      attachments: ["Site_Handover.pdf", "Clearance_Certificate.pdf"],
      priority: "medium",
      contractDeadline: "2024-02-15",
      isOverdue: true,
      status: "overdue",
      category: "administrative",
      tags: ["handover", "site", "clearance"],
      createdAt: "2024-02-15T10:00:00Z",
      updatedAt: "2024-02-20T16:45:00Z",
      createdBy: "jane.smith@nhai.gov.in",
      updatedBy: "jane.smith@nhai.gov.in",
      letters: [
        {
          id: "2-1",
          letterNo: "NHAI/SITE/001",
          date: "2024-02-20",
          from: "NHAI",
          to: "Contractor",
          subject: "Site handover notification",
          description: "Official notification of site handover completion. All clearances and permissions have been processed and are now available for project commencement.",
          assignee: "Site Engineer - Jane Smith",
          attachments: ["Site_Handover.pdf", "Clearance_Certificate.pdf", "Site_Survey.pdf"],
          priority: "medium",
          status: "overdue",
          contractDeadline: "2024-02-15",
          isOverdue: true,
          createdAt: "2024-02-15T10:00:00Z",
          updatedAt: "2024-02-20T16:45:00Z",
          createdBy: "jane.smith@nhai.gov.in",
          updatedBy: "jane.smith@nhai.gov.in"
        }
      ]
    },
    {
      id: 3,
      eventTitle: "Utility Shifting Delay Issues",
      from: "Contractor",
      to: "NHAI",
      date: "2024-03-10",
      letterNo: "ABC/LET/003",
      subject: "Intimation of delay due to utility shifting",
      description: "Formal intimation regarding project delay due to pending utility shifting requirements.",
      assignee: "Operations Head - Mike Johnson",
      attachments: ["Delay_Notice.pdf", "Utility_Report.pdf"],
      priority: "high",
      contractDeadline: "2024-03-05",
      isOverdue: true,
      status: "overdue",
      category: "technical",
      tags: ["delay", "utility", "shifting"],
      createdAt: "2024-03-05T11:00:00Z",
      updatedAt: "2024-03-10T13:20:00Z",
      createdBy: "mike.johnson@contractor.com",
      updatedBy: "mike.johnson@contractor.com",
      letters: []
    },
    {
      id: 4,
      eventTitle: "Utility Clearance Expedite",
      from: "NHAI",
      to: "Contractor",
      date: "2024-03-22",
      letterNo: "NHAI/LET/054",
      subject: "Instruction to expedite utility clearance",
      description: "Official instruction to expedite the utility clearance process to minimize project delays.",
      assignee: "Project Director - Sarah Wilson",
      attachments: ["Instructions.pdf", "Timeline_Revised.pdf"],
      priority: "urgent",
      contractDeadline: "2024-03-25",
      isOverdue: false,
      status: "in_progress",
      category: "administrative",
      tags: ["urgent", "utility", "clearance", "expedite"],
      createdAt: "2024-03-20T08:30:00Z",
      updatedAt: "2024-03-22T12:15:00Z",
      createdBy: "sarah.wilson@nhai.gov.in",
      updatedBy: "sarah.wilson@nhai.gov.in",
      letters: []
    },
    {
      id: 5,
      eventTitle: "Alternate Arrangements Implementation",
      from: "Contractor",
      to: "NHAI",
      date: "2024-03-29",
      letterNo: "ABC/LET/005",
      subject: "Alternate arrangements executed",
      description: "Alternate arrangements have been successfully executed to proceed with the project timeline.",
      assignee: "Site Supervisor - Tom Brown",
      attachments: ["Alternate_Plan.pdf", "Execution_Report.pdf"],
      priority: "medium",
      contractDeadline: "2024-04-01",
      isOverdue: false,
      status: "completed",
      category: "technical",
      tags: ["alternate", "execution", "plan"],
      createdAt: "2024-03-25T09:45:00Z",
      updatedAt: "2024-03-29T17:30:00Z",
      createdBy: "tom.brown@contractor.com",
      updatedBy: "tom.brown@contractor.com",
      letters: []
    },
    {
      id: 6,
      eventTitle: "Environmental Clearance Process",
      from: "NHAI",
      to: "Contractor",
      date: "2024-04-05",
      letterNo: "NHAI/LET/055",
      subject: "Environmental clearance documentation",
      description: "Request for submission of environmental clearance documentation as per project requirements.",
      assignee: "Environmental Officer - Lisa Chen",
      attachments: ["Environmental_Guidelines.pdf"],
      priority: "high",
      contractDeadline: "2024-04-10",
      isOverdue: false,
      status: "sent",
      category: "environmental",
      tags: ["environment", "clearance", "documentation"],
      createdAt: "2024-04-03T14:20:00Z",
      updatedAt: "2024-04-05T11:10:00Z",
      createdBy: "lisa.chen@nhai.gov.in",
      updatedBy: "lisa.chen@nhai.gov.in",
      letters: []
    }
  ]
};

// Mock Draft Data
const mockDrafts: Draft[] = [
  {
    id: 'draft-001',
    draftName: 'Response to Contract Clarification',
    description: 'Draft response to NHAI clarifications on technical specifications',
    subject: 'RE: Technical Clarification - Contract No. NH-456/2023',
    draftNumber: 'DRAFT/2023/001',
    letterInReference: 'NHAI/NH-456/TECH/2023/45',
    to: 'Project Director, NHAI',
    copyTo: ['Chief Engineer', 'Technical Manager'],
    status: 'In Draft',
    createdDate: '2023-11-15',
    lastModified: '2023-11-16',
    content: 'With reference to your letter dated 10th November 2023...',
    createdBy: 'john.doe@contractor.com'
  },
  {
    id: 'draft-002',
    draftName: 'Monthly Progress Report',
    description: 'Monthly progress report for October 2023',
    subject: 'Monthly Progress Report - October 2023',
    draftNumber: 'DRAFT/2023/002',
    letterInReference: 'CONTRACT/NH-456/2023',
    to: 'Project Director, NHAI',
    copyTo: ['Site Engineer', 'Quality Manager'],
    status: 'Sent for Review',
    createdDate: '2023-11-01',
    lastModified: '2023-11-05',
    content: 'Please find enclosed the monthly progress report...',
    createdBy: 'jane.smith@contractor.com'
  },
  {
    id: 'draft-003',
    draftName: 'Safety Compliance Update',
    description: 'Response to safety audit observations',
    subject: 'Safety Audit Compliance - Corrective Actions',
    draftNumber: 'DRAFT/2023/003',
    letterInReference: 'NHAI/SAFETY/2023/78',
    to: 'Safety Officer, NHAI',
    copyTo: ['Project Manager', 'HSE Manager'],
    status: 'Approved',
    createdDate: '2023-10-25',
    lastModified: '2023-11-10',
    content: 'In compliance with the safety audit recommendations...',
    createdBy: 'safety.officer@contractor.com'
  },
  {
    id: 'draft-004',
    draftName: 'Extension of Time Request',
    description: 'Request for extension of time due to weather conditions',
    subject: 'Request for Extension of Time - Weather Delays',
    draftNumber: 'DRAFT/2023/004',
    letterInReference: 'CONTRACT/NH-456/2023',
    to: 'Project Director, NHAI',
    copyTo: ['Executive Engineer', 'Contract Manager'],
    status: 'Sent to Authority',
    createdDate: '2023-10-15',
    lastModified: '2023-10-20',
    content: 'We request an extension of time for completion...',
    createdBy: 'project.manager@contractor.com'
  },
  {
    id: 'draft-005',
    draftName: 'Material Substitution Request',
    description: 'Request for approval of alternative materials',
    subject: 'Material Substitution Approval Request',
    draftNumber: 'DRAFT/2023/005',
    letterInReference: 'NHAI/TECH/2023/89',
    to: 'Chief Engineer, NHAI',
    copyTo: ['Quality Engineer', 'Technical Advisor'],
    status: 'Published',
    createdDate: '2023-09-20',
    lastModified: '2023-09-25',
    content: 'We request approval for substitution of materials...',
    createdBy: 'tech.manager@contractor.com'
  }
];

// Priority Badge Component
const PriorityBadge: React.FC<{ priority: Event['priority'] }> = ({ priority }) => {
  const colors = {
    urgent: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[priority]}`}>
      {priority.toUpperCase()}
    </span>
  );
};

// Overdue Badge Component
const OverdueBadge: React.FC<{ isOverdue: boolean }> = ({ isOverdue }) => {
  if (!isOverdue) return null;
  
  return (
    <div className="flex items-center space-x-1 text-red-600 text-xs">
      <AlertTriangle size={12} />
      <span className="font-medium">OVERDUE</span>
    </div>
  );
};

// Sequence Status Badge Component
const SequenceStatusBadge: React.FC<{ status: SequenceOfEvents['status'] }> = ({ status }) => {
  const colors = {
    not_started: 'bg-gray-100 text-gray-800 border-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    delayed: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const labels = {
    not_started: 'NOT STARTED',
    in_progress: 'IN PROGRESS',
    completed: 'COMPLETED',
    delayed: 'DELAYED'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
      {labels[status]}
    </span>
  );
};

// Summary Generation Modal Component
interface SummaryModalProps {
  letter: Letter | null;
  isOpen: boolean;
  onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ letter, isOpen, onClose }) => {
  const [wordCount, setWordCount] = useState(150);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');

  const handleGenerateSummary = async () => {
    if (!letter) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate dummy summary based on word count
    const baseSummary = `This letter from ${letter.from} to ${letter.to} (${letter.letterNo}) dated ${new Date(letter.date).toLocaleDateString()} addresses ${letter.subject.toLowerCase()}. ${letter.description}`;
    
    const words = baseSummary.split(' ');
    let summary = words.slice(0, Math.min(wordCount, words.length)).join(' ');
    
    if (words.length > wordCount) {
      summary += '...';
    }
    
    // Pad with additional context if needed
    if (words.length < wordCount) {
      summary += ` The correspondence involves key stakeholders and requires attention from ${letter.assignee}. Priority level is ${letter.priority} with status ${letter.status}. This communication is part of the ongoing project coordination between contractor and NHAI authorities.`;
      const finalWords = summary.split(' ');
      summary = finalWords.slice(0, wordCount).join(' ');
    }
    
    setGeneratedSummary(summary);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSummary);
  };

  if (!isOpen || !letter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Generate Summary</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Letter Reference */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Reference Letter:</h3>
            <p className="text-sm text-gray-600 mb-1">{letter.letterNo} - {letter.subject}</p>
            <p className="text-xs text-gray-500">From: {letter.from} | Date: {new Date(letter.date).toLocaleDateString()}</p>
          </div>
          
          {/* Word Count Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">Summary Length:</label>
              <span className="text-sm font-semibold text-blue-600">{wordCount} words</span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((wordCount - 50) / 450) * 100}%, #e5e7eb ${((wordCount - 50) / 450) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50</span>
                <span>150</span>
                <span>300</span>
                <span>500</span>
              </div>
            </div>
          </div>
          
          {/* Generate Button */}
          <div className="mb-6">
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
            >
              {isGenerating ? 'Generating Summary...' : 'Generate Summary'}
            </button>
          </div>
          
          {/* Generated Summary */}
          {(generatedSummary || isGenerating) && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Generated Summary:</h3>
              <div className="p-4 border rounded-lg bg-gray-50 min-h-[120px]">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Generating...</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{generatedSummary}</p>
                )}
              </div>
              
              {generatedSummary && !isGenerating && (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Copy Summary
                  </button>
                  <button
                    onClick={handleGenerateSummary}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// Letter Card Component - For individual letters within an event
interface LetterCardProps {
  letter: Letter;
  isExpanded: boolean;
  onToggle: () => void;
  side?: 'left' | 'right';
  onLetterClick?: ((letter: Letter) => void) | undefined;
  isSelected?: boolean;
  onGenerateSummary?: (letter: Letter) => void;
  onDraftLetter?: (letter: Letter) => void;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter, isExpanded, onToggle, side = 'right', onLetterClick, isSelected = false, onGenerateSummary, onDraftLetter }) => {
  const isContractor = letter.from === 'Contractor';
  const cardClass = side === 'left' ? 'mr-8' : 'ml-8';
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on action buttons
    if ((e.target as HTMLElement).closest('.action-buttons')) {
      return;
    }
    onToggle();
    if (onLetterClick) {
      onLetterClick(letter);
    }
  };
  
  return (
    <div className={`${cardClass} transition-all duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}`}>
      <div className={`bg-white rounded-lg shadow-md border-l-4 ${isContractor ? 'border-l-blue-500' : 'border-l-green-500'} p-4 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`} onClick={handleCardClick}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-sm">{letter.subject}</h3>
            <p className="text-xs text-gray-500 mt-1">{letter.letterNo}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <PriorityBadge priority={letter.priority} />
            <OverdueBadge isOverdue={letter.isOverdue || false} />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{new Date(letter.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User size={12} />
            <span className={`px-2 py-1 rounded ${isContractor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {letter.from}
            </span>
          </div>
        </div>
        
        {letter.contractDeadline && (
          <div className="text-xs text-gray-500 mb-2">
            Contract Deadline: {new Date(letter.contractDeadline).toLocaleDateString()}
          </div>
        )}
        
        {/* Always show description (truncated when collapsed) */}
        <div className="mt-2">
          <p className={`text-xs text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {letter.description}
          </p>
        </div>

        {/* Show assignee info */}
        <div className="mt-2 text-xs text-gray-500">
          <strong>Assignee:</strong> {letter.assignee}
        </div>

        {/* Attachments - Always visible */}
        {letter.attachments.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <FileText size={12} className="mr-1" />
              Attachments ({letter.attachments.length})
            </h4>
            <div className={`space-y-1 ${!isExpanded && letter.attachments.length > 2 ? 'max-h-12 overflow-hidden' : ''}`}>
              {letter.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Paperclip size={10} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate">{attachment}</span>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button 
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View file:', attachment);
                      }}
                    >
                      View
                    </button>
                    <button 
                      className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Download file:', attachment);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {!isExpanded && letter.attachments.length > 2 && (
              <p className="text-xs text-gray-500 mt-1">Click to see all {letter.attachments.length} attachments</p>
            )}
          </div>
        )}

        {/* Action Buttons - Always visible */}
        <div className="mt-4 pt-3 border-t border-gray-100 action-buttons">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateSummary?.(letter);
              }}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
              title="Generate summary of this letter"
            >
              Generate Summary
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDraftLetter?.(letter);
              }}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-xs font-medium hover:bg-green-700 transition-colors"
              title="Draft a response letter"
            >
              Draft Reply
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            {/* Additional details when expanded */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Status:</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  letter.status === 'completed' ? 'bg-green-100 text-green-800' :
                  letter.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  letter.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {letter.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
            </div>

            {(letter.createdAt || letter.updatedAt) && (
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                {letter.createdAt && <div>Created: {new Date(letter.createdAt).toLocaleString()}</div>}
                {letter.updatedAt && <div>Updated: {new Date(letter.updatedAt).toLocaleString()}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Event Card Component
interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
  side?: 'left' | 'right';
  onEventClick?: ((event: Event) => void) | undefined;
  isSelected?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isExpanded, onToggle, side = 'right', onEventClick, isSelected = false }) => {
  const isContractor = event.from === 'Contractor';
  const cardClass = side === 'left' ? 'mr-8' : 'ml-8';
  
  const handleCardClick = () => {
    onToggle();
    if (onEventClick) {
      onEventClick(event);
    }
  };
  
  return (
    <div className={`${cardClass} transition-all duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}`}>
      <div className={`bg-white rounded-lg shadow-md border-l-4 ${isContractor ? 'border-l-blue-500' : 'border-l-green-500'} p-4 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`} onClick={handleCardClick}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-sm">{event.subject}</h3>
            <p className="text-xs text-gray-500 mt-1">{event.letterNo}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <PriorityBadge priority={event.priority} />
            <OverdueBadge isOverdue={event.isOverdue || false} />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User size={12} />
            <span className={`px-2 py-1 rounded ${isContractor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {event.from}
            </span>
          </div>
        </div>
        
        {event.contractDeadline && (
          <div className="text-xs text-gray-500 mb-2">
            Contract Deadline: {new Date(event.contractDeadline).toLocaleDateString()}
          </div>
        )}
        
        {/* Always show description (truncated when collapsed) */}
        <div className="mt-2">
          <p className={`text-xs text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {event.description}
          </p>
        </div>

        {/* Show assignee info */}
        <div className="mt-2 text-xs text-gray-500">
          <strong>Assignee:</strong> {event.assignee}
        </div>

        {/* Attachments - Always visible */}
        {event.attachments.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <FileText size={12} className="mr-1" />
              Attachments ({event.attachments.length})
            </h4>
            <div className={`space-y-1 ${!isExpanded && event.attachments.length > 2 ? 'max-h-12 overflow-hidden' : ''}`}>
              {event.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Paperclip size={10} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate">{attachment}</span>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button 
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle file view/download
                        console.log('View file:', attachment);
                      }}
                    >
                      View
                    </button>
                    <button 
                      className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle file download
                        console.log('Download file:', attachment);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {!isExpanded && event.attachments.length > 2 && (
              <p className="text-xs text-gray-500 mt-1">Click to see all {event.attachments.length} attachments</p>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            {/* Additional details when expanded */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Status:</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  event.status === 'completed' ? 'bg-green-100 text-green-800' :
                  event.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  event.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Category:</h4>
                <span className="text-gray-600 capitalize">{event.category || 'General'}</span>
              </div>
            </div>
            
            {event.tags && event.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(event.createdAt || event.updatedAt) && (
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                {event.createdAt && <div>Created: {new Date(event.createdAt).toLocaleString()}</div>}
                {event.updatedAt && <div>Updated: {new Date(event.updatedAt).toLocaleString()}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Vertical Timeline Component
const VerticalTimeline: React.FC<{ onEventClick?: (event: Event) => void; selectedEvent?: Event | null; selectedSequence?: SequenceOfEvents | null; onLetterSelect?: (letter: Letter) => void; onGenerateSummary?: (letter: Letter) => void; onDraftLetter?: (letter: Letter) => void }> = ({ onEventClick, selectedEvent, selectedSequence, onLetterSelect, onGenerateSummary, onDraftLetter }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  const toggleCard = (letterId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [letterId]: !prev[letterId]
    }));
  };
  
  // Get letters to show - priority: sequence > event > all letters
  const lettersToShow: Letter[] = selectedSequence ? 
    getLettersForSequence(selectedSequence) : 
    selectedEvent ? 
      getAllLettersFromEvent(selectedEvent) : 
      mockData.events.flatMap(event => getAllLettersFromEvent(event)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div className="h-[calc(100vh-160px)] overflow-y-auto bg-white">
      <div className="relative max-w-6xl mx-auto py-8 px-8 min-h-full">
        {/* Central Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 top-8 bottom-8"></div>
        
        {/* Letters Timeline */}
        <div className="relative space-y-16">
          {lettersToShow.map((letter, index) => {
            const isLeft = index % 2 === 0; // Alternate sides
            const isContractor = letter.from === 'Contractor';
            
            return (
              <div key={letter.id} className="relative">
                {/* Central Radio Button - positioned exactly on the center line */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className={`w-4 h-4 rounded-full border-3 border-white shadow-lg ${isContractor ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                </div>
                
                <div className="flex items-center">
                  {/* Left Side */}
                  {isLeft ? (
                    <>
                      <div className="w-[calc(50%-80px)] pr-4">
                        <div className="ml-auto">
                          <LetterCard 
                            letter={letter} 
                            isExpanded={expandedCards[letter.id]}
                            onToggle={() => toggleCard(letter.id)}
                            side="right"
                            onLetterClick={onLetterSelect}
                            isSelected={false}
                            onGenerateSummary={onGenerateSummary}
                            onDraftLetter={onDraftLetter}
                          />
                        </div>
                      </div>
                      
                      {/* Connecting Line from card to center */}
                      <div className="w-[160px] flex items-center relative">
                        <div className={`w-[78px] h-0.5 ${isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}></div>
                        {/* Space for the radio button */}
                        <div className="w-4"></div>
                        <div className="w-[78px]"></div>
                      </div>
                      
                      <div className="w-[calc(50%-80px)]"></div>
                    </>
                  ) : (
                    <>
                      <div className="w-[calc(50%-80px)]"></div>
                      
                      {/* Connecting Line from center to card */}
                      <div className="w-[160px] flex items-center relative">
                        <div className="w-[78px]"></div>
                        {/* Space for the radio button */}
                        <div className="w-4"></div>
                        <div className={`w-[78px] h-0.5 ${isContractor ? 'bg-gradient-to-l from-blue-400 to-blue-600' : 'bg-gradient-to-l from-green-400 to-green-600'}`}></div>
                      </div>
                      
                      <div className="w-[calc(50%-80px)] pl-4">
                        <div className="mr-auto">
                          <LetterCard 
                            letter={letter} 
                            isExpanded={expandedCards[letter.id]}
                            onToggle={() => toggleCard(letter.id)}
                            side="left"
                            onLetterClick={onLetterSelect}
                            isSelected={false}
                            onGenerateSummary={onGenerateSummary}
                            onDraftLetter={onDraftLetter}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Horizontal Timeline Component - FIXED radio buttons on central line
const HorizontalTimeline: React.FC<{ onEventClick?: (event: Event) => void; selectedEvent?: Event | null; selectedSequence?: SequenceOfEvents | null; onLetterSelect?: (letter: Letter) => void; onGenerateSummary?: (letter: Letter) => void; onDraftLetter?: (letter: Letter) => void }> = ({ onEventClick, selectedEvent, selectedSequence, onLetterSelect, onGenerateSummary, onDraftLetter }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  const toggleCard = (letterId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [letterId]: !prev[letterId]
    }));
  };
  
  // Get letters to show - priority: sequence > event > all letters
  const lettersToShow: Letter[] = selectedSequence ? 
    getLettersForSequence(selectedSequence) : 
    selectedEvent ? 
      getAllLettersFromEvent(selectedEvent) : 
      mockData.events.flatMap(event => getAllLettersFromEvent(event)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const totalWidth = lettersToShow.length * 380;
  
  return (
    <div className="h-[calc(100vh-160px)] bg-white w-full overflow-hidden">
      {/* Horizontal scroll container - ONLY this scrolls */}
      <div className="h-full w-full overflow-x-auto overflow-y-hidden">
        <div className="relative h-full px-4 py-8" style={{ width: `${totalWidth}px` }}>
          {/* Central Horizontal Line */}
          <div 
            className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2 z-0"
            style={{ width: `${totalWidth - 64}px` }}
          ></div>
          
          {/* Timeline Letters Container */}
          <div className="relative h-full" style={{ width: `${totalWidth - 32}px` }}>
            {lettersToShow.map((letter, index) => {
              const isContractor = letter.from === 'Contractor';
              const leftPosition = index * 380 + 190; // Center position for each letter
              
              return (
                <div key={letter.id} className="absolute h-full" style={{ left: `${leftPosition}px`, transform: 'translateX(-50%)' }}>
                  
                  {/* Radio Button - EXACTLY on central line */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}>
                      <div className="w-full h-full rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Connecting Line from Radio Button to Top Card (Contractor) */}
                  {isContractor && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-0.5 bg-gradient-to-t from-blue-600 to-blue-400`} style={{ height: '120px', marginTop: '-120px' }}></div>
                    </div>
                  )}
                  
                  {/* Connecting Line from Radio Button to Bottom Card (NHAI) */}
                  {!isContractor && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-0.5 bg-gradient-to-b from-green-600 to-green-400`} style={{ height: '120px' }}></div>
                    </div>
                  )}
                  
                  {/* Top Card (Contractor Only) */}
                  {isContractor && (
                    <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '40px' }}>
                      <div className="w-72">
                        <LetterCard 
                          letter={letter} 
                          isExpanded={expandedCards[letter.id]}
                          onToggle={() => toggleCard(letter.id)}
                          onLetterClick={onLetterSelect}
                          isSelected={false}
                          onGenerateSummary={onGenerateSummary}
                          onDraftLetter={onDraftLetter}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom Card (NHAI Only) */}
                  {!isContractor && (
                    <div className="absolute left-1/2 transform -translate-x-1/2" style={{ bottom: '40px' }}>
                      <div className="w-72">
                        <LetterCard 
                          letter={letter} 
                          isExpanded={expandedCards[letter.id]}
                          onToggle={() => toggleCard(letter.id)}
                          onLetterClick={onLetterSelect}
                          isSelected={false}
                          onGenerateSummary={onGenerateSummary}
                          onDraftLetter={onDraftLetter}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


// Table View Component - PROPERLY CONTAINED
const TableView: React.FC<{ onEventClick?: (event: Event) => void; selectedEvent?: Event | null; selectedSequence?: SequenceOfEvents | null; onLetterSelect?: (letter: Letter) => void; onGenerateSummary?: (letter: Letter) => void; onDraftLetter?: (letter: Letter) => void }> = ({ onEventClick, selectedEvent, selectedSequence, onLetterSelect, onGenerateSummary, onDraftLetter }) => {
  // Get letters to show - priority: sequence > event > all letters
  const lettersToShow: Letter[] = selectedSequence ? 
    getLettersForSequence(selectedSequence) : 
    selectedEvent ? 
      getAllLettersFromEvent(selectedEvent) : 
      mockData.events.flatMap(event => getAllLettersFromEvent(event)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // State for selected letters
  const [selectedLetters, setSelectedLetters] = React.useState<Set<string>>(new Set());
  
  // Handle checkbox changes
  const handleCheckboxChange = (letterId: string, checked: boolean) => {
    const newSelectedLetters = new Set(selectedLetters);
    if (checked) {
      newSelectedLetters.add(letterId);
    } else {
      newSelectedLetters.delete(letterId);
    }
    setSelectedLetters(newSelectedLetters);
  };
  
  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLetters(new Set(lettersToShow.map(letter => letter.id)));
    } else {
      setSelectedLetters(new Set());
    }
  };
  
  // Handle draft letter with selected references
  const handleDraftWithSelected = () => {
    if (selectedLetters.size === 0) return;
    
    const selectedLetterObjects = lettersToShow.filter(letter => selectedLetters.has(letter.id));
    // Create a composite object with selected letters as references
    const compositeReference = {
      id: 'composite-' + Date.now(),
      from: 'User',
      to: 'Recipient',
      date: new Date().toISOString(),
      letterNo: `DRAFT-${Date.now()}`,
      subject: `Draft with ${selectedLetters.size} reference(s)`,
      description: `Draft letter referencing ${selectedLetters.size} selected letter(s)`,
      priority: 'Medium' as const,
      isOverdue: false,
      assignee: 'Current User',
      attachments: [],
      references: selectedLetterObjects
    };
    
    onDraftLetter?.(compositeReference);
  };
  
  return (
    <div className="h-[calc(100vh-160px)] overflow-auto p-4 w-full max-w-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        {(selectedEvent || selectedSequence) && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">
              {selectedSequence ? `Letters for Sequence: ${selectedSequence.sequenceTitle}` : 
               selectedEvent ? `Letters for: ${selectedEvent.eventTitle}` : 'All Letters'}
            </h3>
            <p className="text-xs text-blue-600">
              Showing {lettersToShow.length} letter{lettersToShow.length !== 1 ? 's' : ''} in chronological order
              {selectedSequence && ` from ${selectedSequence.phase}`}
            </p>
          </div>
        )}
        {selectedLetters.size > 0 && (
          <div className="p-4 bg-yellow-50 border-b border-yellow-200 flex justify-between items-center">
            <div className="text-sm text-yellow-800">
              <span className="font-semibold">{selectedLetters.size}</span> letter{selectedLetters.size !== 1 ? 's' : ''} selected
            </div>
            <button
              onClick={handleDraftWithSelected}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>Draft Letter with Selected References</span>
            </button>
          </div>
        )}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedLetters.size === lettersToShow.length && lettersToShow.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lettersToShow.map((letter, index) => (
                <tr key={letter.id} className="cursor-pointer hover:bg-gray-50" onClick={() => {}}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLetters.has(letter.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(letter.id, e.target.checked);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${letter.from === 'Contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {letter.from}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${letter.to === 'Contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {letter.to}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(letter.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{letter.letterNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={letter.subject}>
                    {letter.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-sm">
                    <div className="truncate" title={letter.description}>
                      {letter.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={letter.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OverdueBadge isOverdue={letter.isOverdue || false} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{letter.assignee}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <FileText size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {letter.attachments.length} file{letter.attachments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateSummary?.(letter);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                        title="Generate Summary"
                      >
                        Summary
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDraftLetter?.(letter);
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                        title="Draft Reply Letter"
                      >
                        Draft
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Notification Management Component
const NotificationPanel: React.FC <{
  overdueEvents: Event[];
  onDismiss: () => void;
  onMinimize: () => void;
  onDraftLetters: () => void;
  isMinimized: boolean;
}> = ({ overdueEvents, onDismiss, onMinimize, onDraftLetters, isMinimized }) => {
  if (overdueEvents.length === 0) return null;

  if (isMinimized) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-2 max-w-xs cursor-pointer" onClick={onMinimize}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-700">
            <Bell size={14} />
            <span className="font-semibold text-xs">{overdueEvents.length} Overdue</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-red-700">
          <Bell size={16} />
          <span className="font-semibold text-sm">Action Required</span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={onMinimize}
            className="text-red-500 hover:text-red-700 text-sm p-1"
            title="Minimize"
          >
            −
          </button>
          <button 
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 text-sm p-1"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
      <p className="text-xs text-red-600 mb-2">
        {overdueEvents.length} event(s) are overdue. Consider drafting follow-up letters to authorities.
      </p>
      <div className="text-xs text-red-500 mb-2">
        Overdue items: {overdueEvents.map(e => e.letterNo).join(', ')}
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={onDraftLetters}
          className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Draft Letters
        </button>
        <button 
          onClick={onDismiss}
          className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
        >
          Dismiss for now
        </button>
      </div>
    </div>
  );
};

// Main Timeline Dashboard - MODIFIED with Notification Management
const TimelineDashboard: React.FC<{ selectedEvent: Event | null; selectedSequence: SequenceOfEvents | null; onEventClick?: (event: Event) => void; onGenerateSummary?: (letter: Letter) => void; onDraftLetter?: (letter: Letter) => void }> = ({ selectedEvent, selectedSequence, onEventClick, onGenerateSummary, onDraftLetter }) => {
  const [activeView, setActiveView] = useState<ViewType>('vertical');
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [notificationMinimized, setNotificationMinimized] = useState(false);
  
  // Get related letters for context - priority: sequence > event
  const relatedLetters = selectedSequence ? 
    getLettersForSequence(selectedSequence) : 
    selectedEvent ? getAllLettersFromEvent(selectedEvent) : [];
  
  const views: Array<{ id: ViewType; label: string; component: React.ComponentType<{ onEventClick?: (event: Event) => void; selectedEvent?: Event | null; selectedSequence?: SequenceOfEvents | null; onGenerateSummary?: (letter: Letter) => void; onDraftLetter?: (letter: Letter) => void }> }> = [
    { id: 'vertical', label: 'Vertical Timeline', component: VerticalTimeline },
    { id: 'horizontal', label: 'Horizontal Timeline', component: HorizontalTimeline },
    { id: 'table', label: 'Table View', component: TableView }
  ];
  
  const ActiveComponent = views.find(view => view.id === activeView)?.component || VerticalTimeline;
  
  // Calculate overdue events for nudges
  const overdueEvents = mockData.events.filter(event => event.isOverdue);
  
  const handleDismissNotification = () => {
    setNotificationDismissed(true);
  };

  const handleMinimizeNotification = () => {
    setNotificationMinimized(!notificationMinimized);
  };

  const handleDraftLetters = () => {
    // Navigate to drafting tool or show modal
    console.log('Navigate to drafting tool for overdue events:', overdueEvents);
    // You can add navigation logic here
  };
  
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden max-w-full">
      <div className="p-3 max-w-full overflow-x-hidden">
        <div className="mb-3">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-shrink">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {selectedSequence ? 'Sequence Letters & Communications' : 
                 selectedEvent ? 'Related Letters & Communications' : 'Sequence of Events'}
              </h1>
              {selectedSequence && (
                <div className="mb-4">
                  <p className="text-blue-600 text-sm font-medium mb-1">
                    Selected Sequence: {selectedSequence.sequenceTitle}
                  </p>
                  <p className="text-gray-600 text-xs mb-2">
                    Phase: {selectedSequence.phase} | Category: {selectedSequence.category}
                  </p>
                  <p className="text-green-600 text-sm">
                    Showing {relatedLetters.length} letter{relatedLetters.length !== 1 ? 's' : ''} from this sequence
                  </p>
                </div>
              )}
              {selectedEvent && !selectedSequence && (
                <div className="mb-4">
                  <p className="text-blue-600 text-sm font-medium mb-1">
                    Selected Event: {selectedEvent.eventTitle}
                  </p>
                  <p className="text-gray-600 text-xs mb-2">
                    Event Category: {selectedEvent.category} | Main Letter: {selectedEvent.letterNo}
                  </p>
                  <p className="text-green-600 text-sm">
                    Showing {relatedLetters.length} letter{relatedLetters.length !== 1 ? 's' : ''} in chronological sequence
                  </p>
                </div>
              )}
              {!selectedEvent && !selectedSequence && <p className="text-gray-600 text-sm mb-4">Communication between Contractor and Authority (NHAI)</p>}
              {/* Search Bar with Ask AI option */}
              <div className="flex items-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200 max-w-2xl ml-auto">
                <input
                  type="text"
                  placeholder="Search events or ask AI..."
                  className="flex-1 px-6 py-3 rounded-l-full focus:outline-none text-gray-700 text-lg"
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition-colors text-lg font-medium">
                  Ask AI
                </button>
              </div>
            </div>
            
            {/* Enhanced Notification Panel */}
            {!notificationDismissed && (
              <div className="flex-shrink-0 ml-4">
                <NotificationPanel
                  overdueEvents={overdueEvents}
                  onDismiss={handleDismissNotification}
                  onMinimize={handleMinimizeNotification}
                  onDraftLetters={handleDraftLetters}
                  isMinimized={notificationMinimized}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* View Pills */}
        <div className="mb-3">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeView === view.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Active View */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full max-w-full">
          <ActiveComponent 
            onEventClick={onEventClick ?? (() => {})} 
            selectedEvent={selectedEvent} 
            selectedSequence={selectedSequence}
            onGenerateSummary={onGenerateSummary}
            onDraftLetter={onDraftLetter}
          />
        </div>
      </div>
    </div>
  );
};
// Dashboard Component
const Dashboard: React.FC<{ onNavigate: (page: PageType) => void; onEventClick: (event: Event) => void; onSequenceClick: (sequence: SequenceOfEvents) => void; }> = ({ onNavigate, onEventClick, onSequenceClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter sequences based on search term
  const filteredSequences = sequenceOfEventsData.sequences.filter(sequence =>
    sequence.sequenceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sequence.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sequence.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sequence.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Sequences', value: sequenceOfEventsData.sequences.length, color: 'blue' },
    { label: 'Completed', value: sequenceOfEventsData.sequences.filter(s => s.status === 'completed').length, color: 'green' },
    { label: 'In Progress', value: sequenceOfEventsData.sequences.filter(s => s.status === 'in_progress').length, color: 'yellow' },
    { label: 'Not Started', value: sequenceOfEventsData.sequences.filter(s => s.status === 'not_started').length, color: 'gray' },
    { label: 'High Priority', value: sequenceOfEventsData.sequences.filter(s => s.priority === 'high' || s.priority === 'urgent').length, color: 'red' },
    { label: 'Delayed', value: sequenceOfEventsData.sequences.filter(s => s.status === 'delayed').length, color: 'orange' }
  ];
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Project Sequence Dashboard</h1>
        <p className="text-gray-600">Track project milestones and sequence of events from pre-contract to closure</p>
      </div>
      
      {/* Stats Grid - Multi-column layout with less space */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <div className={`text-xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</div>
            <div className="text-gray-600 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions as Pills */}
      <div className="mb-8 flex space-x-2">
        <button 
          onClick={() => onNavigate('timeline')}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Timeline
        </button>
        
        <button 
          onClick={() => onNavigate('table')}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Table View
        </button>
        
        <button 
          onClick={() => onNavigate('drafting')}
          className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          Drafting Tool
        </button>
        
        <button 
          onClick={() => onNavigate('draft-management')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Draft Management
        </button>
      </div>
      
      {/* Sequence Of Events with Search */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Sequence Of Events</h2>
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200 max-w-2xl">
            <input
              type="text"
              placeholder="Search sequences, phases, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-6 py-3 rounded-l-full focus:outline-none text-gray-700 text-lg"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition-colors text-lg font-medium">
              Search
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <SequenceTable data={filteredSequences} onSequenceClick={onSequenceClick} />
        </div>
      </div>
    </div>
  );
};

// Define columns for the EventTable
interface ColumnConfig<T> {
  key: keyof T | 'actions';
  header: string;
  render?: (item: T) => React.ReactNode;
}

const eventColumns: ColumnConfig<Event>[] = [
  { key: 'id', header: 'ID' },
  { key: 'from', header: 'From' },
  { key: 'to', header: 'To' },
  { key: 'date', header: 'Date', render: (event) => new Date(event.date).toLocaleDateString() },
  { key: 'letterNo', header: 'Letter No.' },
  { key: 'subject', header: 'Subject' },
  { key: 'priority', header: 'Priority', render: (event) => <PriorityBadge priority={event.priority} /> },
  { key: 'isOverdue', header: 'Overdue', render: (event) => <OverdueBadge isOverdue={event.isOverdue || false} /> },
  { key: 'assignee', header: 'Assignee' },
];

// Generic Table Component
interface EventTableProps {
  data: Event[];
  columns?: ColumnConfig<Event>[];
  onEventClick?: (event: Event) => void;
}

const EventTable: React.FC<EventTableProps> = ({ data, columns = eventColumns, onEventClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} onClick={() => onEventClick?.(item)} className="cursor-pointer">
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                {column.render ? column.render(item) : String(item[column.key as keyof Event])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Sequence Table Component
interface SequenceTableProps {
  data: SequenceOfEvents[];
  onSequenceClick?: (sequence: SequenceOfEvents) => void;
}

const SequenceTable: React.FC<SequenceTableProps> = ({ data, onSequenceClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.No</TableHead>
          <TableHead>Sequence</TableHead>
          <TableHead>Phase</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Target Date</TableHead>
          <TableHead>Key Documents</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((sequence, index) => (
          <TableRow 
            key={sequence.id} 
            onClick={() => onSequenceClick?.(sequence)} 
            className="cursor-pointer hover:bg-gray-50"
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">
              <div className="max-w-xs truncate" title={sequence.sequenceTitle}>
                {sequence.sequenceTitle}
              </div>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-xs ${
                sequence.phase === 'Pre-Contract Phase' ? 'bg-purple-100 text-purple-800' :
                sequence.phase === 'Contract Execution Phase' ? 'bg-blue-100 text-blue-800' :
                sequence.phase === 'Operational Phase' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {sequence.phase}
              </span>
            </TableCell>
            <TableCell>{sequence.category}</TableCell>
            <TableCell>
              <div className="max-w-sm truncate text-sm" title={sequence.description}>
                {sequence.description}
              </div>
            </TableCell>
            <TableCell>
              <SequenceStatusBadge status={sequence.status} />
            </TableCell>
            <TableCell>
              <PriorityBadge priority={sequence.priority} />
            </TableCell>
            <TableCell className="text-sm">{sequence.expectedDuration}</TableCell>
            <TableCell className="text-sm">
              {sequence.targetDate ? new Date(sequence.targetDate).toLocaleDateString() : '-'}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <FileText size={14} className="text-gray-400" />
                <span className="text-xs text-gray-600">
                  {sequence.keyDocuments.length} doc{sequence.keyDocuments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


// Drafting Tool Component (Simple version for demonstration)
const DraftingTool: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [letterContent, setLetterContent] = useState('');
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    const referenceText = `\n\nReference: ${event.letterNo} dated ${new Date(event.date).toLocaleDateString()}\nSubject: ${event.subject}\n\n`;
    setLetterContent(prev => prev + referenceText);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Letter Drafting Tool</h1>
        <p className="text-gray-600">Create new communications based on timeline events</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Reference */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Timeline Reference</h2>
          <div className="h-96 overflow-y-auto">
            <div className="relative max-w-4xl mx-auto p-4">
              {/* Embedded Vertical Timeline */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-green-400 h-full"></div>
              
              <div className="space-y-6">
                {mockData.events.map((event) => {
                  const isContractor = event.from === 'Contractor';
                  
                  return (
                    <div key={event.id} className="relative flex items-center">
                      {/* Left Side Event (Contractor Only) */}
                      {isContractor && (
                        <div className="w-1/2 pr-4">
                          <div className="mr-4 transition-all duration-300 hover:shadow-lg">
                            <div className={`bg-white rounded-lg shadow-md border-l-4 border-l-blue-500 p-3 cursor-pointer`} onClick={() => handleEventClick(event)}>
                              <h3 className="font-bold text-gray-800 text-xs">{event.subject}</h3>
                              <p className="text-xs text-gray-500 mt-1">{event.letterNo}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                                <Calendar size={10} />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {isContractor && <div className="w-1/2"></div>}
                      
                      {/* Central Milestone */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}>
                          <div className="w-full h-full rounded-full animate-pulse"></div>
                        </div>
                        
                        <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-0.5 ${isContractor ? 'right-4 bg-gradient-to-l' : 'left-4 bg-gradient-to-r'} ${isContractor ? 'from-blue-400 to-blue-600' : 'from-green-400 to-green-600'} animate-pulse`}></div>
                      </div>
                      
                      {/* Right Side Event (NHAI/Authority Only) */}
                      {!isContractor && (
                        <>
                          <div className="w-1/2"></div>
                          <div className="w-1/2 pl-4">
                            <div className="ml-4 transition-all duration-300 hover:shadow-lg">
                              <div className={`bg-white rounded-lg shadow-md border-l-4 border-l-green-500 p-3 cursor-pointer`} onClick={() => handleEventClick(event)}>
                                <h3 className="font-bold text-gray-800 text-xs">{event.subject}</h3>
                                <p className="text-xs text-gray-500 mt-1">{event.letterNo}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                                  <Calendar size={10} />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Drafting Area */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Draft Letter</h2>
          {selectedEvent && (
            <div className="mb-4 p-3 bg-blue-50 rounded border">
              <p className="text-sm text-blue-700">
                Drafting in reference to: <strong>{selectedEvent.subject}</strong>
              </p>
              <p className="text-xs text-blue-600">Letter No: {selectedEvent.letterNo}</p>
            </div>
          )}
          <textarea 
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className="w-full h-64 border border-gray-300 rounded p-3 text-sm"
            placeholder="Start drafting your letter here..."
          />
          <div className="mt-4 flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Draft
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Send Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Top Navigation Component
const TopNavigation: React.FC<{ currentPage: PageType; onNavigate: (page: PageType) => void }> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Project Communication Hub</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`hover:text-blue-200 transition-colors ${currentPage === 'dashboard' ? 'text-blue-200' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('timeline')}
            className={`hover:text-blue-200 transition-colors ${currentPage === 'timeline' ? 'text-blue-200' : ''}`}
          >
            Timeline
          </button>
          <button 
            onClick={() => onNavigate('table')}
            className={`hover:text-blue-200 transition-colors ${currentPage === 'table' ? 'text-blue-200' : ''}`}
          >
            Table
          </button>
          <button 
            onClick={() => onNavigate('drafting')}
            className={`hover:text-blue-200 transition-colors ${currentPage === 'drafting' ? 'text-blue-200' : ''}`}
          >
            Drafting
          </button>
        </div>
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <button onClick={() => onNavigate('dashboard')} className="block py-2 hover:text-blue-200">Dashboard</button>
          <button onClick={() => onNavigate('timeline')} className="block py-2 hover:text-blue-200">Timeline</button>
          <button onClick={() => onNavigate('table')} className="block py-2 hover:text-blue-200">Table</button>
          <button onClick={() => onNavigate('drafting')} className="block py-2 hover:text-blue-200">Drafting</button>
        </div>
      )}
    </nav>
  );
};



// Draft Management Component
interface DraftManagementProps {
  onNavigate?: (page: PageType) => void;
  onEditDraft?: (draftId: string) => void;
}

const DraftManagement: React.FC<DraftManagementProps> = ({ onNavigate, onEditDraft }) => {
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter drafts based on search
  const filteredDrafts = drafts.filter(draft =>
    draft.draftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.draftNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusUpdate = (draftId: string, newStatus: Draft['status']) => {
    setDrafts(prevDrafts =>
      prevDrafts.map(draft =>
        draft.id === draftId
          ? { ...draft, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
          : draft
      )
    );
  };

  const getStatusBadgeColor = (status: Draft['status']) => {
    const colors = {
      'In Draft': 'bg-gray-100 text-gray-800',
      'Published': 'bg-blue-100 text-blue-800',
      'Sent for Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Sent to Authority': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusOptions = (currentStatus: Draft['status']): Draft['status'][] => {
    const statusFlow: Record<Draft['status'], Draft['status'][]> = {
      'In Draft': ['In Draft', 'Sent for Review', 'Published'],
      'Sent for Review': ['Sent for Review', 'In Draft', 'Approved'],
      'Approved': ['Approved', 'Published', 'Sent to Authority'],
      'Published': ['Published', 'In Draft', 'Sent to Authority'],
      'Sent to Authority': ['Sent to Authority', 'In Draft']
    };
    return statusFlow[currentStatus] || [currentStatus];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Draft Management</h1>
            <button
              onClick={() => onNavigate?.('drafting')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Draft
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Drafts Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Draft Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Draft Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{draft.draftName}</div>
                      <div className="text-xs text-gray-500">Created: {new Date(draft.createdDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={draft.description}>
                        {draft.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={draft.subject}>
                        {draft.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {draft.draftNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {draft.letterInReference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {draft.to}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {draft.copyTo.length > 0 ? draft.copyTo.join(', ') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={draft.status}
                        onChange={(e) => handleStatusUpdate(draft.id, e.target.value as Draft['status'])}
                        className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusBadgeColor(draft.status)}`}
                      >
                        {getStatusOptions(draft.status).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditDraft?.(draft.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {/* Handle view */}}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDrafts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery ? 'No drafts found matching your search.' : 'No drafts available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSequence, setSelectedSequence] = useState<SequenceOfEvents | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSequence(null); // Clear sequence when selecting event
    setCurrentPage('timeline');
  };

  const handleSequenceClick = (sequence: SequenceOfEvents) => {
    setSelectedSequence(sequence);
    setSelectedEvent(null); // Clear event when selecting sequence
    setCurrentPage('timeline');
  };

  const handleLetterSelect = (letter: Letter) => {
    setSelectedLetter(letter);
  };

  const handleGenerateSummary = (letter: Letter) => {
    setSelectedLetter(letter);
    setShowSummaryModal(true);
  };

  const handleDraftLetter = (letter: Letter) => {
    setSelectedLetter(letter);
    setCurrentPage('drafting'); // Navigate to drafting page with Editor
  };

  const handleEditDraft = (draftId: string) => {
    const draft = mockDrafts.find(d => d.id === draftId);
    if (draft) {
      setSelectedDraft(draft);
      setCurrentPage('drafting'); // Navigate to Editor with draft content
    }
  };
  
  // Get all available letters for references
  const getAllAvailableLetters = (): Letter[] => {
    return mockData.events.flatMap(event => getAllLettersFromEvent(event)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} onEventClick={handleEventClick} onSequenceClick={handleSequenceClick} />;
      case 'timeline':
        return <TimelineDashboard selectedEvent={selectedEvent} selectedSequence={selectedSequence} onEventClick={handleEventClick} onGenerateSummary={handleGenerateSummary} onDraftLetter={handleDraftLetter} />;
      case 'table':
        return <TableView onEventClick={handleEventClick} selectedEvent={selectedEvent} selectedSequence={selectedSequence} onGenerateSummary={handleGenerateSummary} onDraftLetter={handleDraftLetter} />; 
      case 'drafting':
        return <Editor onNavigate={handleNavigate} onClose={() => setCurrentPage('draft-management')} referenceLetter={selectedLetter} availableLetters={getAllAvailableLetters()} selectedDraft={selectedDraft} />;
      case 'draft-management':
        return <DraftManagement onNavigate={handleNavigate} onEditDraft={handleEditDraft} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onEventClick={handleEventClick} onSequenceClick={handleSequenceClick} />;
    } 
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {renderCurrentPage()}
      </main>
      
      {/* Modals */}
      <SummaryModal 
        letter={selectedLetter} 
        isOpen={showSummaryModal} 
        onClose={() => setShowSummaryModal(false)} 
      />
    </div>
  );
};

export default App;
