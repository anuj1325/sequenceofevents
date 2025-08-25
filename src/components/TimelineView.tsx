// src/components/TimelineView.tsx
import { AlertTriangle, Calendar, Paperclip, User } from 'lucide-react';
import React, { useState } from 'react';

// Import types from App.tsx
import { Event, ViewType } from '../App';

// Mock data (same as in App.tsx)
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
      isOverdue: false
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
      isOverdue: true
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
      isOverdue: true
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
      isOverdue: false
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
      isOverdue: false
    }
  ]
};

interface TimelineViewProps {
  viewType?: ViewType;
  embedded?: boolean;
  onEventClick?: ((event: Event) => void) | undefined;
  height?: string;
  showTitle?: boolean;
}

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

// Compact Event Card for embedded view
const CompactEventCard: React.FC<{
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
  side?: 'left' | 'right';
  onEventClick?: ((event: Event) => void) | undefined;
}> = ({ event, isExpanded, onToggle, side = 'right', onEventClick }) => {
  const isContractor = event.from === 'Contractor';
  const cardClass = side === 'left' ? 'mr-4' : 'ml-4';
  
  const handleCardClick = () => {
    onToggle();
    if (onEventClick) {
      onEventClick(event);
    }
  };
  
  return (
    <div className={`${cardClass} transition-all duration-300 hover:shadow-lg`}>
      <div className={`bg-white rounded-md shadow-sm border-l-2 ${
        isContractor ? 'border-l-blue-500' : 'border-l-green-500'
      } p-3 cursor-pointer`} onClick={handleCardClick}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-xs">{event.subject}</h4>
            <p className="text-xs text-gray-500 mt-1">{event.letterNo}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <PriorityBadge priority={event.priority} />
            <OverdueBadge isOverdue={event.isOverdue || false} />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Calendar size={10} />
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span className={`px-1 py-0.5 rounded text-xs ${
            isContractor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {event.from}
          </span>
        </div>
        
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Vertical Timeline for embedded view
const EmbeddedVerticalTimeline: React.FC<{ onEventClick?: ((event: Event) => void) | undefined }> = ({ onEventClick }) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  
  const toggleCard = (eventId: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };
  
  return (
    <div className="relative max-w-4xl mx-auto p-4">
      {/* Central Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-green-400 h-full"></div>
      
      {/* Events */}
      <div className="space-y-6">
        {mockData.events.map((event) => {
          const isContractor = event.from === 'Contractor';
          
          return (
            <div key={event.id} className="relative flex items-center">
              {/* Left Side Event (Contractor Only) */}
              {isContractor && (
                <div className="w-1/2 pr-4">
                  <CompactEventCard 
                    event={event} 
                    isExpanded={expandedCards[event.id]}
                    onToggle={() => toggleCard(event.id)}
                    side="right"
                    onEventClick={onEventClick}
                  />
                </div>
              )}
              
              {/* Empty space for contractor events on right side */}
              {isContractor && <div className="w-1/2"></div>}
              
              {/* Central Milestone */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                  isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                }`}>
                  <div className="w-full h-full rounded-full animate-pulse"></div>
                </div>
                
                {/* Animated Line to Card */}
                <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-0.5 ${
                  isContractor ? 'right-4 bg-gradient-to-l' : 'left-4 bg-gradient-to-r'
                } ${isContractor ? 'from-blue-400 to-blue-600' : 'from-green-400 to-green-600'} animate-pulse`}></div>
              </div>
              
              {/* Right Side Event (NHAI/Authority Only) */}
              {!isContractor && (
                <>
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-4">
                    <CompactEventCard 
                      event={event} 
                      isExpanded={expandedCards[event.id]}
                      onToggle={() => toggleCard(event.id)}
                      side="left"
                      onEventClick={onEventClick}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Regular Event Card Component (same as in App.tsx)
const EventCard: React.FC<{
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
  side?: 'left' | 'right';
  onEventClick?: ((event: Event) => void) | undefined;
}> = ({ event, isExpanded, onToggle, side = 'right', onEventClick }) => {
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

// Full Vertical Timeline
const FullVerticalTimeline: React.FC<{ onEventClick?: (event: Event) => void }> = ({ onEventClick }) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  
  const toggleCard = (eventId: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };
  
  return (
    <div className="relative max-w-6xl mx-auto p-8">
      {/* Central Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 h-full"></div>
      
      {/* Events */}
      <div className="space-y-12">
        {mockData.events.map((event) => {
          const isContractor = event.from === 'Contractor';
          
          return (
            <div key={event.id} className="relative flex items-center">
              {/* Left Side Event (Contractor Only) */}
              {isContractor && (
                <div className="w-1/2 pr-8">
                  <EventCard 
                    event={event} 
                    isExpanded={expandedCards[event.id]}
                    onToggle={() => toggleCard(event.id)}
                    side="right"
                    onEventClick={onEventClick}
                  />
                </div>
              )}
              
              {/* Empty space for contractor events on right side */}
              {isContractor && <div className="w-1/2"></div>}
              
              {/* Central Milestone */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                  isContractor ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                }`}>
                  <div className="w-full h-full rounded-full animate-pulse"></div>
                </div>
                
                {/* Animated Line to Card */}
                <div className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-0.5 ${
                  isContractor ? 'right-6 bg-gradient-to-l' : 'left-6 bg-gradient-to-r'
                } ${isContractor ? 'from-blue-400 to-blue-600' : 'from-green-400 to-green-600'} animate-pulse`}></div>
              </div>
              
              {/* Right Side Event (NHAI/Authority Only) */}
              {!isContractor && (
                <>
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8">
                    <EventCard 
                      event={event} 
                      isExpanded={expandedCards[event.id]}
                      onToggle={() => toggleCard(event.id)}
                      side="left"
                      onEventClick={onEventClick}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main TimelineView Component
export const TimelineView: React.FC<TimelineViewProps> = ({ 
  viewType = 'vertical', 
  embedded = false, 
  onEventClick,
  height = 'auto',
  showTitle = true 
}) => {
  if (embedded) {
    return (
      <div className={`bg-gray-50 rounded-lg ${height !== 'auto' ? `h-${height}` : ''} overflow-y-auto`}>
        {showTitle && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Timeline Reference</h3>
            <p className="text-sm text-gray-600">Click on any event to reference</p>
          </div>
        )}
        <EmbeddedVerticalTimeline onEventClick={onEventClick} />
      </div>
    );
  }
  
  // For full view, render based on viewType
  switch (viewType) {
    case 'vertical':
      return onEventClick ? <FullVerticalTimeline onEventClick={onEventClick} /> : <FullVerticalTimeline />;
    default:
      return onEventClick ? <FullVerticalTimeline onEventClick={onEventClick} /> : <FullVerticalTimeline />;
  }
};

export default TimelineView;