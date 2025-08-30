# VS Code Terminal Setup for Node.js Development

This document provides instructions for setting up VS Code integrated terminal to work properly with Node.js and npm commands.

## Current Environment Status

✅ **Node.js**: v22.19.0 (Installed)  
✅ **npm**: v10.9.3 (Working in PowerShell)  
✅ **Git**: v2.51.0 (Installed)  
✅ **Execution Policy**: Resolved (scripts can run)  

## VS Code Configuration

The following VS Code workspace settings have been configured in `.vscode/settings.json`:

```json
{
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell",
      "args": ["-NoLogo"]
    },
    "Git Bash": {
      "path": "C:\\Program Files\\Git\\bin\\bash.exe",
      "icon": "terminal-bash"
    }
  },
  "terminal.integrated.inheritEnv": true,
  "terminal.integrated.env.windows": {
    "PATH": "${env:PATH};C:\\Program Files\\nodejs"
  },
  "terminal.integrated.cwd": "${workspaceFolder}",
  "terminal.integrated.allowWorkspaceConfiguration": true
}
```

## Quick Setup Steps

1. **Restart VS Code** after the configuration files are created
2. **Open a new integrated terminal** (`Ctrl+` ` or `Terminal > New Terminal`)
3. **Select PowerShell** as the default profile if prompted
4. **Verify the setup** by running the verification script

## Verification Scripts

Two verification scripts are available to test your environment:

### PowerShell Verification
```powershell
.\.vscode\verify-environment.ps1
```

### Bash Verification
```bash
./.vscode/verify-environment.sh
```

## Terminal Profiles

### PowerShell (Recommended for Development)
- **Node.js**: v22.19.0
- **npm**: v10.9.3
- **Best for**: Next.js development, npm scripts, Windows development
- **Usage**: Primary development terminal

### Git Bash (Alternative)
- **Node.js**: Available via WSL path
- **npm**: v10.8.2
- **Best for**: Shell scripts, Unix commands, cross-platform testing
- **Usage**: Secondary terminal for specific tasks

## Available Project Commands

Once the terminal is set up, you can use these commands:

```bash
# Development server
npm run dev

# Build production version
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Install dependencies
npm install
```

## Troubleshooting

### If `node` or `npm` commands are not recognized:

1. **Restart VS Code** completely
2. **Check terminal profile**: Use `Terminal > Select Default Profile` and choose PowerShell
3. **Verify PATH**: Run `echo $env:PATH` (PowerShell) or `echo $PATH` (Bash)
4. **Run verification script**: `.\.vscode\verify-environment.ps1`

### If execution policy errors occur:

1. The issue should be resolved with Git installation
2. If problems persist, run in PowerShell as Administrator:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### If VS Code terminal doesn't inherit settings:

1. Close all VS Code windows
2. Restart VS Code
3. Open the project folder
4. Create a new terminal

## Development Workflow

### Recommended Terminal Setup:
1. **Primary**: PowerShell terminal for npm commands and development
2. **Secondary**: Git Bash terminal for shell scripts and Unix commands

### Starting Development:
```powershell
# In PowerShell terminal
cd C:\www\kimi-game
npm install    # Install dependencies (if needed)
npm run dev    # Start development server
```

The development server will be available at `http://localhost:3000`.

## Project Structure Support

The configuration supports the Next.js project structure:
- **Framework**: Next.js 14.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Next.js built-in

## Additional Notes

- VS Code workspace settings are project-specific and stored in `.vscode/settings.json`
- Global VS Code settings can be configured in User Settings if needed
- Both PowerShell and Git Bash profiles are configured for flexibility
- The setup ensures PATH inheritance for proper Node.js/npm access

For any issues, run the verification scripts to diagnose the problem and ensure all components are working correctly.