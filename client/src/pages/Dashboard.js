import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  TrendingUp, 
  Award,
  Play,
  Heart,
  Plus,
  ArrowRight,
  CheckCircle,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading } = useQuery(
    'dashboard',
    async () => {
      const response = await axios.get('/api/users/dashboard');
      return response.data;
    },
    {
      enabled: !!user
    }
  );

  const stats = [
    {
      title: 'Courses Enrolled',
      value: dashboardData?.enrolledCourses?.length || 0,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Hours Watched',
      value: dashboardData?.totalHoursWatched || 0,
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Certificates Earned',
      value: dashboardData?.certificatesEarned || 0,
      icon: <Award className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Current Streak',
      value: dashboardData?.currentStreak || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
      change: 'days',
      changeType: 'neutral'
    }
  ];

  const recentCourses = dashboardData?.recentCourses || [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      progress: 75,
      lastAccessed: '2 hours ago',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=60&fit=crop'
    },
    {
      id: 2,
      title: 'React.js Masterclass 2024',
      progress: 45,
      lastAccessed: '1 day ago',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      progress: 90,
      lastAccessed: '3 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=100&h=60&fit=crop'
    }
  ];

  const upcomingDeadlines = dashboardData?.upcomingDeadlines || [
    {
      id: 1,
      title: 'Web Development Final Project',
      dueDate: '2024-01-15',
      course: 'Complete Web Development Bootcamp'
    },
    {
      id: 2,
      title: 'React Component Assignment',
      dueDate: '2024-01-18',
      course: 'React.js Masterclass 2024'
    }
  ];

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your last course',
      icon: <Play className="w-6 h-6" />,
      color: 'bg-primary-500',
      link: '/my-courses'
    },
    {
      title: 'Browse Courses',
      description: 'Discover new courses',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-500',
      link: '/courses'
    },
    {
      title: 'View Certificates',
      description: 'Your achievements',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-purple-500',
      link: '/certificates'
    },
    {
      title: 'Study Schedule',
      description: 'Plan your learning',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-orange-500',
      link: '/schedule'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    {stat.changeType === 'positive' && (
                      <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
                    )}
                  </div>
                </div>
                <div className={`${stat.color} text-white rounded-lg p-3`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Continue Learning
                </h2>
                <Link
                  to="/my-courses"
                  className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last accessed {course.lastAccessed}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress: {course.progress}%
                          </span>
                          <span className="text-primary-600 dark:text-primary-400">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    <div className={`${action.color} text-white rounded-lg p-2`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Deadlines
              </h2>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {deadline.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {deadline.course}
                    </p>
                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        Due {new Date(deadline.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Learning Streak
              </h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {dashboardData?.currentStreak || 0} days
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Keep up the great work!
                </p>
                <div className="flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${
                        i < Math.min(dashboardData?.currentStreak || 0, 7)
                          ? 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {dashboardData?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              )) || (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        Completed lesson "Introduction to HTML" in Web Development Bootcamp
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        Earned certificate for "Python Basics"
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        1 day ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        Enrolled in "React.js Masterclass 2024"
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        3 days ago
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 