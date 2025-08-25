set -e

echo "🛠️ Setting up development environment for Timeline Communication App..."

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup git hooks
echo "🪝 Setting up git hooks..."
if [ -d .git ]; then
    echo "#!/bin/sh" > .git/hooks/pre-commit
    echo "npm run lint && npm run type-check" >> .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks installed"
else
    echo "⚠️ Not a git repository, skipping git hooks"
fi

# Create environment file
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your configuration."
fi

# Install recommended VS Code extensions
if command -v code &> /dev/null; then
    echo "🔧 Installing recommended VS Code extensions..."
    code --install-extension bradlc.vscode-tailwindcss
    code --install-extension esbenp.prettier-vscode
    code --install-extension dbaeumer.vscode-eslint
    code --install-extension ms-vscode.vscode-typescript-next
    echo "✅ VS Code extensions installed"
fi

# Run initial tests
echo "🧪 Running initial tests..."
npm run test -- --watchAll=false

echo "🎉 Development environment setup completed!"
echo ""
echo "🚀 To start developing:"
echo "   npm start         # Start development server"
echo "   make dev          # Alternative using Makefile"
echo ""
echo "🔧 Available commands:"
echo "   npm run lint      # Run ESLint"
echo "   npm run test      # Run tests"
echo "   npm run build     # Build for production"
echo "   make help         # Show all Makefile commands"
