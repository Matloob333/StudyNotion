const express = require('express');
const { body, validationResult } = require('express-validator');
const { Course, User } = require('../models/index');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, level, price, rating, sort, limit = 20, page = 1 } = req.query;
    
    let query = { isPublished: true };
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by level
    if (level) {
      query.level = level;
    }
    
    // Filter by price
    if (price) {
      switch (price) {
        case 'free':
          query.price = 0;
          break;
        case 'paid':
          query.price = { $gt: 0 };
          break;
        case 'under1000':
          query.price = { $lt: 1000 };
          break;
        case '1000to2000':
          query.price = { $gte: 1000, $lte: 2000 };
          break;
        case 'over2000':
          query.price = { $gt: 2000 };
          break;
      }
    }
    
    // Filter by rating
    if (rating) {
      query.averageRating = { $gte: parseInt(rating) };
    }
    
    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'duration':
        sortOption = { totalDuration: 1 };
        break;
      case 'students':
        sortOption = { totalStudents: -1 };
        break;
      default:
        sortOption = { totalStudents: -1, averageRating: -1 };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('instructor', 'name email')
      .populate('category', 'name');
    
    const total = await Course.countDocuments(query);
    
    res.json({
      courses,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + courses.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profilePicture')
      .populate('category', 'name')
      .populate('reviews.user', 'name profilePicture')
      .populate('enrolledStudents.student', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Instructor/Admin only)
router.post('/', [
  auth,
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('courseDescription').notEmpty().withMessage('Course description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level'),
  body('totalDuration').isNumeric().withMessage('Total duration must be a number'),
  body('totalLectures').isNumeric().withMessage('Total lectures must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };
    
    const course = new Course(courseData);
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Course instructor or Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    const user = await User.findById(req.user.id);
    if (course.instructor.toString() !== req.user.id && user.accountType !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    await updatedCourse.calculateTotalDuration();
    await updatedCourse.calculateTotalLectures();

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Course instructor or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    const user = await User.findById(req.user.id);
    if (course.instructor.toString() !== req.user.id && user.accountType !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: 'Course is not published' });
    }

    await course.enrollStudent(req.user.id);

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    if (error.message.includes('already enrolled')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('enrollment is full')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/rate
// @desc    Rate a course
// @access  Private
router.post('/:id/rate', [
  auth,
  body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  body('review', 'Review is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Must be enrolled to rate this course' });
    }

    // Check if already rated
    const existingRating = course.ratings.find(rating => rating.user.toString() === req.user.id);
    if (existingRating) {
      return res.status(400).json({ message: 'Already rated this course' });
    }

    const { rating, review } = req.body;
    course.ratings.push({
      user: req.user.id,
      rating,
      review
    });

    await course.save();
    await course.calculateAverageRating();

    res.json({ message: 'Rating added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/courses/:id/upload-video
// @desc    Upload course video
// @access  Private (Instructor/Admin only)
router.post('/:id/upload-video', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    const user = await User.findById(req.user.id);
    if (course.instructor.toString() !== req.user.id && user.accountType !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if video data is provided
    if (!req.body.videoData) {
      return res.status(400).json({ message: 'Video data is required' });
    }

    // Convert base64 to buffer
    const videoBuffer = Buffer.from(req.body.videoData, 'base64');
    
    // Check file size (100KB limit)
    if (videoBuffer.length > 102400) {
      return res.status(400).json({ message: 'Video file size must be less than 100KB' });
    }

    // Update course video
    course.courseVideo = {
      data: videoBuffer,
      contentType: req.body.contentType || 'video/mp4',
      size: videoBuffer.length
    };

    await course.save();
    res.json({ message: 'Course video uploaded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/courses/:id/video
// @desc    Stream course video
// @access  Public
router.get('/:id/video', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.courseVideo) {
      return res.status(404).json({ message: 'Course video not found' });
    }

    // Set headers for video streaming
    res.set({
      'Content-Type': course.courseVideo.contentType,
      'Content-Length': course.courseVideo.size,
      'Accept-Ranges': 'bytes'
    });

    res.send(course.courseVideo.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/courses/:courseId/lectures/:lectureId/video
// @desc    Stream lecture video
// @access  Private (for enrolled students)
router.get('/:courseId/lectures/:lectureId/video', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the lecture
    let lecture = null;
    for (const section of course.courseContent) {
      const foundLecture = section.lectures.find(l => l._id.toString() === req.params.lectureId);
      if (foundLecture) {
        lecture = foundLecture;
        break;
      }
    }

    if (!lecture || !lecture.videoFile) {
      return res.status(404).json({ message: 'Lecture video not found' });
    }

    // Check if user is enrolled (for non-preview lectures)
    if (!lecture.isPreview) {
      if (!course.enrolledStudents.includes(req.user.id)) {
        return res.status(403).json({ message: 'Must be enrolled to access this lecture' });
      }
    }

    // Set headers for video streaming
    res.set({
      'Content-Type': lecture.videoFile.contentType,
      'Content-Length': lecture.videoFile.size,
      'Accept-Ranges': 'bytes'
    });

    res.send(lecture.videoFile.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/courses/:id/reviews
// @desc    Get course reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const course = await Course.findById(req.params.id)
      .populate('reviews.user', 'name profilePicture')
      .select('reviews');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = course.reviews.slice(skip, skip + parseInt(limit));
    const total = course.reviews.length;
    
    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + reviews.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id/enrollment-status
// @desc    Check enrollment status
// @access  Private
router.get('/:id/enrollment-status', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const enrollment = course.enrolledStudents.find(
      enrollment => enrollment.student.toString() === req.user.id
    );
    
    res.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 