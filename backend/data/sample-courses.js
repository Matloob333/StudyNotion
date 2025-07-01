const sampleCourses = [
  {
    courseName: "Complete Web Development Bootcamp 2024",
    courseDescription: "Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer.",
    price: 1499,
    originalPrice: 2999,
    discountedPrice: 1499,
    level: "Beginner",
    totalDuration: 45, // hours
    totalLectures: 150,
    totalStudents: 15420,
    averageRating: 4.8,
    totalRatings: 3240,
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
    courseVideo: "sample-video.mp4",
    courseContent: [
      {
        sectionTitle: "Introduction to Web Development",
        lectures: [
          { title: "Welcome to the Course", duration: 5, isPreview: true },
          { title: "Setting Up Your Development Environment", duration: 15 },
          { title: "Understanding How the Web Works", duration: 20 }
        ]
      },
      {
        sectionTitle: "HTML Fundamentals",
        lectures: [
          { title: "HTML Basics and Structure", duration: 25, isPreview: true },
          { title: "Working with Text and Links", duration: 30 },
          { title: "Images and Media", duration: 20 },
          { title: "Forms and Input Elements", duration: 35 }
        ]
      },
      {
        sectionTitle: "CSS Styling",
        lectures: [
          { title: "CSS Introduction and Selectors", duration: 30 },
          { title: "Box Model and Layout", duration: 40 },
          { title: "Flexbox and Grid", duration: 45 },
          { title: "Responsive Design", duration: 35 }
        ]
      },
      {
        sectionTitle: "JavaScript Programming",
        lectures: [
          { title: "JavaScript Basics", duration: 40 },
          { title: "DOM Manipulation", duration: 35 },
          { title: "Events and Event Handling", duration: 30 },
          { title: "Async JavaScript", duration: 45 }
        ]
      },
      {
        sectionTitle: "React.js Framework",
        lectures: [
          { title: "React Introduction", duration: 30 },
          { title: "Components and Props", duration: 35 },
          { title: "State and Lifecycle", duration: 40 },
          { title: "Hooks and Modern React", duration: 45 }
        ]
      },
      {
        sectionTitle: "Backend Development",
        lectures: [
          { title: "Node.js and Express", duration: 40 },
          { title: "MongoDB Database", duration: 35 },
          { title: "RESTful APIs", duration: 45 },
          { title: "Authentication and Security", duration: 50 }
        ]
      }
    ],
    learningOutcomes: [
      "Build responsive websites with HTML, CSS, and JavaScript",
      "Create dynamic web applications with React.js",
      "Develop backend APIs with Node.js and Express",
      "Work with MongoDB database",
      "Deploy full-stack applications",
      "Understand modern web development practices"
    ]
  },
  {
    courseName: "React.js Masterclass 2024",
    courseDescription: "Learn React from scratch to advanced concepts. Build modern web applications with hooks, context, and real-world projects.",
    price: 1299,
    originalPrice: 2499,
    discountedPrice: 1299,
    level: "Intermediate",
    totalDuration: 32,
    totalLectures: 120,
    totalStudents: 8920,
    averageRating: 4.9,
    totalRatings: 2150,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    courseVideo: "react-masterclass.mp4",
    courseContent: [
      {
        sectionTitle: "React Fundamentals",
        lectures: [
          { title: "Introduction to React", duration: 20, isPreview: true },
          { title: "JSX and Components", duration: 25 },
          { title: "Props and State", duration: 30 },
          { title: "Event Handling", duration: 25 }
        ]
      },
      {
        sectionTitle: "Advanced React Concepts",
        lectures: [
          { title: "React Hooks", duration: 35 },
          { title: "useState and useEffect", duration: 40 },
          { title: "Custom Hooks", duration: 30 },
          { title: "Context API", duration: 35 }
        ]
      },
      {
        sectionTitle: "State Management",
        lectures: [
          { title: "Redux Toolkit", duration: 45 },
          { title: "State Management Patterns", duration: 40 },
          { title: "Performance Optimization", duration: 35 }
        ]
      },
      {
        sectionTitle: "Real-World Projects",
        lectures: [
          { title: "E-commerce App", duration: 120 },
          { title: "Social Media Dashboard", duration: 90 },
          { title: "Task Management App", duration: 75 }
        ]
      }
    ],
    learningOutcomes: [
      "Master React fundamentals and advanced concepts",
      "Build scalable React applications",
      "Implement state management with Redux",
      "Create custom hooks and reusable components",
      "Optimize React performance",
      "Deploy React applications"
    ]
  },
  {
    courseName: "Python for Data Science",
    courseDescription: "Learn Python programming for data analysis, machine learning, and scientific computing. Master pandas, numpy, and matplotlib.",
    price: 1699,
    originalPrice: 3299,
    discountedPrice: 1699,
    level: "Beginner",
    totalDuration: 38,
    totalLectures: 140,
    totalStudents: 12340,
    averageRating: 4.7,
    totalRatings: 2890,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
    courseVideo: "python-data-science.mp4",
    courseContent: [
      {
        sectionTitle: "Python Basics",
        lectures: [
          { title: "Introduction to Python", duration: 20, isPreview: true },
          { title: "Variables and Data Types", duration: 25 },
          { title: "Control Structures", duration: 30 },
          { title: "Functions and Modules", duration: 35 }
        ]
      },
      {
        sectionTitle: "Data Analysis Libraries",
        lectures: [
          { title: "NumPy Fundamentals", duration: 40 },
          { title: "Pandas DataFrames", duration: 45 },
          { title: "Data Cleaning and Preprocessing", duration: 50 },
          { title: "Data Visualization with Matplotlib", duration: 40 }
        ]
      },
      {
        sectionTitle: "Machine Learning",
        lectures: [
          { title: "Scikit-learn Introduction", duration: 45 },
          { title: "Supervised Learning", duration: 60 },
          { title: "Unsupervised Learning", duration: 55 },
          { title: "Model Evaluation", duration: 40 }
        ]
      },
      {
        sectionTitle: "Real-World Projects",
        lectures: [
          { title: "Sales Data Analysis", duration: 90 },
          { title: "Customer Segmentation", duration: 75 },
          { title: "Predictive Modeling", duration: 100 }
        ]
      }
    ],
    learningOutcomes: [
      "Master Python programming fundamentals",
      "Analyze data with pandas and numpy",
      "Create data visualizations",
      "Build machine learning models",
      "Work with real-world datasets",
      "Deploy data science projects"
    ]
  },
  {
    courseName: "UI/UX Design Fundamentals",
    courseDescription: "Learn the principles of user interface and user experience design. Create beautiful, functional, and user-friendly designs.",
    price: 999,
    originalPrice: 1999,
    discountedPrice: 999,
    level: "Beginner",
    totalDuration: 28,
    totalLectures: 95,
    totalStudents: 6780,
    averageRating: 4.6,
    totalRatings: 1560,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    courseVideo: "ui-ux-design.mp4",
    courseContent: [
      {
        sectionTitle: "Design Principles",
        lectures: [
          { title: "Introduction to UI/UX Design", duration: 20, isPreview: true },
          { title: "Color Theory and Psychology", duration: 30 },
          { title: "Typography Fundamentals", duration: 25 },
          { title: "Layout and Grid Systems", duration: 35 }
        ]
      },
      {
        sectionTitle: "User Experience",
        lectures: [
          { title: "User Research Methods", duration: 40 },
          { title: "Information Architecture", duration: 35 },
          { title: "Wireframing and Prototyping", duration: 45 },
          { title: "Usability Testing", duration: 30 }
        ]
      },
      {
        sectionTitle: "Design Tools",
        lectures: [
          { title: "Figma Basics", duration: 40 },
          { title: "Adobe XD", duration: 35 },
          { title: "Sketch for Mac", duration: 30 },
          { title: "Prototyping Tools", duration: 25 }
        ]
      },
      {
        sectionTitle: "Portfolio Projects",
        lectures: [
          { title: "Mobile App Design", duration: 120 },
          { title: "Website Redesign", duration: 90 },
          { title: "Design System Creation", duration: 75 }
        ]
      }
    ],
    learningOutcomes: [
      "Understand UI/UX design principles",
      "Create user-centered designs",
      "Master design tools and software",
      "Conduct user research and testing",
      "Build a professional portfolio",
      "Work with design systems"
    ]
  },
  {
    courseName: "Mobile App Development with React Native",
    courseDescription: "Build cross-platform mobile applications using React Native. Create apps for iOS and Android with a single codebase.",
    price: 1899,
    originalPrice: 3499,
    discountedPrice: 1899,
    level: "Intermediate",
    totalDuration: 42,
    totalLectures: 130,
    totalStudents: 5430,
    averageRating: 4.8,
    totalRatings: 1280,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
    courseVideo: "react-native.mp4",
    courseContent: [
      {
        sectionTitle: "React Native Basics",
        lectures: [
          { title: "Introduction to React Native", duration: 25, isPreview: true },
          { title: "Setting Up Development Environment", duration: 30 },
          { title: "Components and Navigation", duration: 35 },
          { title: "Styling and Layout", duration: 30 }
        ]
      },
      {
        sectionTitle: "Advanced Features",
        lectures: [
          { title: "State Management", duration: 40 },
          { title: "API Integration", duration: 45 },
          { title: "Local Storage", duration: 35 },
          { title: "Push Notifications", duration: 40 }
        ]
      },
      {
        sectionTitle: "Platform-Specific Features",
        lectures: [
          { title: "iOS Specific Features", duration: 50 },
          { title: "Android Specific Features", duration: 50 },
          { title: "Native Modules", duration: 60 }
        ]
      },
      {
        sectionTitle: "App Store Deployment",
        lectures: [
          { title: "App Store Preparation", duration: 45 },
          { title: "Google Play Store", duration: 40 },
          { title: "Testing and Debugging", duration: 35 }
        ]
      }
    ],
    learningOutcomes: [
      "Build cross-platform mobile apps",
      "Master React Native framework",
      "Integrate with device features",
      "Deploy to app stores",
      "Handle platform differences",
      "Create production-ready apps"
    ]
  },
  {
    courseName: "Machine Learning with Python",
    courseDescription: "Master machine learning algorithms and techniques. Build intelligent systems and predictive models using Python.",
    price: 2199,
    originalPrice: 3999,
    discountedPrice: 2199,
    level: "Advanced",
    totalDuration: 50,
    totalLectures: 160,
    totalStudents: 4320,
    averageRating: 4.9,
    totalRatings: 980,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    courseVideo: "machine-learning.mp4",
    courseContent: [
      {
        sectionTitle: "Machine Learning Fundamentals",
        lectures: [
          { title: "Introduction to ML", duration: 30, isPreview: true },
          { title: "Supervised vs Unsupervised Learning", duration: 35 },
          { title: "Data Preprocessing", duration: 40 },
          { title: "Feature Engineering", duration: 45 }
        ]
      },
      {
        sectionTitle: "Supervised Learning",
        lectures: [
          { title: "Linear Regression", duration: 50 },
          { title: "Logistic Regression", duration: 45 },
          { title: "Decision Trees", duration: 55 },
          { title: "Random Forests", duration: 50 }
        ]
      },
      {
        sectionTitle: "Deep Learning",
        lectures: [
          { title: "Neural Networks", duration: 60 },
          { title: "TensorFlow and Keras", duration: 65 },
          { title: "Convolutional Neural Networks", duration: 70 },
          { title: "Recurrent Neural Networks", duration: 65 }
        ]
      },
      {
        sectionTitle: "Advanced Topics",
        lectures: [
          { title: "Natural Language Processing", duration: 80 },
          { title: "Computer Vision", duration: 75 },
          { title: "Model Deployment", duration: 60 }
        ]
      }
    ],
    learningOutcomes: [
      "Understand machine learning algorithms",
      "Build predictive models",
      "Implement deep learning solutions",
      "Work with real-world datasets",
      "Deploy ML models",
      "Handle big data challenges"
    ]
  },
  {
    courseName: "DevOps and CI/CD Pipeline",
    courseDescription: "Learn DevOps practices, Docker, Kubernetes, and CI/CD pipelines. Automate your development and deployment processes.",
    price: 1799,
    originalPrice: 3299,
    discountedPrice: 1799,
    level: "Intermediate",
    totalDuration: 35,
    totalLectures: 110,
    totalStudents: 3890,
    averageRating: 4.7,
    totalRatings: 890,
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop",
    courseVideo: "devops-cicd.mp4",
    courseContent: [
      {
        sectionTitle: "DevOps Fundamentals",
        lectures: [
          { title: "Introduction to DevOps", duration: 25, isPreview: true },
          { title: "Version Control with Git", duration: 30 },
          { title: "Linux and Shell Scripting", duration: 35 },
          { title: "Infrastructure as Code", duration: 40 }
        ]
      },
      {
        sectionTitle: "Containerization",
        lectures: [
          { title: "Docker Basics", duration: 45 },
          { title: "Docker Compose", duration: 35 },
          { title: "Container Orchestration", duration: 50 },
          { title: "Kubernetes Fundamentals", duration: 60 }
        ]
      },
      {
        sectionTitle: "CI/CD Pipelines",
        lectures: [
          { title: "Jenkins Automation", duration: 50 },
          { title: "GitHub Actions", duration: 45 },
          { title: "Automated Testing", duration: 40 },
          { title: "Deployment Strategies", duration: 45 }
        ]
      },
      {
        sectionTitle: "Cloud Platforms",
        lectures: [
          { title: "AWS Services", duration: 70 },
          { title: "Azure DevOps", duration: 60 },
          { title: "Google Cloud Platform", duration: 55 }
        ]
      }
    ],
    learningOutcomes: [
      "Master DevOps practices and tools",
      "Containerize applications with Docker",
      "Orchestrate with Kubernetes",
      "Build CI/CD pipelines",
      "Deploy to cloud platforms",
      "Automate development workflows"
    ]
  },
  {
    courseName: "Blockchain and Web3 Development",
    courseDescription: "Learn blockchain technology, smart contracts, and Web3 development. Build decentralized applications (DApps).",
    price: 2499,
    originalPrice: 4499,
    discountedPrice: 2499,
    level: "Advanced",
    totalDuration: 40,
    totalLectures: 125,
    totalStudents: 2870,
    averageRating: 4.8,
    totalRatings: 650,
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
    courseVideo: "blockchain-web3.mp4",
    courseContent: [
      {
        sectionTitle: "Blockchain Fundamentals",
        lectures: [
          { title: "Introduction to Blockchain", duration: 30, isPreview: true },
          { title: "Cryptography Basics", duration: 35 },
          { title: "Consensus Mechanisms", duration: 40 },
          { title: "Bitcoin and Ethereum", duration: 45 }
        ]
      },
      {
        sectionTitle: "Smart Contracts",
        lectures: [
          { title: "Solidity Programming", duration: 55 },
          { title: "Smart Contract Development", duration: 60 },
          { title: "Testing and Security", duration: 50 },
          { title: "Deployment and Interaction", duration: 45 }
        ]
      },
      {
        sectionTitle: "Web3 Development",
        lectures: [
          { title: "Web3.js Library", duration: 50 },
          { title: "Ethers.js", duration: 45 },
          { title: "DApp Development", duration: 70 },
          { title: "IPFS and Decentralized Storage", duration: 40 }
        ]
      },
      {
        sectionTitle: "Advanced Topics",
        lectures: [
          { title: "DeFi Protocols", duration: 80 },
          { title: "NFT Development", duration: 65 },
          { title: "Layer 2 Solutions", duration: 55 }
        ]
      }
    ],
    learningOutcomes: [
      "Understand blockchain technology",
      "Develop smart contracts",
      "Build decentralized applications",
      "Work with Web3 libraries",
      "Create DeFi and NFT projects",
      "Deploy on blockchain networks"
    ]
  },
  {
    courseName: "Cybersecurity Fundamentals",
    courseDescription: "Learn cybersecurity principles, ethical hacking, and security best practices. Protect systems and networks from threats.",
    price: 1599,
    originalPrice: 2999,
    discountedPrice: 1599,
    level: "Intermediate",
    totalDuration: 36,
    totalLectures: 115,
    totalStudents: 4560,
    averageRating: 4.6,
    totalRatings: 1120,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
    courseVideo: "cybersecurity.mp4",
    courseContent: [
      {
        sectionTitle: "Security Fundamentals",
        lectures: [
          { title: "Introduction to Cybersecurity", duration: 25, isPreview: true },
          { title: "Security Principles", duration: 30 },
          { title: "Threat Modeling", duration: 35 },
          { title: "Risk Assessment", duration: 30 }
        ]
      },
      {
        sectionTitle: "Network Security",
        lectures: [
          { title: "Network Protocols", duration: 40 },
          { title: "Firewalls and IDS", duration: 45 },
          { title: "VPN and Encryption", duration: 35 },
          { title: "Wireless Security", duration: 30 }
        ]
      },
      {
        sectionTitle: "Web Application Security",
        lectures: [
          { title: "OWASP Top 10", duration: 50 },
          { title: "SQL Injection", duration: 40 },
          { title: "XSS and CSRF", duration: 45 },
          { title: "Security Testing", duration: 50 }
        ]
      },
      {
        sectionTitle: "Ethical Hacking",
        lectures: [
          { title: "Penetration Testing", duration: 60 },
          { title: "Social Engineering", duration: 40 },
          { title: "Incident Response", duration: 45 }
        ]
      }
    ],
    learningOutcomes: [
      "Understand cybersecurity principles",
      "Identify and mitigate threats",
      "Secure networks and applications",
      "Conduct security assessments",
      "Implement security controls",
      "Respond to security incidents"
    ]
  }
];

module.exports = sampleCourses; 