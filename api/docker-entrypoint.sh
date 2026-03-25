#!/bin/sh
set -e

echo "Starting Feedback Widget API..."

# Wait for database to be ready
echo "Waiting for database..."
until nc -z postgres 5432; do
  echo "   Database is unavailable - sleeping"
  sleep 1
done
echo "Database is ready!"

# Install dependencies if needed (development mode)
if [ "$NODE_ENV" = "development" ]; then
  echo "Installing dependencies..."
  bun install
fi

# Generate Prisma client
echo "Generating Prisma client..."
bunx prisma generate

# Run migrations
echo "Running database migrations..."
bunx prisma migrate deploy

# Seed database (optional, will skip if data exists) - try bun first, then tsx
echo "Seeding database..."
bun run prisma/seed.ts 2>/dev/null || bunx tsx prisma/seed.ts 2>/dev/null || echo "Skipping seed (may already have data)"

echo "Setup complete!"
echo ""

# Start the application
echo "Starting API server..."
exec "$@"
