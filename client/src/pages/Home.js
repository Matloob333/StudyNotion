import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { BookOpen, Users, Award, Play, ArrowRight, Star, Heart } from 'lucide-react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch featured courses
  const { data: featuredCourses = [] } = useQuery(
    ['featured-courses'],
    async () => {
      const response = await axios.get('/api/courses/featured?limit=6');
      return response.data;
    }
  );

  // Fetch popular courses
  const { data: popularCourses = [] } = useQuery(
    ['popular-courses'],
    async () => {
      const response = await axios.get('/api/courses/popular?limit=8');
      return response.data;
    }
  );

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'web-development', name: 'Web Development', icon: '🌐' },
    { id: 'mobile-development', name: 'Mobile Development', icon: '📱' },
    { id: 'data-science', name: 'Data Science', icon: '📊' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'marketing', name: 'Marketing', icon: '📈' }
  ];

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: '50,000+',
      label: 'Students Enrolled',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      value: '500+',
      label: 'Courses Available',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: '100+',
      label: 'Expert Instructors',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: '4.8',
      label: 'Average Rating',
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Without
              <span className="text-yellow-300"> Limits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Access world-class education from anywhere. Transform your career with our comprehensive online courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Explore Courses
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Get Started Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find the perfect course in your field of interest
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-xl border transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isDark
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <div className={`text-sm font-medium ${
                  activeCategory === category.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Courses
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Handpicked courses from our top instructors
              </p>
            </div>
            <Link
              to="/courses"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View all courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Most Popular Courses
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join thousands of students learning these courses
              </p>
            </div>
            <Link
              to="/courses"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View all courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students already learning on StudyNotion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Courses
            </Link>
            {!user && (
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 