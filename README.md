# StudyNotion - Modern E-Learning Platform

A comprehensive e-learning platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring modern UI/UX, Google OAuth authentication, and advanced course management capabilities.

![StudyNotion](https://img.shields.io/badge/StudyNotion-E--Learning%20Platform-blue)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-18.0+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)

## 🚀 Features

### 🎨 Modern UI/UX
- **Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Beautiful Animations** - Smooth transitions and hover effects
- **Modern Color Scheme** - Professional and accessible color palette

### 🔐 Authentication & Security
- **Google OAuth 2.0** - Secure social login integration
- **JWT Token Authentication** - Stateless authentication system
- **Protected Routes** - Role-based access control
- **Password Hashing** - Secure password storage with bcrypt

### 📚 Course Management
- **Comprehensive Course Catalog** - 10+ sample courses with real data
- **Advanced Search & Filtering** - Search by title, description, level, price, rating
- **Multiple View Modes** - Grid and list view options
- **Course Thumbnails** - High-quality course preview images
- **Video Integration** - Course video playback with custom player
- **Progress Tracking** - Learning progress and completion status

### 🎯 User Experience
- **Personalized Dashboard** - Analytics, recent courses, and quick actions
- **Wishlist Management** - Save and manage favorite courses
- **User Profiles** - Editable profiles with avatar upload
- **Course Reviews & Ratings** - Community-driven course feedback
- **Learning Analytics** - Track learning progress and achievements

### 🛠 Technical Features
- **Real-time Updates** - React Query for efficient data fetching
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Loading States** - Skeleton loaders and progress indicators
- **Form Validation** - Client and server-side validation
- **File Upload** - Profile pictures and course materials
- **API Rate Limiting** - Protection against abuse

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Google OAuth Credentials** (for authentication)

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Matloob333/StudyNotion.git
cd StudyNotion
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/studynotion
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studynotion

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Configuration
SESSION_SECRET=your-session-secret-key

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to your `.env` file

### 5. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew
brew services start mongodb-community
```

#### Option B: MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Get connection string and add to `.env`

### 6. Seed Database

```bash
# Seed sample courses
npm run seed

# Add videos to courses (optional)
npm run add-videos
```

## 🚀 Running the Application

### Development Mode

```bash
# Start backend server (from root directory)
npm run dev

# Start frontend (in new terminal, from root directory)
npm run client

# Or run both simultaneously
npm run dev
```

### Production Mode

```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

## 📁 Project Structure

```
studynotion/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── index.js       # App entry point
│   └── package.json
├── data/                  # Sample data
├── middleware/            # Express middleware
├── models/                # Mongoose models
├── routes/                # API routes
├── scripts/               # Database scripts
├── uploads/               # File uploads
├── server.js             # Express server
└── package.json
```

## 🔧 Available Scripts

### Root Directory
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run client` - Start React development server
- `npm run seed` - Seed database with sample courses
- `npm run add-videos` - Add sample videos to courses

### Client Directory
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:id` - Remove from wishlist
- `GET /api/users/wishlist` - Get user wishlist
- `GET /api/users/dashboard` - Get dashboard data

### File Upload
- `POST /api/upload/profile-picture` - Upload profile picture
- `POST /api/upload/course-video` - Upload course video

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. Customize colors and themes in:
- `client/tailwind.config.js` - Tailwind configuration
- `client/src/index.css` - Global styles
- `client/src/contexts/ThemeContext.js` - Theme management

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Create API routes in `routes/` directory
4. Add Mongoose models in `models/` directory

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Set build command: `cd client && npm run build`
   - Set publish directory: `client/build`

### Backend Deployment (Heroku/Railway)

1. **Prepare for deployment:**
   ```bash
   # Add Procfile
   echo "web: node server.js" > Procfile
   
   # Update package.json scripts
   ```

2. **Deploy to Heroku:**
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   git push heroku main
   ```

3. **Deploy to Railway:**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
CLIENT_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icons
- [React Query](https://tanstack.com/query) - Data fetching
- [React Hot Toast](https://react-hot-toast.com/) - Notifications

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Matloob333/StudyNotion/issues) page
2. Create a new issue with detailed description
3. Contact: [Your Email]

---

**Made with ❤️ by [Your Name]**

*StudyNotion - Empowering Education Through Technology* 