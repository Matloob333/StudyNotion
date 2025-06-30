const mongoose = require('mongoose');
const { Course, User, Category } = require('../models/index');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studynotion';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create sample video data
const createSampleVideo = () => {
  const videoBuffer = Buffer.alloc(102400); // 100KB
  for (let i = 0; i < videoBuffer.length; i++) {
    videoBuffer[i] = Math.floor(Math.random() * 256);
  }
  
  return {
    data: videoBuffer,
    contentType: 'video/mp4',
    size: 102400
  };
};

const createLectureVideo = () => {
  const videoBuffer = Buffer.alloc(51200); // 50KB
  for (let i = 0; i < videoBuffer.length; i++) {
    videoBuffer[i] = Math.floor(Math.random() * 256);
  }
  
  return {
    data: videoBuffer,
    contentType: 'video/mp4',
    size: 51200
  };
};

const sampleCourses = [
  {
    courseName: "Complete Web Development Bootcamp 2024",
    courseDescription: "Learn web development from scratch to advanced. Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer.",
    price: 2999,
    discountedPrice: 1999,
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: null, // Will be set after category creation
    tags: ["web development", "javascript", "react", "node.js", "mongodb", "full stack"],
    level: "Beginner",
    language: "English",
    status: "Published",
    courseVideo: createSampleVideo(),
    courseContent: [
      {
        sectionTitle: "Introduction to Web Development",
        lectures: [
          {
            title: "Welcome to the Course",
            description: "Introduction to web development and course overview",
            duration: 5,
            isPreview: true,
            videoFile: createLectureVideo()
          },
          {
            title: "Setting Up Your Development Environment",
            description: "Install and configure your development tools",
            duration: 12,
            isPreview: false,
            videoFile: createLectureVideo()
          }
        ]
      },
      {
        sectionTitle: "HTML Fundamentals",
        lectures: [
          {
            title: "HTML Basics",
            description: "Learn the fundamentals of HTML markup",
            duration: 15,
            isPreview: true,
            videoFile: createLectureVideo()
          },
          {
            title: "HTML Forms and Inputs",
            description: "Create interactive forms with HTML",
            duration: 18,
            isPreview: false,
            videoFile: createLectureVideo()
          }
        ]
      }
    ],
    requirements: [
      "No programming experience needed",
      "A computer with internet access",
      "Willingness to learn and practice"
    ],
    whatYouWillLearn: [
      "Build responsive websites from scratch",
      "Master modern JavaScript (ES6+)",
      "Create full-stack applications",
      "Deploy applications to the cloud"
    ]
  },
  {
    courseName: "Python for Data Science and Machine Learning",
    courseDescription: "Master Python programming for data science, machine learning, and AI. Learn pandas, numpy, matplotlib, scikit-learn, and deep learning with TensorFlow and PyTorch.",
    price: 3999,
    discountedPrice: 2999,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: null,
    tags: ["python", "data science", "machine learning", "pandas", "numpy", "tensorflow"],
    level: "Intermediate",
    language: "English",
    status: "Published",
    courseVideo: createSampleVideo(),
    courseContent: [
      {
        sectionTitle: "Python Fundamentals for Data Science",
        lectures: [
          {
            title: "Python Basics",
            description: "Introduction to Python programming",
            duration: 10,
            isPreview: true,
            videoFile: createLectureVideo()
          },
          {
            title: "Data Types and Structures",
            description: "Understanding Python data structures",
            duration: 15,
            isPreview: false,
            videoFile: createLectureVideo()
          }
        ]
      }
    ],
    requirements: [
      "Basic programming knowledge",
      "High school mathematics",
      "Computer with Python installed"
    ],
    whatYouWillLearn: [
      "Master Python for data science",
      "Build machine learning models",
      "Create data visualizations",
      "Deploy ML models to production"
    ]
  },
  {
    courseName: "React - The Complete Guide (2024 Edition)",
    courseDescription: "Learn React from scratch with hooks, context, redux, and modern React patterns. Build real-world applications and master React development.",
    price: 2499,
    discountedPrice: 1999,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: null,
    tags: ["react", "javascript", "frontend", "hooks", "context", "redux"],
    level: "Beginner",
    language: "English",
    status: "Published",
    courseVideo: createSampleVideo(),
    courseContent: [
      {
        sectionTitle: "React Basics",
        lectures: [
          {
            title: "Introduction to React",
            description: "What is React and why use it?",
            duration: 8,
            isPreview: true,
            videoFile: createLectureVideo()
          },
          {
            title: "Components and JSX",
            description: "Building your first React components",
            duration: 15,
            isPreview: false,
            videoFile: createLectureVideo()
          }
        ]
      }
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "HTML and CSS fundamentals",
      "Computer with Node.js installed"
    ],
    whatYouWillLearn: [
      "Build modern React applications",
      "Master React hooks and context",
      "Implement state management",
      "Create reusable components"
    ]
  }
];

const seedCourses = async () => {
  try {
    console.log('Starting to seed courses...');
    
    // Create categories first
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.log('No categories found. Creating sample categories...');
      const webDevCategory = new Category({
        name: 'Web Development',
        description: 'Learn web development technologies',
        color: '#3B82F6',
        icon: '🌐'
      });
      await webDevCategory.save();
      
      const dataScienceCategory = new Category({
        name: 'Data Science',
        description: 'Master data science and machine learning',
        color: '#10B981',
        icon: '📊'
      });
      await dataScienceCategory.save();
      
      console.log('Created sample categories');
    }
    
    // Get categories
    const webDevCategory = await Category.findOne({ name: 'Web Development' });
    const dataScienceCategory = await Category.findOne({ name: 'Data Science' });
    
    // Create instructor user if not exists
    let instructor = await User.findOne({ email: 'instructor@studynotion.com' });
    if (!instructor) {
      instructor = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'instructor@studynotion.com',
        password: 'password123',
        accountType: 'Instructor'
      });
      await instructor.save();
      console.log('Created instructor user');
    }
    
    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');
    
    // Create courses with proper category and instructor
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      
      // Assign category based on course type
      if (courseData.courseName.includes('Web Development') || courseData.courseName.includes('React')) {
        courseData.category = webDevCategory._id;
      } else {
        courseData.category = dataScienceCategory._id;
      }
      
      courseData.instructor = instructor._id;
      
      const course = new Course(courseData);
      await course.save();
      
      console.log(`✓ Created course: ${course.courseName}`);
    }
    
    console.log('✅ Successfully seeded courses with videos!');
    console.log(`Created ${sampleCourses.length} courses`);
    
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
seedCourses(); 