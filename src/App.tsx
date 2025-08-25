// src/App.tsx
/**
 * Main Application Component for Timeline Communication App
 * Handles routing, navigation, and main layout
 */

import { AlertTriangle, Bell, Calendar, Clock, FileText, Home, Menu, Paperclip, Table, User } from 'lucide-react';
import React, { useState } from 'react';

// Types
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

export type ViewType = 'vertical' | 'horizontal' | 'table';
export type PageType = 'dashboard' | 'timeline' | 'table' | 'drafting';

// Mock JSON Data with contract deadlines and overdue scenarios
const mockData: { events: Event[] } = {
  events: [
    {
      id: 1,
      from: "Contractor",
      to: "NHAI",
      date: "2024-01-15",
      letterNo: "ABC/LET/001",
      subject: "Award of contract and LOA issuance",
      description: "Official award of contract and Letter of Acceptance issuance. We may ask to provide the length of contents, e.g 250 words etc.",
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
      updatedBy: "john.doe@contractor.com"
    },
    {
      id: 2,
      from: "NHAI",
      to: "Contractor",
      date: "2024-02-20",
      letterNo: "ABC/LET/002",
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
      updatedBy: "jane.smith@nhai.gov.in"
    },
    {
      id: 3,
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
      updatedBy: "mike.johnson@contractor.com"
    },
    {
      id: 4,
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
      updatedBy: "sarah.wilson@nhai.gov.in"
    },
    {
      id: 5,
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
      updatedBy: "tom.brown@contractor.com"
    },
    {
      id: 6,
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
      updatedBy: "lisa.chen@nhai.gov.in"
    }
  ]
};

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

// Event Card Component
interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
  side?: 'left' | 'right';
  onEventClick?: ((event: Event) => void) | undefined;
}

