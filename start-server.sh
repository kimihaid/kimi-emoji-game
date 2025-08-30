#!/bin/bash

# Emoji Sound Designer Server Startup Script
echo "🎵 Starting Emoji Sound Designer Server..."

# Check for available HTTP servers and start the first one found
if command -v python3 &> /dev/null; then
    echo "Using Python 3 HTTP server"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python HTTP server"
    python -m http.server 8000
elif command -v node &> /dev/null; then
    echo "Using Node.js HTTP server"
    npx http-server -p 8000 -c-1
elif command -v php &> /dev/null; then
    echo "Using PHP built-in server"
    php -S localhost:8000
else
    echo "❌ No suitable HTTP server found!"
    echo "Please install one of: python3, python, node.js, or php"
    exit 1
fi