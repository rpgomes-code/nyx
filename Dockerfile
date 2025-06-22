# Use the official Node.js 20 alpine image
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS dependencies
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma

# Install only production dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml* ./

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Set environment variable for port
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
ENTRYPOINT ["node", "server.js"]