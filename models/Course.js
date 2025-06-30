const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseDescription: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  whatYouWillLearn: [{
    type: String
  }],
  courseContent: [{
    sectionTitle: {
      type: String,
      required: true
    },
    lectures: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      videoUrl: String,
      duration: Number, // in minutes
      isPreview: {
        type: Boolean,
        default: false
      }
    }]
  }],
  requirements: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  thumbnail: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  courseVideo: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String
  }],
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  language: {
    type: String,
    default: 'English'
  },
  totalDuration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  totalLectures: {
    type: Number,
    required: true,
    min: 0
  },
  totalStudents: {
    type: Number,
    default: 0,
    min: 0
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedLectures: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  // Admin approval system
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
    default: 'Pending'
  },
  adminApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminApprovedAt: {
    type: Date
  },
  adminRejectionReason: {
    type: String,
    maxlength: 1000
  },
  adminNotes: {
    type: String,
    maxlength: 2000
  },
  adminPriceOverride: {
    type: Number,
    min: 0
  },
  adminPriceOverrideReason: {
    type: String,
    maxlength: 500
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  certificateTemplate: {
    type: String
  },
  maxStudents: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  subtitles: [{
    language: String,
    file: String
  }],
  resources: [{
    title: String,
    type: String, // pdf, video, link, etc.
    url: String,
    description: String
  }],
  announcements: [{
    title: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate average rating
courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.totalRatings = this.reviews.length;
  }
  return this.save();
};

// Calculate total duration
courseSchema.methods.calculateTotalDuration = function() {
  this.totalDuration = this.courseContent.reduce((total, section) => {
    return total + section.lectures.reduce((sectionTotal, lecture) => {
      return sectionTotal + (lecture.duration || 0);
    }, 0);
  }, 0);
  return this.save();
};

// Calculate total lectures
courseSchema.methods.calculateTotalLectures = function() {
  this.totalLectures = this.courseContent.reduce((total, section) => {
    return total + section.lectures.length;
  }, 0);
  return this.save();
};

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Virtual for enrollment status
courseSchema.virtual('isEnrollmentOpen').get(function() {
  if (this.maxStudents === 0) return true;
  return this.enrolledStudents.length < this.maxStudents;
});

// Method to enroll a student
courseSchema.methods.enrollStudent = function(studentId) {
  // Check if student is already enrolled
  const existingEnrollment = this.enrolledStudents.find(
    enrollment => enrollment.student.toString() === studentId.toString()
  );
  
  if (existingEnrollment) {
    throw new Error('Student is already enrolled in this course');
  }

  // Check if enrollment is open
  if (!this.isEnrollmentOpen) {
    throw new Error('Course enrollment is full');
  }

  // Add student to enrolled list
  this.enrolledStudents.push({
    student: studentId,
    enrolledAt: new Date(),
    progress: 0,
    completedLectures: [],
    lastAccessed: new Date()
  });

  // Update total students count
  this.totalStudents = this.enrolledStudents.length;

  return this.save();
};

// Method to update student progress
courseSchema.methods.updateProgress = function(studentId, lectureId, completed = true) {
  const enrollment = this.enrolledStudents.find(
    enrollment => enrollment.student.toString() === studentId.toString()
  );

  if (!enrollment) {
    throw new Error('Student is not enrolled in this course');
  }

  if (completed) {
    if (!enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
    }
  } else {
    enrollment.completedLectures = enrollment.completedLectures.filter(
      id => id.toString() !== lectureId.toString()
    );
  }

  // Calculate progress percentage
  const totalLectures = this.courseContent.reduce((total, section) => {
    return total + section.lectures.length;
  }, 0);

  enrollment.progress = Math.round((enrollment.completedLectures.length / totalLectures) * 100);
  enrollment.lastAccessed = new Date();

  return this.save();
};

// Method to add review
courseSchema.methods.addReview = function(userId, rating, comment) {
  // Check if user is enrolled
  const isEnrolled = this.enrolledStudents.some(
    enrollment => enrollment.student.toString() === userId.toString()
  );

  if (!isEnrolled) {
    throw new Error('You must be enrolled to review this course');
  }

  // Check if user already reviewed
  const existingReview = this.reviews.find(
    review => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    throw new Error('You have already reviewed this course');
  }

  // Add review
  this.reviews.push({
    user: userId,
    rating,
    comment,
    createdAt: new Date()
  });

  // Update average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = totalRating / this.reviews.length;
  this.totalRatings = this.reviews.length;

  return this.save();
};

// Static method to get popular courses
courseSchema.statics.getPopularCourses = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ totalStudents: -1, averageRating: -1 })
    .limit(limit)
    .populate('instructor', 'name email')
    .populate('category', 'name');
};

// Static method to get featured courses
courseSchema.statics.getFeaturedCourses = function(limit = 6) {
  return this.find({ isPublished: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('instructor', 'name email')
    .populate('category', 'name');
};

// Static method to search courses
courseSchema.statics.searchCourses = function(query, filters = {}) {
  const searchQuery = {
    isPublished: true,
    $text: { $search: query }
  };

  // Apply filters
  if (filters.level) {
    searchQuery.level = filters.level;
  }

  if (filters.priceRange) {
    switch (filters.priceRange) {
      case 'free':
        searchQuery.price = 0;
        break;
      case 'paid':
        searchQuery.price = { $gt: 0 };
        break;
      case 'under1000':
        searchQuery.price = { $lt: 1000 };
        break;
      case '1000to2000':
        searchQuery.price = { $gte: 1000, $lte: 2000 };
        break;
      case 'over2000':
        searchQuery.price = { $gt: 2000 };
        break;
    }
  }

  if (filters.rating) {
    searchQuery.averageRating = { $gte: filters.rating };
  }

  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .populate('instructor', 'name email')
    .populate('category', 'name');
};

module.exports = mongoose.model('Course', courseSchema); 