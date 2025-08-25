#!/bin/bash

# Timeline Communication App - Project Setup Script
# This script creates a complete React TypeScript project structure
# Usage: chmod +x setup-project.sh && ./setup-project.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="timeline-communication-app"
CURRENT_DIR=$(pwd)
PROJECT_DIR="$CURRENT_DIR/$PROJECT_NAME"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [ "$MAJOR_VERSION" -lt 16 ]; then
            print_error "Node.js version $NODE_VERSION is too old. Please install version 16 or higher."
            exit 1
        fi
        print_status "Node.js version $NODE_VERSION is compatible"
    else
        print_error "Node.js is not installed. Please install Node.js version 16 or higher."
        exit 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_status "npm version $NPM_VERSION found"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Function to create project directory
create_project_structure() {
    print_step "Creating project directory structure..."
    
    if [ -d "$PROJECT_DIR" ]; then
        print_warning "Directory $PROJECT_NAME already exists."
        read -p "Do you want to remove it and continue? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            rm -rf "$PROJECT_DIR"
            print_status "Removed existing directory"
        else
            print_error "Setup cancelled by user"
            exit 1
        fi
    fi
    
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    # Create directory structure
    mkdir -p src/{components/TimelineView,types,utils,hooks,services}
    mkdir -p public
    mkdir -p docs
    mkdir -p .vscode
    
    print_status "Project directory structure created"
}

# Function to create package.json
create_package_json() {
    print_step "Creating package.json..."
    
    cat > package.json << 'EOF'
{
  "name": "timeline-communication-app",
  "version": "1.0.0",
  "description": "A React TypeScript application for tracking communication timeline between Contractor and NHAI",
  "main": "src/index.tsx",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "react-scripts start",
    "lint": "eslint src/**/*.{js,jsx,ts,tsx}",
    "lint:fix": "eslint src/**/*.{js,jsx,ts,tsx} --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}",
    "type-check": "tsc --noEmit",
    "build:prod": "npm run type-check && npm run build",
    "serve": "serve -s build"
  },
  "dependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "lucide-react": "^0.300.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^5.3.3",
    "web-vitals": "^3.5.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.1",
    "serve": "^14.2.1",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "keywords": [
    "react",
    "typescript",
    "timeline",
    "communication",
    "project-management"
  ],
  "author": "Development Team",
  "license": "MIT"
}
EOF
    
    print_status "package.json created"
}

# Function to create TypeScript configuration
create_tsconfig() {
    print_step "Creating TypeScript configuration..."
    
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "build"
  ]
}
EOF
    
    print_status "tsconfig.json created"
}

# Function to create Tailwind CSS configuration
create_tailwind_config() {
    print_step "Creating Tailwind CSS configuration..."
    
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
EOF

    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    
    print_status "Tailwind CSS configuration created"
}

# Function to create main application files
create_app_files() {
    print_step "Creating main application files..."
    
    # Create index.html
    cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Timeline Communication App for tracking project communications" />
    <title>Timeline Communication App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

    # Create index.tsx
    cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

    # Create index.css with Tailwind
    cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
EOF

    # Create types file
    cat > src/types/index.ts << 'EOF'
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
}

export interface AppProps {
  embedded?: boolean;
  onEventClick?: (event: Event) => void;
}

export type ViewType = 'vertical' | 'horizontal' | 'table';
export type PageType = 'dashboard' | 'timeline' | 'table' | 'drafting';
EOF

    print_status "Main application files created"
}

# Function to create configuration files
create_config_files() {
    print_step "Creating configuration files..."
    
    # Create .eslintrc.json
    cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "react-app",
    "react-app/jest",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
EOF

    # Create .prettierrc
    cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF

    # Create .gitignore
    cat > .gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Cache
.eslintcache
*.tsbuildinfo
EOF

    # Create VS Code settings
    cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
EOF

    print_status "Configuration files created"
}

# Function to install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    # Install Create React App first
    if ! command_exists create-react-app; then
        print_status "Installing create-react-app globally..."
        npm install -g create-react-app
    fi
    
    print_status "Installing project dependencies..."
    npm install
    
    print_status "Dependencies installed successfully"
}

# Function to initialize git repository
init_git() {
    print_step "Initializing git repository..."
    
    if command_exists git; then
        git init
        git add .
        git commit -m "Initial commit: Timeline Communication App setup"
        print_status "Git repository initialized"
    else
        print_warning "Git not found. Skipping git initialization."
    fi
}

# Function to create final files
create_final_files() {
    print_step "Creating final project files..."
    
    # Copy the Makefile content (this would be the content from the Makefile artifact)
    cat > project.Makefile << 'EOF'
# Timeline Communication App - Makefile
# Build automation for Timeline Communication React App

.DEFAULT_GOAL := help

help: ## Show help message
	@echo "Timeline Communication App - Available Commands"
	@echo "=============================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "%-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm start

build: ## Build for production
	npm run build

test: ## Run tests
	npm test

lint: ## Run linting
	npm run lint

clean: ## Clean build artifacts
	rm -rf build node_modules

.PHONY: help install dev build test lint clean
EOF
    
    print_status "Final files created"
}

# Function to display completion message
display_completion() {
    echo ""
    echo -e "${GREEN}🎉 Timeline Communication App setup completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📁 Project created in:${NC} $PROJECT_DIR"
    echo ""
    echo -e "${YELLOW}🚀 Next steps:${NC}"
    echo "  1. cd $PROJECT_NAME"
    echo "  2. make dev (or npm start)"
    echo "  3. Open http://localhost:3000 in your browser"
    echo ""
    echo -e "${BLUE}📚 Available commands:${NC}"
    echo "  make help     - Show all available commands"
    echo "  make dev      - Start development server"
    echo "  make build    - Build for production"
    echo "  make test     - Run tests"
    echo "  make lint     - Run code linting"
    echo ""
    echo -e "${GREEN}✨ Happy coding!${NC}"
}

# Main execution
main() {
    echo -e "${GREEN}🔧 Timeline Communication App - Project Setup${NC}"
    echo "=============================================="
    echo ""
    
    # Check prerequisites
    print_step "Checking prerequisites..."
    check_node_version
    check_npm_version
    
    # Create project
    create_project_structure
    create_package_json
    create_tsconfig
    create_tailwind_config
    create_app_files
    create_config_files
    install_dependencies
    create_final_files
    init_git
    
    # Show completion message
    display_completion
}

# Run main function
main "$@"