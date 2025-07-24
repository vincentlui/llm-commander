# Google Drive Integration Setup Guide

## Overview
This guide explains how to integrate Google Drive file import functionality into the LLM Commander application.

## Prerequisites
1. Google Cloud Console project with Drive API enabled
2. OAuth 2.0 credentials configured
3. Google Drive API client library

## Setup Steps

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Drive API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins (e.g., `http://localhost:5174`)

### 2. Environment Configuration
Create a `.env` file with:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_API_KEY=your_api_key_here
```

### 3. Install Google APIs
```bash
npm install google-auth-library googleapis
```

### 4. Implementation
The current implementation shows a placeholder. For full functionality:

1. Initialize Google Auth in your React app
2. Use Google Drive Picker API for file selection
3. Download selected files using Drive API
4. Process and index the files

## Security Considerations
- Store credentials securely
- Implement proper OAuth flow
- Handle token refresh
- Validate file types and sizes

## Current Status
The Google Drive import button currently shows an alert explaining the requirements. To implement:
1. Follow the setup steps above
2. Replace the placeholder function in `FilesTab.tsx`
3. Add proper Google Drive integration code

## Example Implementation
See `src/utils/googleDriveIntegration.js` for a basic implementation template.
