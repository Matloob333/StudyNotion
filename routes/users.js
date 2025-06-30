const express = require('express');
const multer = require('multer');
const path = require('path');
const { User, Course } = require('../models/index');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile with enrolled courses
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('enrolledCourses')
      .populate('wishlist')
      .populate('courses');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/enrolled-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/enrolled-courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'instructor',
          select: 'firstName lastName profilePicture'
        }
      });

    res.json(user.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        populate: {
          path: 'instructor',
          select: 'firstName lastName profilePicture'
        }
      });

    res.json(user.wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/wishlist/:courseId
// @desc    Add course to wishlist
// @access  Private
router.post('/wishlist/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(req.params.courseId)) {
      return res.status(400).json({ message: 'Course already in wishlist' });
    }

    user.wishlist.push(req.params.courseId);
    await user.save();

    res.json({ message: 'Course added to wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/users/wishlist/:courseId
// @desc    Remove course from wishlist
// @access  Private
router.delete('/wishlist/:courseId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(
      courseId => courseId.toString() !== req.params.courseId
    );
    await user.save();

    res.json({ message: 'Course removed from wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/instructor-courses
// @desc    Get instructor's courses (for instructors only)
// @access  Private
router.get('/instructor-courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.accountType !== 'Instructor' && user.accountType !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Instructor only.' });
    }

    const courses = await Course.find({ instructor: req.user.id })
      .populate('category', 'name color')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      about,
      dateOfBirth,
      gender
    } = req.body;

    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (about !== undefined) user.about = about;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await user.save();

    res.json({ profilePicture: user.profilePicture });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses')
      .populate('wishlist')
      .populate('courses');

    // Calculate dashboard statistics
    const totalHoursWatched = user.enrolledCourses?.reduce((total, course) => {
      return total + (course.totalDuration || 0);
    }, 0) / 60 || 0;

    const certificatesEarned = user.enrolledCourses?.filter(course => 
      course.progress >= 100
    ).length || 0;

    // Mock current streak (in a real app, this would be calculated from user activity)
    const currentStreak = Math.floor(Math.random() * 15) + 1;

    // Get recent courses (last 3 enrolled)
    const recentCourses = user.enrolledCourses?.slice(0, 3).map(course => ({
      id: course._id,
      title: course.courseName,
      progress: Math.floor(Math.random() * 100) + 1,
      lastAccessed: `${Math.floor(Math.random() * 24) + 1} hours ago`,
      thumbnail: course.thumbnail
    })) || [];

    // Mock upcoming deadlines
    const upcomingDeadlines = [
      {
        id: 1,
        title: 'Web Development Final Project',
        dueDate: '2024-01-15',
        course: 'Complete Web Development Bootcamp'
      },
      {
        id: 2,
        title: 'React Component Assignment',
        dueDate: '2024-01-18',
        course: 'React.js Masterclass 2024'
      }
    ];

    // Mock recent activity
    const recentActivity = [
      {
        description: 'Completed lesson "Introduction to HTML" in Web Development Bootcamp',
        timestamp: '2 hours ago'
      },
      {
        description: 'Earned certificate for "Python Basics"',
        timestamp: '1 day ago'
      },
      {
        description: 'Enrolled in "React.js Masterclass 2024"',
        timestamp: '3 days ago'
      }
    ];

    res.json({
      enrolledCourses: user.enrolledCourses || [],
      totalHoursWatched: Math.round(totalHoursWatched),
      certificatesEarned,
      currentStreak,
      recentCourses,
      upcomingDeadlines,
      recentActivity
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 