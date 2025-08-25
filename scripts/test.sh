set -e

TEST_TYPE=${1:-all}

echo "🧪 Running tests for Timeline Communication App..."

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

case $TEST_TYPE in
    unit)
        echo "🔬 Running unit tests..."
        npm run test -- --coverage --watchAll=false
        ;;
    e2e)
        echo "🎭 Running end-to-end tests..."
        # Add E2E test commands here
        echo "E2E tests not implemented yet"
        ;;
    visual)
        echo "👁️ Running visual regression tests..."
        # Add visual regression test commands here
        echo "Visual tests not implemented yet"
        ;;
    performance)
        echo "⚡ Running performance tests..."
        # Add performance test commands here
        echo "Performance tests not implemented yet"
        ;;
    all)
        echo "🎯 Running all tests..."
        npm run test -- --coverage --watchAll=false
        npm run lint
        npm run type-check
        echo "E2E, visual, and performance tests not implemented yet"
        ;;
    *)
        echo "❌ Invalid test type. Use: unit, e2e, visual, performance, or all"
        exit 1
        ;;
esac

echo "✅ Tests completed successfully!"