const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { User, Course, Category } = require('../models/index');

// Sample categories
const categories = [
  {
    name: 'Web Development',
    description: 'Learn modern web development technologies',
    color: '#3B82F6',
    icon: '🌐'
  },
  {
    name: 'Mobile Development',
    description: 'Build mobile applications for iOS and Android',
    color: '#10B981',
    icon: '📱'
  },
  {
    name: 'Data Science',
    description: 'Master data analysis and machine learning',
    color: '#F59E0B',
    icon: '📊'
  },
  {
    name: 'Design',
    description: 'Learn UI/UX design and graphic design',
    color: '#8B5CF6',
    icon: '🎨'
  },
  {
    name: 'Business',
    description: 'Business and entrepreneurship courses',
    color: '#EF4444',
    icon: '💼'
  }
];

// Sample courses
const courses = [
  {
    courseName: 'Complete Web Development Bootcamp 2024',
    courseDescription: 'Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer.',
    price: 2999,
    level: 'Beginner',
    totalDuration: 45,
    totalLectures: 350,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    videoSize: 102400,
    isFeatured: true,
    isPublished: true,
    approvalStatus: 'Approved',
    averageRating: 4.8,
    totalStudents: 1250,
    totalReviews: 89,
    requirements: ['Basic computer knowledge', 'No programming experience required'],
    whatYouWillLearn: [
      'HTML5 and CSS3 fundamentals',
      'JavaScript ES6+ features',
      'React.js for frontend development',
      'Node.js and Express.js for backend',
      'MongoDB database management',
      'Deploy applications to production'
    ],
    curriculum: [
      {
        title: 'HTML & CSS Fundamentals',
        lectures: 25,
        duration: 3
      },
      {
        title: 'JavaScript Basics',
        lectures: 30,
        duration: 4
      },
      {
        title: 'React.js Development',
        lectures: 40,
        duration: 6
      },
      {
        title: 'Backend with Node.js',
        lectures: 35,
        duration: 5
      }
    ]
  },
  {
    courseName: 'React.js Masterclass 2024',
    courseDescription: 'Master React.js with hooks, context, Redux, and advanced patterns. Build scalable applications with modern React practices.',
    price: 1999,
    level: 'Intermediate',
    totalDuration: 32,
    totalLectures: 280,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    videoSize: 102400,
    isFeatured: true,
    isPublished: true,
    approvalStatus: 'Approved',
    averageRating: 4.9,
    totalStudents: 890,
    totalReviews: 67,
    requirements: ['Basic JavaScript knowledge', 'Understanding of HTML/CSS'],
    whatYouWillLearn: [
      'React hooks and functional components',
      'Context API and state management',
      'Redux Toolkit for complex state',
      'React Router for navigation',
      'Testing with Jest and React Testing Library',
      'Performance optimization techniques'
    ],
    curriculum: [
      {
        title: 'React Fundamentals',
        lectures: 20,
        duration: 3
      },
      {
        title: 'Hooks and State Management',
        lectures: 25,
        duration: 4
      },
      {
        title: 'Advanced Patterns',
        lectures: 30,
        duration: 5
      }
    ]
  },
  {
    courseName: 'Python for Data Science',
    courseDescription: 'Learn Python programming for data analysis, machine learning, and scientific computing. Master pandas, numpy, matplotlib, and scikit-learn.',
    price: 2499,
    level: 'Beginner',
    totalDuration: 38,
    totalLectures: 320,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    videoSize: 102400,
    isFeatured: false,
    isPublished: true,
    approvalStatus: 'Approved',
    averageRating: 4.7,
    totalStudents: 1100,
    totalReviews: 78,
    requirements: ['Basic computer skills', 'No programming experience needed'],
    whatYouWillLearn: [
      'Python programming fundamentals',
      'Data manipulation with pandas',
      'Numerical computing with numpy',
      'Data visualization with matplotlib',
      'Machine learning with scikit-learn',
      'Statistical analysis techniques'
    ],
    curriculum: [
      {
        title: 'Python Basics',
        lectures: 30,
        duration: 4
      },
      {
        title: 'Data Analysis with Pandas',
        lectures: 35,
        duration: 5
      },
      {
        title: 'Machine Learning',
        lectures: 40,
        duration: 6
      }
    ]
  },
  {
    courseName: 'UI/UX Design Masterclass',
    courseDescription: 'Learn modern UI/UX design principles, tools, and techniques. Create beautiful, user-friendly interfaces with Figma and Adobe XD.',
    price: 1799,
    level: 'Beginner',
    totalDuration: 28,
    totalLectures: 240,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    videoSize: 102400,
    isFeatured: false,
    isPublished: true,
    approvalStatus: 'Approved',
    averageRating: 4.6,
    totalStudents: 750,
    totalReviews: 52,
    requirements: ['Basic computer skills', 'Creative mindset'],
    whatYouWillLearn: [
      'Design principles and psychology',
      'User research and personas',
      'Wireframing and prototyping',
      'Figma and Adobe XD mastery',
      'Design systems and components',
      'User testing and iteration'
    ],
    curriculum: [
      {
        title: 'Design Fundamentals',
        lectures: 25,
        duration: 3
      },
      {
        title: 'Tools and Prototyping',
        lectures: 30,
        duration: 4
      },
      {
        title: 'Advanced Design',
        lectures: 35,
        duration: 5
      }
    ]
  },
  {
    courseName: 'Flutter App Development',
    courseDescription: 'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase with Flutter and Dart.',
    price: 2299,
    level: 'Intermediate',
    totalDuration: 35,
    totalLectures: 290,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    videoSize: 102400,
    isFeatured: true,
    isPublished: true,
    approvalStatus: 'Approved',
    averageRating: 4.8,
    totalStudents: 680,
    totalReviews: 45,
    requirements: ['Basic programming knowledge', 'Understanding of OOP concepts'],
    whatYouWillLearn: [
      'Dart programming language',
      'Flutter widgets and layouts',
      'State management solutions',
      'Navigation and routing',
      'API integration and HTTP',
      'App deployment and publishing'
    ],
    curriculum: [
      {
        title: 'Dart Programming',
        lectures: 20,
        duration: 3
      },
      {
        title: 'Flutter Basics',
        lectures: 30,
        duration: 4
      },
      {
        title: 'Advanced Flutter',
        lectures: 35,
        duration: 5
      }
    ]
  },
  {
    courseName: 'Digital Marketing Strategy',
    courseDescription: 'Master digital marketing strategies including SEO, social media, email marketing, and paid advertising. Grow your business online.',
    price: 1499,
    level: 'Beginner',
    totalDuration: 25,
    totalLectures: 200,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    videoSize: 102400,
    isFeatured: false,
    isPublished: true,
    approvalStatus: 'Approved',
    averageRating: 4.5,
    totalStudents: 920,
    totalReviews: 63,
    requirements: ['Basic computer skills', 'Interest in marketing'],
    whatYouWillLearn: [
      'SEO and content marketing',
      'Social media strategy',
      'Email marketing campaigns',
      'Google Ads and Facebook Ads',
      'Analytics and tracking',
      'Marketing automation'
    ],
    curriculum: [
      {
        title: 'Marketing Fundamentals',
        lectures: 20,
        duration: 3
      },
      {
        title: 'Digital Channels',
        lectures: 25,
        duration: 4
      },
      {
        title: 'Advanced Strategies',
        lectures: 30,
        duration: 5
      }
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Category.deleteMany({});
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Create a sample instructor user
    const instructor = await User.findOneAndUpdate(
      { email: 'instructor@studynotion.com' },
      {
        name: 'John Instructor',
        email: 'instructor@studynotion.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        accountType: 'Instructor',
        isVerified: true
      },
      { upsert: true, new: true }
    );
    
    // Add categories and instructor to courses
    const coursesWithData = courses.map((course, index) => ({
      ...course,
      category: createdCategories[index % createdCategories.length]._id,
      instructor: instructor._id
    }));
    
    // Create courses
    const createdCourses = await Course.insertMany(coursesWithData);
    console.log(`✅ Created ${createdCourses.length} courses`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Courses: ${createdCourses.length}`);
    console.log(`- Instructor: ${instructor.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(seedDatabase); 