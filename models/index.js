const mongoose = require('mongoose');

// Define schemas
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google OAuth
    },
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  accountType: {
    type: String,
    enum: ['Student', 'Instructor', 'Admin'],
    default: 'Student'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  contactNumber: {
    type: String
  },
  about: {
    type: String,
    maxlength: 500
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
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
      videoFile: {
        data: Buffer,
        contentType: String,
        size: {
          type: Number,
          max: 102400 // 100KB limit
        }
      },
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
  discountedPrice: {
    type: Number,
    min: 0
  },
  thumbnail: {
    type: String,
    required: true
  },
  courseVideo: {
    data: Buffer,
    contentType: String,
    size: {
      type: Number,
      max: 102400 // 100KB limit
    }
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
    default: 0
  },
  totalLectures: {
    type: Number,
    default: 0
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
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

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📚'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  courseCount: {
    type: Number,
    default: 0
  },
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

// Add methods to userSchema
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Add methods to courseSchema
courseSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  return this.save();
};

courseSchema.methods.calculateTotalDuration = function() {
  this.totalDuration = this.courseContent.reduce((total, section) => {
    return total + section.lectures.reduce((sectionTotal, lecture) => {
      return sectionTotal + (lecture.duration || 0);
    }, 0);
  }, 0);
  return this.save();
};

courseSchema.methods.calculateTotalLectures = function() {
  this.totalLectures = this.courseContent.reduce((total, section) => {
    return total + section.lectures.length;
  }, 0);
  return this.save();
};

// Add methods to categorySchema
categorySchema.methods.updateCourseCount = function() {
  return this.model('Course').countDocuments({ category: this._id, status: 'Published' })
    .then(count => {
      this.courseCount = count;
      return this.save();
    });
};

// Create and export models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Category = mongoose.model('Category', categorySchema);

module.exports = {
  User,
  Course,
  Category
}; 