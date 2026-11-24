FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock ./
RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next-config.js ./
COPY --from=builder /app/.env .env

# Copy package.json and install production deps
COPY package.json package-lock ./
RUN npm install --production

# Expose port 80 (Next.js will listen on this port)
EXPOSE 80

# Start Next.js server on port 80
CMD ["npm", "start"]