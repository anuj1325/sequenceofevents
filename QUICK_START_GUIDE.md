
/**
 * Timeline Communication App - Quick Start Implementation Guide
 * Step-by-step guide to get your app running in minutes
 */

# 🚀 Quick Start Guide - Timeline Communication App

## ⚡ 5-Minute Setup

### Step 1: Create Project (Automated)
```bash
# Option A: Automated setup (recommended)
curl -o setup-project.sh https://raw.githubusercontent.com/your-repo/timeline-app/main/setup-project.sh
chmod +x setup-project.sh
./setup-project.sh

# Option B: Manual setup
npx create-react-app timeline-communication-app --template typescript
cd timeline-communication-app
npm install lucide-react tailwindcss autoprefixer postcss
```

### Step 2: Copy Essential Files
```bash
# Copy these key files to your project:
# 1. src/App.tsx (main application)
# 2. src/components/TimelineView/TimelineView.tsx (timeline component)
# 3. src/types/index.ts (TypeScript definitions)
# 4. src/services/mockData.ts (sample data)
# 5. tailwind.config.js (styling configuration)
```

### Step 3: Start Development
```bash
npm start
# Opens http://localhost:3000
```

## 🎯 Essential Implementation Examples

### Example 1: Basic Page with Timeline
```typescript
// src/pages/ProjectTimeline.tsx
import React from 'react';
import { TimelineView } from '../components/TimelineView';

export const ProjectTimeline: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Project Communication Timeline
        </h1>
        
        {/* Full Timeline */}
        <TimelineView />
      </div>
    </div>
  );
};
```

### Example 2: Embedded Timeline in Sidebar
```typescript
// src/components/Sidebar/ProjectSidebar.tsx
import React, { useState } from 'react';
import { TimelineView } from '../TimelineView';
import { Event } from '../../types';

export const ProjectSidebar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Communications</h2>
        
        {/* Embedded Timeline */}
        <TimelineView 
          embedded={true}
          height="400px"
          onEventClick={setSelectedEvent}
          showTitle={false}
        />
        
        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">
              {selectedEvent.subject}
            </h3>
            <p className="text-blue-600 text-sm mt-1">
              {selectedEvent.letterNo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
```

### Example 3: Letter Drafting with Timeline Reference
```typescript
// src/pages/LetterDrafting.tsx
import React, { useState } from 'react';
import { TimelineView } from '../components/TimelineView';
import { Event } from '../types';

export const LetterDrafting: React.FC = () => {
  const [referenceEvent, setReferenceEvent] = useState<Event | null>(null);
  const [letterContent, setLetterContent] = useState('');

  const handleEventReference = (event: Event) => {
    setReferenceEvent(event);
    
    // Auto-populate letter with reference
    const referenceText = `\n\nReference: ${event.letterNo} dated ${new Date(event.date).toLocaleDateString()}\nSubject: ${event.subject}\n\n`;
    setLetterContent(prev => prev + referenceText);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Draft New Letter</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timeline Reference */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Reference Timeline Events
            </h2>
            <TimelineView 
              embedded={true}
              height="500px"
              onEventClick={handleEventReference}
            />
          </div>
          
          {/* Letter Composition */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Compose Letter</h2>
            
            {/* Reference Display */}
            {referenceEvent && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-medium">
                  📎 Referenced: {referenceEvent.subject}
                </p>
                <p className="text-green-600 text-sm">
                  {referenceEvent.letterNo}
                </p>
              </div>
            )}
            
            {/* Letter Editor */}
            <textarea
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              placeholder="Start writing your letter..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="mt-4 flex space-x-3">
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
    </div>
  );
};
```

