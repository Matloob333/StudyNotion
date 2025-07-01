const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting with proper configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use X-Forwarded-For if available, otherwise use IP
    return req.headers['x-forwarded-for'] || req.ip;
  }
});
app.use(limiter);

// Serve static files from the React app build directory FIRST
if (process.env.NODE_ENV === 'production') {
  console.log('📁 Serving static files from client/build');
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// Global variable to track MongoDB connection status
let isMongoConnected = false;

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studynotion';
    
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('📡 MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log('✅ MongoDB Connected Successfully');
    isMongoConnected = true;
    
    // Load models after successful connection
    const { User, Course, Category } = require('./models/index');
    
    console.log('📦 Models loaded successfully:');
    console.log('- User model:', typeof User.findOne);
    console.log('- Course model:', typeof Course.find);
    console.log('- Category model:', typeof Category.find);
    
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('🔧 Troubleshooting tips:');
    console.error('1. Check your MONGODB_URI environment variable');
    console.error('2. Verify your MongoDB Atlas credentials');
    console.error('3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.error('4. Check if your MongoDB cluster is running');
    
    console.log('⚠️  Server will continue without database connection');
    isMongoConnected = false;
  }
};

// Load API routes (will work with or without MongoDB)
console.log('🚀 Loading API routes...');
app.use('/api/health', require('./routes/health'));

// Add database status check endpoint
app.get('/api/db-status', (req, res) => {
  res.json({ 
    connected: isMongoConnected, 
    message: isMongoConnected ? 'Database connected' : 'Database not connected'
  });
});

// Load other routes with error handling
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/admin', require('./routes/admin'));
  console.log('✅ All API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading some API routes:', error.message);
}

// Connect to MongoDB
connectDB();

// Handle React routing, return all requests to React app (AFTER API routes)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 DB Status: http://localhost:${PORT}/api/db-status`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
}); 