const EventCard: React.FC<EventCardProps> = ({ event, isExpanded, onToggle, side = 'right', onEventClick }) => {
  const isContractor = event.from === 'Contractor';
  const cardClass = side === 'left' ? 'mr-8' : 'ml-8';
  
  const handleCardClick = () => {
    onToggle();
    if (onEventClick) {
      onEventClick(event);
    }
  };
  
  return (
    <div className={`${cardClass} transition-all duration-300 hover:shadow-lg`}>
      <div className={`bg-white rounded-lg shadow-md border-l-4 ${
        isContractor ? 'border-l-blue-500' : 'border-l-green-500'
      } p-4 cursor-pointer`} onClick={handleCardClick}>
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
            <span className={`px-2 py-1 rounded ${
              isContractor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {event.from}
            </span>
          </div>
        </div>
        
        {event.contractDeadline && (
          <div className="text-xs text-gray-500 mb-2">
            Contract Deadline: {new Date(event.contractDeadline).toLocaleDateString()}
          </div>
        )}
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Description:</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Assignee:</h4>
              <p className="text-xs text-gray-600">{event.assignee}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Attachments:</h4>
              <div className="space-y-1">
                {event.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <Paperclip size={10} className="text-gray-400" />
                    <span className="text-blue-600 hover:underline cursor-pointer">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Vertical Timeline Component
const VerticalTimeline: React.FC<{ onEventClick?: (event: Event) => void }> = ({ onEventClick }) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  
  const toggleCard = (eventId: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };
  
  return (
    <div className="h-[calc(100vh-160px)] overflow-y-auto bg-white">
      <div className="relative max-w-6xl mx-auto py-8 px-8 min-h-full">
        {/* Central Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 top-8 bottom-8"></div>
        
        {/* Events */}
        <div className="relative space-y-16">
          {mockData.events.map((event, index) => {
            const isLeft = index % 2 === 0; // Alternate sides
            const isContractor = event.from === 'Contractor';
            
            return (
              <div key={event.id} className="relative">
                {/* Central Radio Button - positioned exactly on the center line */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className={`w-4 h-4 rounded-full border-3 border-white shadow-lg ${
                    isContractor ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                </div>
                
                <div className="flex items-center">
                  {/* Left Side */}
                  {isLeft ? (
                    <>
                      <div className="w-[calc(50%-80px)] pr-4">
                        <div className="ml-auto">
                          <EventCard 
                            event={event} 
                            isExpanded={expandedCards[event.id]}
                            onToggle={() => toggleCard(event.id)}
                            side="right"
                            onEventClick={onEventClick}
                          />
                        </div>
                      </div>
                      
                      {/* Connecting Line from card to center */}
                      <div className="w-[160px] flex items-center relative">
                        <div className={`w-[78px] h-0.5 ${
                          isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                        }`}></div>
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
                        <div className={`w-[78px] h-0.5 ${
                          isContractor ? 'bg-gradient-to-l from-blue-400 to-blue-600' : 'bg-gradient-to-l from-green-400 to-green-600'
                        }`}></div>
                      </div>
                      
                      <div className="w-[calc(50%-80px)] pl-4">
                        <div className="mr-auto">
                          <EventCard 
                            event={event} 
                            isExpanded={expandedCards[event.id]}
                            onToggle={() => toggleCard(event.id)}
                            side="left"
                            onEventClick={onEventClick}
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
const HorizontalTimeline: React.FC<{ onEventClick?: (event: Event) => void }> = ({ onEventClick }) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  
  const toggleCard = (eventId: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };
  
  const totalWidth = mockData.events.length * 380;
  
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
          
          {/* Timeline Events Container */}
          <div className="relative h-full" style={{ width: `${totalWidth - 32}px` }}>
            {mockData.events.map((event, index) => {
              const isContractor = event.from === 'Contractor';
              const leftPosition = index * 380 + 190; // Center position for each event
              
              return (
                <div key={event.id} className="absolute h-full" style={{ left: `${leftPosition}px`, transform: 'translateX(-50%)' }}>
                  
                  {/* Radio Button - EXACTLY on central line */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                      isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                    }`}>
                      <div className="w-full h-full rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Connecting Line from Radio Button to Top Card (Contractor) */}
                  {isContractor && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-0.5 bg-gradient-to-t from-blue-600 to-blue-400`}
                           style={{ height: '120px', marginTop: '-120px' }}></div>
                    </div>
                  )}
                  
                  {/* Connecting Line from Radio Button to Bottom Card (NHAI) */}
                  {!isContractor && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-0.5 bg-gradient-to-b from-green-600 to-green-400`}
                           style={{ height: '120px' }}></div>
                    </div>
                  )}
                  
                  {/* Top Card (Contractor Only) */}
                  {isContractor && (
                    <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '40px' }}>
                      <div className="w-72">
                        <EventCard 
                          event={event} 
                          isExpanded={expandedCards[event.id]}
                          onToggle={() => toggleCard(event.id)}
                          onEventClick={onEventClick}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom Card (NHAI Only) */}
                  {!isContractor && (
                    <div className="absolute left-1/2 transform -translate-x-1/2" style={{ bottom: '40px' }}>
                      <div className="w-72">
                        <EventCard 
                          event={event} 
                          isExpanded={expandedCards[event.id]}
                          onToggle={() => toggleCard(event.id)}
                          onEventClick={onEventClick}
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
const TableView: React.FC<{ onEventClick?: (event: Event) => void }> = ({ onEventClick }) => {
  return (
    <div className="h-[calc(100vh-160px)] overflow-auto p-4 w-full max-w-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.events.map((event, index) => (
                <tr key={event.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onEventClick?.(event)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      event.from === 'Contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {event.from}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      event.to === 'Contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {event.to}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.letterNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={event.subject}>
                    {event.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={event.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OverdueBadge isOverdue={event.isOverdue || false} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.assignee}</td>
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
const NotificationPanel: React.FC<{
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
const TimelineDashboard: React.FC<{ onEventClick?: (event: Event) => void }> = ({ onEventClick }) => {
  const [activeView, setActiveView] = useState<ViewType>('vertical');
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [notificationMinimized, setNotificationMinimized] = useState(false);
  
  const views: Array<{ id: ViewType; label: string; component: React.ComponentType<{ onEventClick?: (event: Event) => void }> }> = [
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
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Sequence of Events</h1>
              <p className="text-gray-600 text-sm">Communication between Contractor and Authority (NHAI)</p>
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
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeView === view.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Active View */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full max-w-full">
          <ActiveComponent onEventClick={onEventClick ?? (() => {})} />
        </div>
      </div>
    </div>
  );
};
// Dashboard Component
const Dashboard: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const stats = [
    { label: 'Total Events', value: mockData.events.length, color: 'blue' },
    { label: 'Contractor Events', value: mockData.events.filter(e => e.from === 'Contractor').length, color: 'green' },
    { label: 'NHAI Events', value: mockData.events.filter(e => e.from === 'NHAI').length, color: 'purple' },
    { label: 'Urgent Priority', value: mockData.events.filter(e => e.priority === 'urgent').length, color: 'red' },
    { label: 'Overdue Events', value: mockData.events.filter(e => e.isOverdue).length, color: 'orange' },
    { label: 'Completed', value: mockData.events.filter(e => e.status === 'completed').length, color: 'green' }
  ];
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Project Communication Dashboard</h1>
        <p className="text-gray-600">Overview of communication between Contractor and NHAI</p>
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
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => onNavigate('timeline')}
          className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
        >
          <Clock className="text-blue-600 mb-4" size={32} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">View Timeline</h3>
          <p className="text-gray-600 text-sm">Explore events in timeline format</p>
        </button>
        
        <button 
          onClick={() => onNavigate('table')}
          className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
        >
          <Table className="text-green-600 mb-4" size={32} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Table View</h3>
          <p className="text-gray-600 text-sm">View data in tabular format</p>
        </button>
        
        <button 
          onClick={() => onNavigate('drafting')}
          className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
        >
          <FileText className="text-purple-600 mb-4" size={32} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Drafting Tool</h3>
          <p className="text-gray-600 text-sm">Create new communications</p>
        </button>
        
        <button className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow">
          <FileText className="text-orange-600 mb-4" size={32} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Generate Report</h3>
          <p className="text-gray-600 text-sm">Create comprehensive reports</p>
        </button>
      </div>
      
      {/* Recent Events Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Events</h2>
        <div className="bg-white rounded-lg shadow-md">
          <div className="divide-y divide-gray-200">
            {mockData.events.slice(0, 3).map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{event.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.letterNo}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        event.from === 'Contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {event.from} → {event.to}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <PriorityBadge priority={event.priority} />
                    <OverdueBadge isOverdue={event.isOverdue || false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                          isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                        }`}>
                          <div className="w-full h-full rounded-full animate-pulse"></div>
                        </div>
                        
                        <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-0.5 ${
                          isContractor ? 'right-4 bg-gradient-to-l' : 'left-4 bg-gradient-to-r'
                        } ${isContractor ? 'from-blue-400 to-blue-600' : 'from-green-400 to-green-600'} animate-pulse`}></div>
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

// Left Navigation Component
const LeftNavigation: React.FC<{ currentPage: PageType; onNavigate: (page: PageType) => void }> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { page: 'dashboard' as PageType, icon: Home, label: 'Dashboard' },
    { page: 'timeline' as PageType, icon: Clock, label: 'Timeline View' },
    { page: 'table' as PageType, icon: Table, label: 'Table View' },
    { page: 'drafting' as PageType, icon: FileText, label: 'Drafting Tool' },
  ];
  
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };
  
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'timeline':
        return <TimelineDashboard />;
      case 'table':
        return <TableView />;
      case 'drafting':
        return <DraftingTool />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex">
        <LeftNavigation currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default App;