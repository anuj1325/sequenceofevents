#!/bin/bash
set -e

# Function to replace environment variables in built files
replace_env_vars() {
    echo "Replacing environment variables in built files..."
    
    # List of environment variables to replace
    ENV_VARS=(
        "REACT_APP_API_BASE_URL"
        "REACT_APP_ENVIRONMENT"
        "REACT_APP_VERSION"
    )
    
    # Replace variables in main JavaScript files
    find /usr/share/nginx/html/static/js -name "*.js" -exec sed -i "
        s|REACT_APP_API_BASE_URL_PLACEHOLDER|${REACT_APP_API_BASE_URL:-http://localhost:3001/api}|g;
        s|REACT_APP_ENVIRONMENT_PLACEHOLDER|${REACT_APP_ENVIRONMENT:-production}|g;
        s|REACT_APP_VERSION_PLACEHOLDER|${REACT_APP_VERSION:-1.0.0}|g;
    " {} \;
}

# Replace environment variables if needed
if [ "${REPLACE_ENV_VARS:-false}" = "true" ]; then
    replace_env_vars
fi

# Execute the main command
exec "$@"