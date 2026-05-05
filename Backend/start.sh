#!/bin/bash
set -e

echo "Building TypeScript..."
npm run build

echo "Starting server..."
npm start
