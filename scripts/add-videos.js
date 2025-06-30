const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studynotion';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const { Course } = require('../models/index');

// Sample video data (100KB video file)
const createSampleVideo = () => {
  // Create a small video buffer (simulating a 100KB video)
  const videoBuffer = Buffer.alloc(102400); // 100KB
  
  // Fill with some data to make it look like a video
  for (let i = 0; i < videoBuffer.length; i++) {
    videoBuffer[i] = Math.floor(Math.random() * 256);
  }
  
  return {
    data: videoBuffer,
    contentType: 'video/mp4',
    size: 102400
  };
};

// Sample lecture video data
const createLectureVideo = () => {
  // Create a smaller video buffer for lectures (50KB)
  const videoBuffer = Buffer.alloc(51200); // 50KB
  
  // Fill with some data
  for (let i = 0; i < videoBuffer.length; i++) {
    videoBuffer[i] = Math.floor(Math.random() * 256);
  }
  
  return {
    data: videoBuffer,
    contentType: 'video/mp4',
    size: 51200
  };
};

const addVideosToCourses = async () => {
  try {
    console.log('Starting to add videos to courses...');
    
    // Get all courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses to update`);
    
    const sampleVideo = createSampleVideo();
    const lectureVideo = createLectureVideo();
    
    for (const course of courses) {
      console.log(`Adding video to course: ${course.courseName}`);
      
      // Add main course video
      course.courseVideo = sampleVideo;
      
      // Add videos to lectures if courseContent exists
      if (course.courseContent && course.courseContent.length > 0) {
        course.courseContent.forEach(section => {
          if (section.lectures && section.lectures.length > 0) {
            section.lectures.forEach(lecture => {
              // Add video to first lecture of each section
              if (section.lectures.indexOf(lecture) === 0) {
                lecture.videoFile = lectureVideo;
                lecture.isPreview = true; // Make first lecture preview
              }
            });
          }
        });
      }
      
      // Save the updated course
      await course.save();
      console.log(`✓ Added video to: ${course.courseName}`);
    }
    
    console.log('✅ Successfully added videos to all courses!');
    console.log(`Updated ${courses.length} courses`);
    
  } catch (error) {
    console.error('Error adding videos to courses:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
addVideosToCourses(); 