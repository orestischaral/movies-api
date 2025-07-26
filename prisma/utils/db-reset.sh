#!/bin/bash

echo "🔁 Resetting Prisma schema..."

# Drop and recreate the database
echo "🧨 Dropping existing database (you must configure this manually or use CLI)..."

# WARNING: Uncomment only if you want to automate DB drop (PostgreSQL)
# Replace with your DB name and credentials
# dropdb moviesdb && createdb moviesdb

# Reset migrations and schema
npx prisma migrate reset --force --skip-seed

# Regenerate Prisma Client
npx prisma generate

# Seed the database
npx prisma db seed

echo "✅ Database reset and seeded successfully."
