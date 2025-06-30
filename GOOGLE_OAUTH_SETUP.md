# Google OAuth Setup Guide for StudyNotion

This guide will help you set up Google OAuth authentication for the StudyNotion application.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- The application running locally

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "StudyNotion")
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google Identity" and then "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: StudyNotion
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the steps

4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: StudyNotion Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
   - Click "Create"

5. Note down the Client ID and Client Secret

## Step 4: Configure Environment Variables

### Backend (.env file in root directory)

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=your-session-secret-key
```

### Frontend (.env file in client directory)

Create a `.env` file in the `client` directory:

```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 5: Install Dependencies

### Backend Dependencies

```bash
npm install google-auth-library passport passport-google-oauth20 express-session
```

### Frontend Dependencies

```bash
cd client
npm install @react-oauth/google
```

## Step 6: Test the Setup

1. Start the backend server:
   ```bash
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

3. Navigate to `http://localhost:3000/login`
4. Click on the "Sign in with Google" button
5. Complete the Google OAuth flow

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in Google Cloud Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Client ID not found" error**
   - Verify that `REACT_APP_GOOGLE_CLIENT_ID` is set correctly
   - Make sure the environment variable is loaded

3. **CORS errors**
   - Ensure `CORS_ORIGIN` is set correctly in the backend
   - Check that the frontend URL matches the CORS configuration

4. **"Google authentication failed" error**
   - Check the browser console for detailed error messages
   - Verify that all environment variables are set correctly
   - Ensure the Google+ API is enabled

### Debug Steps

1. Check the browser console for JavaScript errors
2. Check the server console for backend errors
3. Verify all environment variables are loaded correctly
4. Test the Google OAuth flow in an incognito window

## Production Deployment

For production deployment:

1. Update the Google Cloud Console with your production domain
2. Set `NODE_ENV=production` in your environment variables
3. Update all URLs to use HTTPS
4. Use a strong, unique JWT secret
5. Configure proper CORS settings for your production domain

## Security Considerations

1. Never commit your `.env` files to version control
2. Use strong, unique secrets for JWT and session
3. Enable HTTPS in production
4. Regularly rotate your Google OAuth credentials
5. Monitor your application logs for suspicious activity

## API Endpoints

The following Google OAuth endpoints are available:

- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/google/token` - Verify Google token from frontend

## Support

If you encounter any issues:

1. Check the Google Cloud Console for any quota limits
2. Verify your OAuth consent screen is properly configured
3. Ensure all required APIs are enabled
4. Check the application logs for detailed error messages 