#!/bin/bash
# Environment verification script for VS Code integrated terminal

echo "=== Node.js and npm Environment Setup Verification ==="
echo

# Check if we're in PowerShell or Bash
if [ "$0" != "bash" ]; then
    echo "Running in Bash environment"
    SHELL_TYPE="bash"
else
    echo "Running in PowerShell environment"
    SHELL_TYPE="powershell"
fi

echo "Current working directory: $(pwd)"
echo

# Add Node.js to PATH for this session
export PATH="/c/Program Files/nodejs:$PATH"

echo "=== Environment Variables ==="
echo "PATH (Node.js related):"
echo "$PATH" | tr ':' '\n' | grep -i node
echo

echo "=== Node.js Version Check ==="
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js found: $(node -v)"
else
    echo "❌ Node.js not found in PATH"
    echo "   Expected location: /c/Program Files/nodejs"
    echo "   Checking if file exists..."
    if [ -f "/c/Program Files/nodejs/node.exe" ]; then
        echo "   ✅ Node.js executable found at expected location"
        echo "   Adding to PATH for this session..."
        export PATH="/c/Program Files/nodejs:$PATH"
        if command -v node >/dev/null 2>&1; then
            echo "   ✅ Node.js now available: $(node -v)"
        fi
    else
        echo "   ❌ Node.js executable not found"
    fi
fi

echo
echo "=== npm Version Check ==="
if command -v npm >/dev/null 2>&1; then
    echo "✅ npm found: $(npm -v)"
else
    echo "❌ npm not found in PATH"
    echo "   Expected location: /c/Program Files/nodejs"
    if [ -f "/c/Program Files/nodejs/npm" ] || [ -f "/c/Program Files/nodejs/npm.cmd" ]; then
        echo "   ✅ npm executable found at expected location"
    else
        echo "   ❌ npm executable not found"
    fi
fi

echo
echo "=== Project Dependencies Check ==="
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "Project: $(grep '"name"' package.json | cut -d'"' -f4)"
    echo "Scripts available:"
    grep '".*"' package.json | grep -A 10 '"scripts"' | tail -n +2 | head -n -1
else
    echo "❌ package.json not found in current directory"
fi

echo
echo "=== Recommendations ==="
echo "1. Restart VS Code after configuration changes"
echo "2. Use 'Terminal -> New Terminal' to create a new integrated terminal"
echo "3. Select 'PowerShell' as the terminal profile for best Node.js support"
echo "4. If issues persist, try: 'Terminal -> Select Default Profile'"