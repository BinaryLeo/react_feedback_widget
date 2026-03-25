# ==========================================
# Multi-stage Dockerfile for Feedback Widget API (Bun)
# ==========================================

# ------------------------------------------
# Development Stage
# ------------------------------------------
FROM oven/bun:1-alpine AS development

# Install necessary tools for health checks and database waiting
RUN apk add --no-cache netcat-openbsd dumb-init

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies)
RUN bun install

# Generate Prisma client
RUN bunx prisma generate

# Copy source code
COPY . .

# Make entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Create non-root user for security
RUN addgroup -g 1001 -S bunjs && \
    adduser -S bunjs -u 1001

# Change ownership to bunjs user
RUN chown -R bunjs:bunjs /app
USER bunjs

EXPOSE 3333

# Use entrypoint script for automatic setup
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["bun", "run", "dev:bun"]

# ------------------------------------------
# Production Builder Stage
# ------------------------------------------
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install all dependencies
RUN bun install

# Generate Prisma client
RUN bunx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN bun run build

# ------------------------------------------
# Production Stage
# ------------------------------------------
FROM oven/bun:1-alpine AS production

# Install dumb-init for proper signal handling and wget for healthcheck
RUN apk add --no-cache dumb-init wget netcat-openbsd

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Copy production entrypoint script
COPY docker-entrypoint.prod.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S bunjs && \
    adduser -S bunjs -u 1001

# Change ownership
RUN chown -R bunjs:bunjs /app
USER bunjs

EXPOSE 3333

# Health check for production
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3333/health || exit 1

# Use entrypoint script for automatic migrations
ENTRYPOINT ["./docker-entrypoint.sh"]

# Start the server
CMD ["bun", "run", "dist/server.js"]
