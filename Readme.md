# Timeline Communication App

A comprehensive React TypeScript application for tracking and managing communication timeline between Contractors and National Highway Authority of India (NHAI).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Features

### 📊 Multiple Timeline Views
- **Vertical Timeline**: Contractor events on left, Authority/NHAI events on right
- **Horizontal Timeline**: Contractor events above central line, Authority events below
- **Table View**: Traditional tabular display with sorting and filtering

### 🎯 Smart Event Management
- Color-coded priority levels (Urgent, High, Medium, Low)
- Contract deadline tracking with overdue notifications
- Expandable event cards with detailed information
- Attachment management for each communication

### 🔧 Integration Ready
- **Reusable Components**: Timeline view can be embedded in other pages
- **Drafting Tool Integration**: Reference timeline events while drafting letters
- **API Ready**: Mock data structure easily convertible to API endpoints

### ⚡ Smart Nudges & Notifications
- Overdue event alerts
- Contract deadline reminders
- Actionable prompts for follow-up communications

### 🎨 Modern UI/UX
- Responsive design for desktop and mobile
- Animated timeline elements with gradient colors
- Smooth transitions and hover effects
- Tailwind CSS for consistent styling

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Git** (for version control)

## 🛠 Installation

### Quick Setup (Recommended)

1. **Clone and setup the project:**
   ```bash
   chmod +x setup-project.sh
   ./setup-project.sh
   ```

### Manual Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/company/timeline-communication-app.git
   cd timeline-communication-app
   ```

2. **Install dependencies:**
   ```bash
   make install
   # or
   npm install
   ```

3. **Setup development environment:**
   ```bash
   make setup
   ```

## 🚦 Running the Application

### Development Mode
```bash
make dev
# or
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
make build
make serve
# or
npm run build
npm run serve
```

## 📖 Usage Guide

### Dashboard
- Overview of all communication statistics
- Quick navigation to different views
- Recent events summary
- Overdue notifications

### Timeline Views

#### Vertical Timeline
- **Left Side**: All Contractor communications
- **Right Side**: All Authority/NHAI communications
- **Central Line**: Animated gradient timeline with milestone markers
- **Cards**: Expandable with full event details

#### Horizontal Timeline
- **Top**: All Contractor events above the central line
- **Bottom**: All Authority/NHAI events below the central line
- **Connectors**: Animated lines connecting events to timeline

#### Table View
- Sortable columns for all event attributes
- Priority and overdue status indicators
- Compact view for data analysis

### Drafting Tool Integration
```typescript
import { TimelineView } from './components/TimelineView';

// Embed timeline in any component
<TimelineView 
  embedded={true}
  onEventClick={(event) => handleEventReference(event)}
  height="400px"
/>
```

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `make dev` | Start development server |
| `make build` | Build for production |
| `make test` | Run tests |
| `make lint` | Run ESLint |
| `make type-check` | TypeScript type checking |
| `make quality` | Run all quality checks |
| `make clean` | Clean build artifacts |

### Project Structure
```
timeline-communication-app/
├── src/
│   ├── components/
│   │   └── TimelineView/
│   │       ├── TimelineView.tsx
│   │       └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   ├── hooks/
│   ├── services/
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── public/
├── build/
├── docs/
├── package.json
├── tsconfig.json
├── project.Makefile
├── setup-project.sh
└── README.md
```

### Code Quality

The project includes:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Git hooks** for pre-commit quality checks

## 🧩 Component Architecture

### Core Components

#### `App.tsx`
Main application component with navigation and routing logic.

#### `TimelineView.tsx`
Reusable timeline component that can be embedded anywhere:
```typescript
interface TimelineViewProps {
  viewType?: 'vertical' | 'horizontal' | 'table';
  embedded?: boolean;
  onEventClick?: (event: Event) => void;
  height?: string;
  showTitle?: boolean;
}
```

#### Event Types
```typescript
interface Event {
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
}
```

## 🔌 API Integration

The application is designed to easily integrate with backend APIs:

### Data Structure
All data is currently served from `mockData` object which follows the exact structure expected from APIs.

### Converting to API
1. Replace mock data imports with API service calls
2. Add loading states to components
3. Implement error handling
4. Add data caching if needed

Example service structure:
```typescript
// services/timelineService.ts
export const timelineService = {
  getEvents: () => fetch('/api/events').then(res => res.json()),
  createEvent: (event: Event) => fetch('/api/events', { 
    method: 'POST', 
    body: JSON.stringify(event) 
  }),
  updateEvent: (id: number, event: Partial<Event>) => 
    fetch(`/api/events/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(event) 
    })
};
```

## 🎨 Styling & Theming

The application uses **Tailwind CSS** for styling:

### Color Scheme
- **Contractor**: Blue gradient (`from-blue-400 to-blue-600`)
- **Authority/NHAI**: Green gradient (`from-green-400 to-green-600`)
- **Timeline**: Purple gradient (`via-purple-500`)
- **Priority Colors**: Red (Urgent), Orange (High), Yellow (Medium), Green (Low)

### Responsive Design
- Mobile-first approach
- Collapsible navigation on smaller screens
- Adaptive timeline layouts

## 🧪 Testing

### Running Tests
```bash
make test           # Run all tests
make test-watch     # Run tests in watch mode
```

### Test Structure
- Unit tests for individual components
- Integration tests for timeline interactions
- Type checking with TypeScript

## 📦 Deployment

### Production Build
```bash
make build
```

### Environment Variables
Create a `.env` file for environment-specific configuration:
```env
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

### Docker Deployment (Optional)
```bash
make docker-build
make docker-run
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test: `make quality`
4. Commit changes: `git commit -m "Add new feature"`
5. Push to branch: `git push origin feature/new-feature`
6. Create a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain component prop interfaces
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📚 Documentation

### Component Documentation
Each component includes TypeScript interfaces and JSDoc comments.

### API Documentation
Will be generated automatically when backend integration is complete.

## 🐛 Troubleshooting

### Common Issues

1. **Node.js Version Error**
   ```bash
   nvm use 18
   # or install Node.js 18+ from nodejs.org
   ```

2. **Dependencies Not Installing**
   ```bash
   make clean
   make install
   ```

3. **TypeScript Errors**
   ```bash
   make type-check
   # Fix any reported type errors
   ```

4. **Build Failures**
   ```bash
   make quality  # Check for linting/type errors
   make clean    # Clean build artifacts
   make build    # Rebuild
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team** - Initial work and ongoing maintenance
- **Project Manager** - Requirements and planning
- **UI/UX Designer** - Design and user experience

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the troubleshooting section above

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release
- Basic timeline views (Vertical, Horizontal, Table)
- Event management with priorities and deadlines
- Reusable timeline component
- Drafting tool integration
- Responsive design
- TypeScript implementation

### Upcoming Features
- Real-time notifications
- Advanced filtering and search
- Export to PDF/Excel
- User authentication
- Role-based permissions
- Advanced reporting
- Mobile app companion

---

**Made with ❤️ for better project communication management**