# Node.js 20 runtime for LADO AI agent platform
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install curl for health checks (optional but useful for production)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose port for API server
EXPOSE 3000

# Labels for versioning and metadata
LABEL maintainer="Costa Spirits LLC <hello@costaspirits.com>"
LABEL org.opencontainers.image.title="LADO Server"
LABEL org.opencontainers.image.description="LADO AI Agent Platform - Server Component"
LABEL org.opencontainers.image.version="0.1.0"
LABEL org.opencontainers.image.source="https://github.com/costaspirits/lado"

# Default command to start the application
CMD ["node", "index.js"]