### Example 4: Dashboard with Integrated Timeline
```typescript
// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { TimelineView } from '../components/TimelineView';
import { useEvents } from '../hooks';

export const Dashboard: React.FC = () => {
  const { events, loading } = useEvents();
  const [viewMode, setViewMode] = useState<'overview' | 'timeline'>('overview');

  // Calculate statistics
  const stats = {
    total: events.length,
    contractor: events.filter(e => e.from === 'Contractor').length,
    authority: events.filter(e => e.from === 'NHAI').length,
    overdue: events.filter(e => e.isOverdue).length,
    urgent: events.filter(e => e.priority === 'urgent').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Communication Dashboard
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded ${
                viewMode === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded ${
                viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {viewMode === 'overview' ? (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">{stats.contractor}</div>
                <div className="text-sm text-gray-600">Contractor</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.authority}</div>
                <div className="text-sm text-gray-600">Authority</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
                <div className="text-sm text-gray-600">Urgent</div>
              </div>
            </div>

            {/* Recent Timeline Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Communications</h2>
              <TimelineView 
                embedded={true}
                height="300px"
                showControls={false}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setViewMode('timeline')}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  View Full Timeline
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Full Timeline View */
          <div className="bg-white rounded-lg shadow-md">
            <TimelineView />
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🔧 Custom Hook Usage Examples

### Example 5: Using Custom Hooks
```typescript
// src/components/EventManager.tsx
import React from 'react';
import { useEvents, useNotifications } from '../hooks';

