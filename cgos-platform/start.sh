#!/bin/bash
set -e

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy --preview-feature

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Start the application
echo "Starting CGOS application..."
npm start