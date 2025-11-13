#!/bin/bash
set -e

# Navigate to client directory and build
cd "$(dirname "$0")/client"
npm install
npm run build

