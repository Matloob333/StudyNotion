# StudyNotion - Learning Management Platform

A comprehensive study management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring modern UI/UX, Google OAuth, and advanced course management capabilities.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **Google OAuth**: Secure authentication with Google
- **Course Management**: Create, edit, and manage courses with videos
- **User Dashboard**: Comprehensive analytics and progress tracking
- **Advanced Search**: Filter, sort, and search courses
- **Wishlist**: Save courses for later
- **Profile Management**: Update profile with picture upload
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, Google OAuth 2.0
- **File Upload**: Multer
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Google OAuth credentials

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd study-notion
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Configuration
SESSION_SECRET=your_session_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Run the Application

#### Development Mode
```bash
# Run both backend and frontend concurrently
npm run dev
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the server
npm start
```

## 🌐 Deployment on Render

### 1. Prepare Your Repository
- Ensure all changes are committed to your Git repository
- Make sure your `.env` variables are ready

### 2. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `studynotion-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `npm start`
   - **Port**: `5000`

### 3. Environment Variables
Add these environment variables in Render dashboard:
- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret key
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `SESSION_SECRET`: Your session secret
- `CORS_ORIGIN`: Your Render app URL
- `PORT`: `5000`

### 4. Deploy
Click "Create Web Service" and wait for the deployment to complete.

## 📁 Project Structure

```
study-notion/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── package.json
├── models/                # MongoDB models
├── routes/                # API routes
├── middleware/            # Express middleware
├── uploads/               # File uploads
├── scripts/               # Utility scripts
├── server.js              # Express server
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/wishlist` - Add to wishlist

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile-picture` - Upload profile picture

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/courses` - Get all courses

## 🎨 Customization

### Themes
The app supports dark and light themes. Theme preferences are stored in localStorage.

### Styling
- Tailwind CSS is used for styling
- Custom animations and transitions
- Responsive design for all screen sizes

## 🔒 Security Features

- JWT authentication
- Google OAuth integration
- Rate limiting
- Helmet.js for security headers
- CORS configuration
- Input validation
- File upload restrictions

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is connected
4. Check the API endpoints

## 🎯 Roadmap

- [ ] Course categories
- [ ] User reviews and ratings
- [ ] Course progress tracking
- [ ] Payment integration
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support 