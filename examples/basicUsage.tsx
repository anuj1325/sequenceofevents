/**
 * Basic usage examples for Timeline Communication App components
 */

import React, { useState, useContext, createContext } from 'react';
import { TimelineView } from '../src/components/TimelineView';
import { EventForm } from '../src/components/Forms/EventForm';
import { FilterForm } from '../src/components/Forms/FilterForm';
import { useEvents, useNotifications } from '../src/hooks';
import { Event, TimelineFilters } from '../src/types';

// Example 1: Basic Timeline Integration
export const BasicTimelineExample: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    console.log('Event clicked:', event);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Basic Timeline Example</h2>
      
      {/* Embedded Timeline */}
      <div className="mb-6">
        <TimelineView 
          embedded={true}
          onEventClick={handleEventClick}
          height="400px"
          showTitle={true}
        />
      </div>

      {/* Selected Event Display */}
      {selectedEvent && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold">Selected Event:</h3>
          <p className="text-sm">{selectedEvent.subject}</p>
          <p className="text-xs text-gray-600">{selectedEvent.letterNo}</p>
        </div>
      )}
    </div>
  );
};

// Example 2: Advanced Timeline with Filters
export const AdvancedTimelineExample: React.FC = () => {
  const { events, loading, updateFilters, filters } = useEvents();
  const [viewType, setViewType] = useState<'vertical' | 'horizontal' | 'table'>('vertical');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Advanced Timeline with Filters</h2>
      
      {/* Filter Form */}
      <FilterForm
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={() => updateFilters({})}
      />

      {/* View Type Selector */}
      <div className="flex space-x-2">
        {(['vertical', 'horizontal', 'table'] as const).map(type => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={`px-4 py-2 rounded ${
              viewType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <TimelineView viewType={viewType} />
      )}
    </div>
  );
};

// Example 3: Event Management with Form
export const EventManagementExample: React.FC = () => {
  const { createEvent, updateEvent } = useEvents();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleCreateEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      await createEvent(eventData);
      addNotification('success', 'Event created successfully!');
      setShowForm(false);
    } catch (error) {
      addNotification('error', 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (eventData: Omit<Event, 'id'>) => {
    if (!editingEvent) return;
    
    try {
      await updateEvent(editingEvent.id, eventData);
      addNotification('success', 'Event updated successfully!');
      setEditingEvent(null);
    } catch (error) {
      addNotification('error', 'Failed to update event');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Event Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Event
        </button>
      </div>

      {/* Event Form */}
      {(showForm || editingEvent) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          <EventForm
            event={editingEvent || undefined}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        </div>
      )}

      {/* Timeline with edit functionality */}
      <TimelineView
        onEventClick={(event) => setEditingEvent(event)}
      />
    </div>
  );
};

// Example 4: Custom Hook Usage
export const CustomHookExample: React.FC = () => {
  const { events, loading, error } = useEvents();
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Example of using multiple hooks together
  React.useEffect(() => {
    if (error) {
      addNotification('error', typeof error === 'string' ? error : error.message);
    }
  }, [error, addNotification]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Custom Hook Usage Example</h2>
      
      {/* Notifications */}
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded ${
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          {notification.message}
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      ))}

      {/* Events Summary */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Events Summary</h3>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.from === 'Contractor').length}
              </div>
              <div className="text-sm text-gray-600">Contractor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.from === 'NHAI').length}
              </div>
              <div className="text-sm text-gray-600">NHAI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {events.filter(e => e.isOverdue).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================================

// examples/integration-patterns.tsx
/**
 * Integration patterns and best practices
 */

// import React, { createContext, useContext, useState } from 'react';
// import { TimelineView } from '../src/components/TimelineView';
// import { Event } from '../src/types';

// Pattern 1: Context-based Integration
interface ProjectContextType {
  projectId: string;
  projectName: string;
  selectedEvents: Event[];
  addSelectedEvent: (event: Event) => void;
  removeSelectedEvent: (eventId: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  const addSelectedEvent = (event: Event) => {
    setSelectedEvents(prev => [...prev, event]);
  };

  const removeSelectedEvent = (eventId: number) => {
    setSelectedEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const value: ProjectContextType = {
    projectId: 'project-123',
    projectName: 'Highway Construction Project',
    selectedEvents,
    addSelectedEvent,
    removeSelectedEvent
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

// Pattern 2: Multi-Panel Layout
export const MultiPanelLayout: React.FC = () => {
  const { selectedEvents, addSelectedEvent } = useProject();
  const [activePanel, setActivePanel] = useState<'timeline' | 'details' | 'analytics'>('timeline');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <h3 className="font-bold mb-4">Navigation</h3>
        <div className="space-y-2">
          {(['timeline', 'details', 'analytics'] as const).map(panel => (
            <button
              key={panel}
              onClick={() => setActivePanel(panel)}
              className={`w-full text-left p-2 rounded ${
                activePanel === panel ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
              }`}
            >
              {panel.charAt(0).toUpperCase() + panel.slice(1)}
            </button>
          ))}
        </div>

        {/* Selected Events Summary */}
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Selected Events ({selectedEvents.length})</h4>
          <div className="space-y-1">
            {selectedEvents.map(event => (
              <div key={event.id} className="text-xs p-2 bg-white rounded border">
                {event.letterNo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activePanel === 'timeline' && (
          <TimelineView onEventClick={addSelectedEvent} />
        )}
        {activePanel === 'details' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
            {selectedEvents.length === 0 ? (
              <p className="text-gray-500">No events selected</p>
            ) : (
              <div className="space-y-4">
                {selectedEvents.map(event => (
                  <div key={event.id} className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold">{event.subject}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activePanel === 'analytics' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <p>Analytics content here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Pattern 3: Modal-based Integration
export const ModalIntegrationExample: React.FC = () => {
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventSelection = (event: Event) => {
    setSelectedEvent(event);
    setIsTimelineModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Modal Integration Pattern</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => setIsTimelineModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Select Event from Timeline
        </button>

        {selectedEvent && (
          <div className="bg-green-50 p-4 rounded border">
            <h3 className="font-semibold text-green-800">Selected Event:</h3>
            <p className="text-green-700">{selectedEvent.subject}</p>
            <p className="text-green-600 text-sm">{selectedEvent.letterNo}</p>
          </div>
        )}
      </div>

      {/* Timeline Modal */}
      {isTimelineModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select an Event</h3>
              <button
                onClick={() => setIsTimelineModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <TimelineView 
              embedded={true}
              onEventClick={handleEventSelection}
              height="500px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ===================================

// docs/COMPONENTS.md
/**
 * Component Documentation
 */

export const ComponentDocumentation = `
# Timeline Communication App - Component Documentation

## Core Components

### TimelineView

The main timeline visualization component that can display events in vertical, horizontal, or table format.

#### Props
\`\`\`typescript
interface TimelineViewProps {
  viewType?: 'vertical' | 'horizontal' | 'table';
  embedded?: boolean;
  onEventClick?: (event: Event) => void;
  height?: string;
  showTitle?: boolean;
  events?: Event[];
  filters?: TimelineFilters;
  showControls?: boolean;
}
\`\`\`

#### Usage Examples

**Basic Timeline:**
\`\`\`tsx
<TimelineView />
\`\`\`

**Embedded Timeline:**
\`\`\`tsx
<TimelineView 
  embedded={true}
  onEventClick={(event) => console.log(event)}
  height="400px"
/>
\`\`\`

**Custom View Type:**
\`\`\`tsx
<TimelineView 
  viewType="horizontal"
  showControls={false}
/>
\`\`\`

### EventForm

A comprehensive form component for creating and editing events.

#### Props
\`\`\`typescript
interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: Omit<Event, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}
\`\`\`

#### Usage Examples

**Create New Event:**
\`\`\`tsx
<EventForm
  onSubmit={async (data) => {
    await createEvent(data);
  }}
  onCancel={() => setShowForm(false)}
/>
\`\`\`

**Edit Existing Event:**
\`\`\`tsx
<EventForm
  event={existingEvent}
  onSubmit={async (data) => {
    await updateEvent(existingEvent.id, data);
  }}
  onCancel={() => setEditMode(false)}
  loading={isUpdating}
/>
\`\`\`

### FilterForm

Advanced filtering component for timeline views.

#### Props
\`\`\`typescript
interface FilterFormProps {
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
  onClearFilters: () => void;
}
\`\`\`

#### Usage
\`\`\`tsx
const [filters, setFilters] = useState<TimelineFilters>({});

<FilterForm
  filters={filters}
  onFiltersChange={setFilters}
  onClearFilters={() => setFilters({})}
/>
\`\`\`

## UI Components

### Button

A versatile button component with multiple variants and states.

#### Props
\`\`\`typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}
\`\`\`

#### Usage Examples
\`\`\`tsx
// Primary button
<Button variant="primary">Save</Button>

// Button with icon
<Button icon={Save} iconPosition="left">Save Draft</Button>

// Loading button
<Button loading={isSubmitting}>Submit</Button>
\`\`\`

### Modal

A flexible modal component for overlays and dialogs.

#### Props
\`\`\`typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
\`\`\`

#### Usage
\`\`\`tsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Event Details"
  size="lg"
>
  <EventDetails event={selectedEvent} />
</Modal>
\`\`\`

## Custom Hooks

### useEvents

Hook for managing event data with CRUD operations.

#### Returns
\`\`\`typescript
{
  events: Event[];
  loading: boolean;
  error: string | null;
  createEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: number, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  refreshEvents: () => Promise<void>;
}
\`\`\`

#### Usage
\`\`\`tsx
const { events, loading, createEvent } = useEvents();

// Create new event
await createEvent({
  from: 'Contractor',
  to: 'NHAI',
  subject: 'Project Update',
  // ... other fields
});
\`\`\`

### useNotifications

Hook for managing toast notifications.

#### Returns
\`\`\`typescript
{
  notifications: Notification[];
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}
\`\`\`

#### Usage
\`\`\`tsx
const { addNotification } = useNotifications();

// Show success notification
addNotification('success', 'Event created successfully!');

// Show error notification
addNotification('error', 'Failed to save event');
\`\`\`

## Integration Patterns

### Embedded Timeline

Use the timeline component within other pages:

\`\`\`tsx
import { TimelineView } from './components/TimelineView';

const DraftingTool = () => {
  const [referenceEvent, setReferenceEvent] = useState(null);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3>Timeline Reference</h3>
        <TimelineView 
          embedded={true}
          onEventClick={setReferenceEvent}
          height="400px"
        />
      </div>
      <div>
        <h3>Draft Letter</h3>
        {referenceEvent && (
          <p>Referencing: {referenceEvent.subject}</p>
        )}
        <textarea placeholder="Write your letter..." />
      </div>
    </div>
  );
};
\`\`\`

### Context Integration

Use React Context for global state management:

\`\`\`tsx
import { useAppContext } from './context/AppContext';

const MyComponent = () => {
  const { events, createEvent, loading } = useAppContext();

  return (
    <div>
      {loading ? <Spinner /> : <TimelineView />}
    </div>
  );
};
\`\`\`

## Styling Guidelines

### Tailwind CSS Classes

The app uses Tailwind CSS with these conventions:

- **Primary Blue**: \`bg-blue-600\`, \`text-blue-600\`, \`border-blue-600\`
- **Secondary Green**: \`bg-green-600\`, \`text-green-600\`, \`border-green-600\`
- **Gray Scale**: \`bg-gray-50\` to \`bg-gray-900\`
- **Spacing**: Use \`space-y-4\`, \`gap-6\`, \`p-4\`, \`m-6\` etc.

### Responsive Design

Use responsive prefixes:
- \`sm:\` for small screens (640px+)
- \`md:\` for medium screens (768px+)
- \`lg:\` for large screens (1024px+)
- \`xl:\` for extra large screens (1280px+)

### Color Coding

- **Contractor**: Blue theme (\`bg-blue-100 text-blue-800\`)
- **NHAI/Authority**: Green theme (\`bg-green-100 text-green-800\`)
- **Priority Urgent**: Red (\`bg-red-100 text-red-800\`)
- **Priority High**: Orange (\`bg-orange-100 text-orange-800\`)
- **Priority Medium**: Yellow (\`bg-yellow-100 text-yellow-800\`)
- **Priority Low**: Green (\`bg-green-100 text-green-800\`)

## Best Practices

### Performance

1. **Memoization**: Use \`React.memo\` for expensive components
2. **Lazy Loading**: Use \`React.lazy\` for route-based code splitting
3. **Virtual Scrolling**: Implement for large datasets
4. **Debouncing**: Use \`useDebounce\` hook for search inputs

### Accessibility

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add \`aria-label\` and \`aria-describedby\`
3. **Keyboard Navigation**: Ensure tab order is logical
4. **Color Contrast**: Maintain WCAG 2.1 compliance

### Testing

1. **Unit Tests**: Test individual components and hooks
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows
4. **Accessibility Tests**: Use tools like axe-core

### Code Organization

1. **Feature-based Structure**: Group related files together
2. **Barrel Exports**: Use index.ts files for clean imports
3. **Type Safety**: Define TypeScript interfaces for all data
4. **Documentation**: Add JSDoc comments for complex functions

## Troubleshooting

### Common Issues

1. **Timeline Not Rendering**
   - Check if events data is properly loaded
   - Verify TimelineView props are correct
   - Check console for JavaScript errors

2. **Forms Not Submitting**
   - Verify onSubmit handler is async
   - Check validation errors in form state
   - Ensure all required fields are filled

3. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check for conflicting CSS classes
   - Ensure responsive prefixes are used correctly

4. **Performance Issues**
   - Use React DevTools Profiler
   - Check for unnecessary re-renders
   - Implement memoization where needed

For more help, check the GitHub issues or contact the development team.
`;

// ===================================

// src/components/index.ts
/**
 * Components barrel export file
 */

// Core Components
export { TimelineView } from './TimelineView';
export { default as EventCard } from './TimelineView/EventCard';

// Form Components
export { EventForm } from './Forms/EventForm';
export { FilterForm } from './Forms/FilterForm';

// UI Components
export { Button } from './UI/Button';
export { Modal } from './UI/Modal';
export { Badge } from './UI/Badge';
export { Tooltip } from './UI/Tooltip';

// Feature Components
export { DraftingTool } from './DraftingTool/DraftingTool';

// Layout Components
export { TopNavigation } from './Navigation/TopNavigation';
export { LeftNavigation } from './Navigation/LeftNavigation';

// Re-export types for convenience
export type { Event, TimelineFilters, Priority, EventStatus } from '../types';`;