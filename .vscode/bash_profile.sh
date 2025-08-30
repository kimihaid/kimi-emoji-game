# Node.js and npm configuration for Git Bash
export PATH="/c/Program Files/nodejs:$PATH"

# Verify Node.js and npm are available
if command -v node >/dev/null 2>&1; then
    echo "Node.js $(node -v) is available"
else
    echo "Warning: Node.js not found in PATH"
fi

if command -v npm >/dev/null 2>&1; then
    echo "npm $(npm -v) is available"
else
    echo "Warning: npm not found in PATH"
fi

# Project-specific aliases
alias dev="npm run dev"
alias build="npm run build"
alias start="npm run start"
alias lint="npm run lint"