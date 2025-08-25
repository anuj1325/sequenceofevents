# Timeline Communication App - Makefile
# Author: Development Team
# Description: Build automation for Timeline Communication React App

# Variables
NODE_VERSION := 18
NPM_VERSION := 8
PROJECT_NAME := timeline-communication-app
BUILD_DIR := build
SRC_DIR := src
DIST_DIR := dist

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help target
help: ## Show this help message
	@echo "$(GREEN)Timeline Communication App - Available Commands$(NC)"
	@echo "=================================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Setup and Installation
install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@if ! command -v node >/dev/null 2>&1; then \
		echo "$(RED)Error: Node.js is not installed$(NC)"; \
		exit 1; \
	fi
	@if ! command -v npm >/dev/null 2>&1; then \
		echo "$(RED)Error: npm is not installed$(NC)"; \
		exit 1; \
	fi
	npm install
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

setup: ## Setup the project for the first time
	@echo "$(GREEN)Setting up Timeline Communication App...$(NC)"
	@make install
	@make setup-git-hooks
	@echo "$(GREEN)Project setup completed!$(NC)"

setup-git-hooks: ## Setup git hooks for code quality
	@echo "$(GREEN)Setting up git hooks...$(NC)"
	@if [ -d .git ]; then \
		echo "#!/bin/sh\nnpm run lint && npm run type-check" > .git/hooks/pre-commit; \
		chmod +x .git/hooks/pre-commit; \
		echo "$(GREEN)Git hooks setup completed!$(NC)"; \
	else \
		echo "$(YELLOW)Not a git repository, skipping git hooks setup$(NC)"; \
	fi

# Development
dev: ## Start development server
	@echo "$(GREEN)Starting development server...$(NC)"
	npm run start

start: dev ## Alias for dev

# Building
build: ## Build the application for production
	@echo "$(GREEN)Building application for production...$(NC)"
	npm run type-check
	npm run build
	@echo "$(GREEN)Build completed successfully!$(NC)"

build-dev: ## Build the application for development
	@echo "$(GREEN)Building application for development...$(NC)"
	GENERATE_SOURCEMAP=true npm run build
	@echo "$(GREEN)Development build completed!$(NC)"

# Testing and Quality
test: ## Run tests
	@echo "$(GREEN)Running tests...$(NC)"
	npm run test -- --coverage --watchAll=false

test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	npm run test

lint: ## Run ESLint
	@echo "$(GREEN)Running ESLint...$(NC)"
	npm run lint

lint-fix: ## Run ESLint and fix issues
	@echo "$(GREEN)Running ESLint with auto-fix...$(NC)"
	npm run lint:fix

format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code with Prettier...$(NC)"
	npm run format

type-check: ## Run TypeScript type checking
	@echo "$(GREEN)Running TypeScript type check...$(NC)"
	npm run type-check

quality: ## Run all quality checks
	@echo "$(GREEN)Running all quality checks...$(NC)"
	@make lint
	@make type-check
	@make test
	@echo "$(GREEN)All quality checks passed!$(NC)"

# Deployment
serve: ## Serve production build locally
	@echo "$(GREEN)Serving production build...$(NC)"
	@if [ ! -d "$(BUILD_DIR)" ]; then \
		echo "$(YELLOW)Build directory not found. Running build first...$(NC)"; \
		make build; \
	fi
	npm run serve

deploy-staging: ## Deploy to staging environment
	@echo "$(GREEN)Deploying to staging...$(NC)"
	@make build
	@echo "$(YELLOW)Add your staging deployment commands here$(NC)"

deploy-prod: ## Deploy to production environment
	@echo "$(GREEN)Deploying to production...$(NC)"
	@make quality
	@make build
	@echo "$(YELLOW)Add your production deployment commands here$(NC)"

# Maintenance
clean: ## Clean build artifacts and dependencies
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	rm -rf $(BUILD_DIR)
	rm -rf $(DIST_DIR)
	rm -rf node_modules
	rm -rf .eslintcache
	@echo "$(GREEN)Clean completed!$(NC)"

reinstall: ## Clean and reinstall dependencies
	@echo "$(GREEN)Reinstalling dependencies...$(NC)"
	@make clean
	@make install
	@echo "$(GREEN)Reinstall completed!$(NC)"

update: ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	npm update
	npm audit fix
	@echo "$(GREEN)Dependencies updated!$(NC)"

# Documentation
docs: ## Generate documentation
	@echo "$(GREEN)Generating documentation...$(NC)"
	@echo "$(YELLOW)Documentation generation not implemented yet$(NC)"

# Docker (if needed)
docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(NC)"
	@if [ -f Dockerfile ]; then \
		docker build -t $(PROJECT_NAME) .; \
	else \
		echo "$(RED)Dockerfile not found$(NC)"; \
		exit 1; \
	fi

docker-run: ## Run Docker container
	@echo "$(GREEN)Running Docker container...$(NC)"
	docker run -p 3000:3000 $(PROJECT_NAME)

# Utilities
check-env: ## Check environment setup
	@echo "$(GREEN)Checking environment...$(NC)"
	@echo "Node.js version: $$(node --version)"
	@echo "npm version: $$(npm --version)"
	@echo "TypeScript version: $$(npx tsc --version)"
	@if [ -f package.json ]; then \
		echo "$(GREEN)package.json found$(NC)"; \
	else \
		echo "$(RED)package.json not found$(NC)"; \
	fi

stats: ## Show project statistics
	@echo "$(GREEN)Project Statistics$(NC)"
	@echo "=================="
	@echo "Lines of TypeScript code:"
	@find $(SRC_DIR) -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1
	@echo "Number of TypeScript files:"
	@find $(SRC_DIR) -name "*.ts" -o -name "*.tsx" | wc -l
	@echo "Project size:"
	@du -sh .

backup: ## Create project backup
	@echo "$(GREEN)Creating project backup...$(NC)"
	@tar -czf "$(PROJECT_NAME)-backup-$$(date +%Y%m%d-%H%M%S).tar.gz" \
		--exclude=node_modules \
		--exclude=$(BUILD_DIR) \
		--exclude=$(DIST_DIR) \
		--exclude=.git \
		.
	@echo "$(GREEN)Backup created successfully!$(NC)"

# Development utilities
component: ## Create a new component (usage: make component name=ComponentName)
	@if [ -z "$(name)" ]; then \
		echo "$(RED)Error: Component name is required. Usage: make component name=ComponentName$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Creating component $(name)...$(NC)"
	@mkdir -p $(SRC_DIR)/components/$(name)
	@echo "import React from 'react';\n\ninterface $(name)Props {\n  // Add props here\n}\n\nexport const $(name): React.FC<$(name)Props> = () => {\n  return (\n    <div>\n      <h1>$(name)</h1>\n    </div>\n  );\n};\n\nexport default $(name);" > $(SRC_DIR)/components/$(name)/$(name).tsx
	@echo "export { default } from './$(name)';\nexport type { $(name)Props } from './$(name)';" > $(SRC_DIR)/components/$(name)/index.ts
	@echo "$(GREEN)Component $(name) created successfully!$(NC)"

.PHONY: help install setup setup-git-hooks dev start build build-dev test test-watch lint lint-fix format type-check quality serve deploy-staging deploy-prod clean reinstall update docs docker-build docker-run check-env stats backup component