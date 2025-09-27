# Multi-stage Dockerfile for Veridi OS
# Stage 1: Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Stage 2: Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production

# Install serve for serving static files
RUN npm install -g serve

WORKDIR /app

# Copy backend from backend-builder stage
COPY --from=backend-builder /app/backend ./

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./public

# Create a simple script to run both services
RUN echo '#!/bin/sh\n\
# Start backend in background\n\
node server.js &\n\
# Start frontend server\n\
serve -s public -l 3000\n\
' > start.sh && chmod +x start.sh

EXPOSE 4000 3000

CMD ["./start.sh"]
