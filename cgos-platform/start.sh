#!/bin/bash
set -e

# Run Prisma migrations (continue even if fails, app may work without migrations initially)
echo "Running Prisma migrations..."
npx prisma migrate deploy --preview-feature 2>&1 || {
  echo "Warning: Prisma migrate deploy had issues, continuing..."
}

# Generate Prisma Client (continue even if fails, app may work in degraded mode)
echo "Generating Prisma Client..."
npx prisma generate 2>&1 || {
  echo "Warning: Prisma generate had issues, the app will use fallback data handling..."
}

# Start the application
echo "Starting CGOS application..."
npm start