export const EventManager: React.FC = () => {
  const { 
    events, 
    loading, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useEvents();
  
  const { addNotification } = useNotifications();

  const handleCreateEvent = async () => {
    try {
      await createEvent({
        from: 'Contractor',
        to: 'NHAI',
        date: new Date().toISOString().split('T')[0],
        letterNo: 'NEW/LET/001',
        subject: 'New Communication',
        description: 'Description here',
        assignee: 'Project Manager',
        attachments: [],
        priority: 'medium'
      });
      
      addNotification('success', 'Event created successfully!');
    } catch (error) {
      addNotification('error', 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (eventId: number) => {
    try {
      await updateEvent(eventId, {
        priority: 'urgent',
        updatedAt: new Date().toISOString()
      });
      
      addNotification('success', 'Event updated successfully!');
    } catch (error) {
      addNotification('error', 'Failed to update event');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Event Management</h2>
        <button
          onClick={handleCreateEvent}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </div>

      <div className="space-y-2">
        {events.map(event => (
          <div key={event.id} className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <h3 className="font-medium">{event.subject}</h3>
              <p className="text-sm text-gray-600">{event.letterNo}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateEvent(event.id)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Update
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎨 Styling Customization Examples

### Example 6: Custom Theme Colors
```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        brand: {
          primary: '#1E40AF',      // Custom blue
          secondary: '#059669',    // Custom green
          accent: '#7C3AED',       // Custom purple
        },
        // Organization colors
        contractor: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        authority: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
```

### Example 7: Custom Event Card Styling
```typescript
// src/components/CustomEventCard.tsx
import React from 'react';
import { Event } from '../types';

interface CustomEventCardProps {
  event: Event;
  theme?: 'modern' | 'classic' | 'minimal';
}

export const CustomEventCard: React.FC<CustomEventCardProps> = ({ 
  event, 
  theme = 'modern' 
}) => {
  const themeClasses = {
    modern: 'bg-gradient-to-r from-white to-gray-50 border-l-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1',
    classic: 'bg-white border border-gray-200 shadow-md',
    minimal: 'bg-white border-l-2 shadow-sm hover:shadow-md'
  };

  const organizationColors = {
    Contractor: theme === 'modern' ? 'border-l-blue-500 hover:border-l-blue-600' : 'border-l-blue-400',
    NHAI: theme === 'modern' ? 'border-l-green-500 hover:border-l-green-600' : 'border-l-green-400'
  };

  return (
    <div className={`
      ${themeClasses[theme]}
      ${organizationColors[event.from]}
      p-6 rounded-lg transition-all duration-300 cursor-pointer
    `}>
      {/* Event content */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-800 text-lg">{event.subject}</h3>
        <div className="flex flex-col items-end space-y-1">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
              event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'}
          `}>
            {event.priority.toUpperCase()}
          </span>
          {event.isOverdue && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
              OVERDUE
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Letter No:</strong> {event.letterNo}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Assignee:</strong> {event.assignee}</p>
        
        {event.contractDeadline && (
          <p><strong>Deadline:</strong> {new Date(event.contractDeadline).toLocaleDateString()}</p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      {event.attachments && event.attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {event.attachments.map((attachment, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
              📎 {attachment}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 🚀 Production Deployment Examples

### Example 8: Environment Configuration
```bash
# .env.production
REACT_APP_API_BASE_URL=https://api.yourcompany.com/timeline
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

### Example 9: Docker Production Setup
```dockerfile
# Dockerfile.production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Example 10: Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: timeline-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: timeline-app
  template:
    metadata:
      labels:
        app: timeline-app
    spec:
      containers:
      - name: timeline-app
        image: your-registry/timeline-app:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_BASE_URL
          value: "https://api.yourcompany.com"
---
apiVersion: v1
kind: Service
metadata:
  name: timeline-app-service
spec:
  selector:
    app: timeline-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 📱 Mobile Responsive Examples

### Example 11: Mobile-Optimized Timeline
```typescript
// src/components/MobileTimeline.tsx
import React, { useState } from 'react';
import { useWindowSize } from '../hooks';
import { TimelineView } from './TimelineView';

export const MobileTimeline: React.FC = () => {
  const { width } = useWindowSize();
  const [viewType, setViewType] = useState<'vertical' | 'table'>('vertical');
  
  // Auto-switch to table view on small screens
  React.useEffect(() => {
    if (width < 768) {
      setViewType('table');
    }
  }, [width]);

  return (
    <div className="w-full">
      {/* Mobile Navigation */}
      <div className="flex justify-center mb-4 md:hidden">
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewType('vertical')}
            className={`px-3 py-1 rounded text-sm ${
              viewType === 'vertical' ? 'bg-white shadow' : ''
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewType('table')}
            className={`px-3 py-1 rounded text-sm ${
              viewType === 'table' ? 'bg-white shadow' : ''
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Responsive Timeline */}
      <TimelineView 
        viewType={width < 768 ? 'table' : viewType}
        embedded={width < 768}
        height={width < 768 ? "400px" : undefined}
      />
    </div>
  );
};
```

## 🎯 Final Implementation Checklist

### ✅ Essential Files Created
- [x] `src/App.tsx` - Main application with navigation
- [x] `src/components/TimelineView/` - Core timeline component
- [x] `src/types/index.ts` - TypeScript definitions
- [x] `src/services/api.ts` - API service layer
- [x] `src/hooks/index.ts` - Custom React hooks
- [x] `src/utils/index.ts` - Utility functions
- [x] `package.json` - Dependencies and scripts
- [x] `tsconfig.json` - TypeScript configuration
- [x] `tailwind.config.js` - Styling configuration
- [x] `project.Makefile` - Build automation

### ✅ Key Features Implemented
- [x] Vertical timeline (Contractor left, Authority right)
- [x] Horizontal timeline (Contractor above, Authority below)
- [x] Table view with filtering and sorting
- [x] Embedded timeline component for integration
- [x] Event management with CRUD operations
- [x] Smart notifications for overdue events
- [x] Drafting tool with timeline reference
- [x] Responsive design for all devices
- [x] Professional dashboard layout

### ✅ Production Ready
- [x] Docker containerization
- [x] CI/CD pipeline configuration
- [x] Environment variable setup
- [x] Code quality tools (ESLint, Prettier)
- [x] Testing framework setup
- [x] Documentation complete
- [x] Mobile optimization
- [x] Performance optimizations

## 🎉 You're All Set!

Your Timeline Communication App is now **complete and ready for production**. Start with any of the examples above and customize them for your specific needs.

**Happy coding! 🚀**