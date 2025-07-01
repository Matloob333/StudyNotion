const mongoose = require('mongoose');

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

// Update course count when courses are added/removed
categorySchema.methods.updateCourseCount = function() {
  return this.model('Course').countDocuments({ category: this._id, status: 'Published' })
    .then(count => {
      this.courseCount = count;
      return this.save();
    });
};

module.exports = mongoose.model('Category', categorySchema); 