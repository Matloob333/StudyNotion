const express = require('express');
const { Course, User } = require('../models/index');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin middleware - check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.accountType !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/admin/pending-courses
// @desc    Get all pending courses for approval
// @access  Private (Admin only)
router.get('/pending-courses', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'Pending' } = req.query;
    
    const query = { approvalStatus: status };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email profilePicture')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
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
    console.error('Error fetching pending courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/all-courses
// @desc    Get all courses with approval status
// @access  Private (Admin only)
router.get('/all-courses', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, status, instructor } = req.query;
    
    let query = {};
    if (status) query.approvalStatus = status;
    if (instructor) query.instructor = instructor;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email profilePicture')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
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
    console.error('Error fetching all courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/approve-course/:courseId
// @desc    Approve a course
// @access  Private (Admin only)
router.post('/approve-course/:courseId', [auth, adminAuth], async (req, res) => {
  try {
    const { courseId } = req.params;
    const { adminNotes, adminPriceOverride, adminPriceOverrideReason } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update course approval status
    course.approvalStatus = 'Approved';
    course.adminApprovedBy = req.user.id;
    course.adminApprovedAt = new Date();
    course.adminNotes = adminNotes || '';
    
    // Handle price override
    if (adminPriceOverride !== undefined) {
      course.adminPriceOverride = adminPriceOverride;
      course.adminPriceOverrideReason = adminPriceOverrideReason || '';
      course.price = adminPriceOverride; // Override the original price
    }
    
    // Set as published if approved
    course.isPublished = true;
    course.status = 'Published';
    
    await course.save();
    
    res.json({ 
      message: 'Course approved successfully',
      course: {
        id: course._id,
        courseName: course.courseName,
        approvalStatus: course.approvalStatus,
        price: course.price
      }
    });
  } catch (error) {
    console.error('Error approving course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/reject-course/:courseId
// @desc    Reject a course
// @access  Private (Admin only)
router.post('/reject-course/:courseId', [auth, adminAuth], async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rejectionReason, adminNotes } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update course approval status
    course.approvalStatus = 'Rejected';
    course.adminApprovedBy = req.user.id;
    course.adminApprovedAt = new Date();
    course.adminRejectionReason = rejectionReason;
    course.adminNotes = adminNotes || '';
    course.isPublished = false;
    course.status = 'Draft';
    
    await course.save();
    
    res.json({ 
      message: 'Course rejected successfully',
      course: {
        id: course._id,
        courseName: course.courseName,
        approvalStatus: course.approvalStatus,
        rejectionReason: course.adminRejectionReason
      }
    });
  } catch (error) {
    console.error('Error rejecting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/request-revision/:courseId
// @desc    Request revision for a course
// @access  Private (Admin only)
router.post('/request-revision/:courseId', [auth, adminAuth], async (req, res) => {
  try {
    const { courseId } = req.params;
    const { revisionNotes, adminNotes } = req.body;
    
    if (!revisionNotes) {
      return res.status(400).json({ message: 'Revision notes are required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update course approval status
    course.approvalStatus = 'Under Review';
    course.adminApprovedBy = req.user.id;
    course.adminApprovedAt = new Date();
    course.adminNotes = adminNotes || '';
    course.adminRejectionReason = revisionNotes;
    course.isPublished = false;
    course.status = 'Draft';
    
    await course.save();
    
    res.json({ 
      message: 'Revision requested successfully',
      course: {
        id: course._id,
        courseName: course.courseName,
        approvalStatus: course.approvalStatus,
        revisionNotes: course.adminRejectionReason
      }
    });
  } catch (error) {
    console.error('Error requesting revision:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/instructors
// @desc    Get all instructors
// @access  Private (Admin only)
router.get('/instructors', [auth, adminAuth], async (req, res) => {
  try {
    const instructors = await User.find({ accountType: 'Instructor' })
      .select('firstName lastName email profilePicture createdAt')
      .sort({ createdAt: -1 });
    
    res.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/dashboard', [auth, adminAuth], async (req, res) => {
  try {
    const [
      totalCourses,
      pendingCourses,
      approvedCourses,
      rejectedCourses,
      totalInstructors,
      totalStudents,
      recentCourses
    ] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ approvalStatus: 'Pending' }),
      Course.countDocuments({ approvalStatus: 'Approved' }),
      Course.countDocuments({ approvalStatus: 'Rejected' }),
      User.countDocuments({ accountType: 'Instructor' }),
      User.countDocuments({ accountType: 'Student' }),
      Course.find()
        .populate('instructor', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);
    
    res.json({
      stats: {
        totalCourses,
        pendingCourses,
        approvedCourses,
        rejectedCourses,
        totalInstructors,
        totalStudents
      },
      recentCourses
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/update-course-price/:courseId
// @desc    Update course price (admin override)
// @access  Private (Admin only)
router.put('/update-course-price/:courseId', [auth, adminAuth], async (req, res) => {
  try {
    const { courseId } = req.params;
    const { newPrice, reason } = req.body;
    
    if (!newPrice || newPrice < 0) {
      return res.status(400).json({ message: 'Valid price is required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    course.adminPriceOverride = newPrice;
    course.adminPriceOverrideReason = reason || '';
    course.price = newPrice;
    
    await course.save();
    
    res.json({ 
      message: 'Course price updated successfully',
      course: {
        id: course._id,
        courseName: course.courseName,
        price: course.price,
        adminPriceOverride: course.adminPriceOverride
      }
    });
  } catch (error) {
    console.error('Error updating course price:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/delete-course/:courseId
// @desc    Delete a course (admin only)
// @access  Private (Admin only)
router.delete('/delete-course/:courseId', [auth, adminAuth], async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await Course.findByIdAndDelete(courseId);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 