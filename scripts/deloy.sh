# Deploys the application to specified environment

set -e

ENVIRONMENT=${1:-staging}
BUILD_NUMBER=${2:-$(date +%Y%m%d%H%M%S)}

echo "🚀 Deploying Timeline Communication App to $ENVIRONMENT..."

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'."
    exit 1
fi

# Build the application
echo "🔨 Building application..."
./scripts/build.sh

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf "timeline-app-$BUILD_NUMBER.tar.gz" build/

# Deploy based on environment
case $ENVIRONMENT in
    staging)
        echo "🎭 Deploying to staging environment..."
        # Add your staging deployment commands here
        # Example: scp, rsync, cloud provider CLI, etc.
        echo "   Staging URL: https://staging.timeline-app.com"
        ;;
    production)
        echo "🏭 Deploying to production environment..."
        # Add your production deployment commands here
        # Example: cloud provider deployment, docker registry push, etc.
        echo "   Production URL: https://timeline-app.com"
        ;;
esac

echo "✅ Deployment to $ENVIRONMENT completed successfully!"
echo "🏷️ Build number: $BUILD_NUMBER"
