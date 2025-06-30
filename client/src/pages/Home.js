import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Star, 
  Users, 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Globe, 
  Zap 
} from 'lucide-react';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Doe",
      rating: 4.8,
      students: 15420,
      price: 999,
      originalPrice: 1499,
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      category: "Web Development"
    },
    {
      id: 2,
      title: "React.js Masterclass 2024",
      instructor: "Jane Smith",
      rating: 4.9,
      students: 8920,
      price: 799,
      originalPrice: 1299,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      category: "React"
    },
    {
      id: 3,
      title: "Python for Data Science",
      instructor: "Mike Johnson",
      rating: 4.7,
      students: 12340,
      price: 899,
      originalPrice: 1399,
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
      category: "Data Science"
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Wilson",
      rating: 4.6,
      students: 6780,
      price: 699,
      originalPrice: 1199,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      category: "Design"
    }
  ];

  const categories = [
    { name: "Web Development", icon: <Globe className="w-6 h-6" />, color: "bg-blue-500" },
    { name: "Mobile Development", icon: <Zap className="w-6 h-6" />, color: "bg-green-500" },
    { name: "Data Science", icon: <TrendingUp className="w-6 h-6" />, color: "bg-purple-500" },
    { name: "Design", icon: <Award className="w-6 h-6" />, color: "bg-pink-500" }
  ];

  const stats = [
    { number: "50K+", label: "Students Enrolled", icon: <Users className="w-8 h-8" /> },
    { number: "200+", label: "Expert Instructors", icon: <Award className="w-8 h-8" /> },
    { number: "500+", label: "Online Courses", icon: <BookOpen className="w-8 h-8" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Learn Without
                <span className="block text-accent-400">Limits</span>
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Start, switch, or advance your career with thousands of courses from expert instructors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Explore Courses
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
                >
                  Join for Free
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold mb-2">50K+</div>
                    <div className="text-sm">Students</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold mb-2">200+</div>
                    <div className="text-sm">Instructors</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold mb-2">500+</div>
                    <div className="text-sm">Courses</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold mb-2">95%</div>
                    <div className="text-sm">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-primary-600 dark:text-primary-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover the most popular courses chosen by our students
              </p>
            </div>
            <Link
              to="/courses"
              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose from our wide range of categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/courses?category=${category.name}`}
                className="group bg-gray-50 dark:bg-dark-700 rounded-lg p-6 text-center hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <div className={`${category.color} text-white rounded-lg p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of students who are already learning on StudyNotion
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 