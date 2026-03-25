#!/bin/sh
set -e

echo "Starting Feedback Widget API (Production)..."

# Wait for database to be ready
echo "Waiting for database..."
until nc -z postgres 5432; do
  echo "   Database is unavailable - sleeping"
  sleep 1
done
echo "Database is ready!"

# Generate Prisma client (in case it wasn't generated during build)
echo "Generating Prisma client..."
bunx prisma generate

# Run migrations
echo "Running database migrations..."
bunx prisma migrate deploy

# Seed database (optional, will skip if data exists)
echo "Seeding database (if needed)..."
bunx prisma db seed || echo "Skipping seed (may already have data)"

echo "Setup complete!"
echo ""

# Start the application
echo "Starting API server..."
exec "$@"
