import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Play, Clock, Star, Edit, Trash2, Plus, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Utility to format price in INR
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const MyCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('enrolled');

  // Fetch enrolled courses
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useQuery(
    ['enrolled-courses', user?._id],
    async () => {
      if (!user) return [];
      const response = await axios.get('/api/users/enrolled-courses');
      return response.data;
    },
    { enabled: !!user }
  );

  // Fetch created courses (for instructors)
  const { data: createdCourses = [], isLoading: createdLoading } = useQuery(
    ['created-courses', user?._id],
    async () => {
      if (!user || user.accountType !== 'Instructor') return [];
      const response = await axios.get('/api/courses/my-courses');
      return response.data;
    },
    { enabled: !!user && user.accountType === 'Instructor' }
  );

  const handleEdit = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        // Refetch courses
        window.location.reload();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const isLoading = enrolledLoading || createdLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your courses..." />
      </div>
    );
  }

  const courses = activeTab === 'enrolled' ? enrolledCourses : createdCourses;
  const isInstructor = user?.accountType === 'Instructor';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Courses</h1>
          {isInstructor && (
            <button
              onClick={() => navigate('/create-course')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white dark:bg-dark-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'enrolled'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Enrolled Courses
          </button>
          {isInstructor && (
            <button
              onClick={() => setActiveTab('created')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'created'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Created Courses
            </button>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Play className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {activeTab === 'enrolled' ? 'No enrolled courses yet' : 'No courses created yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === 'enrolled' 
                ? 'Start exploring courses to begin your learning journey.'
                : 'Start creating your first course to share your knowledge with students.'
              }
            </p>
            {activeTab === 'enrolled' ? (
              <button
                onClick={() => navigate('/courses')}
                className="btn-primary"
              >
                Browse Courses
              </button>
            ) : (
              <button
                onClick={() => navigate('/create-course')}
                className="btn-primary"
              >
                Create Your First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id || course.id} className="bg-white dark:bg-dark-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={course.thumbnail || course.image || "https://via.placeholder.com/300x200"}
                    alt={course.courseName || course.title}
                    className="w-full h-48 object-cover"
                  />
                  {activeTab === 'created' && (
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 text-xs font-medium px-2.5 py-0.5 rounded">
                      {course.category?.name || course.category}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded">
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {course.courseName || course.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{course.averageRating || course.rating || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.totalDuration || course.duration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.totalStudents || course.students || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(course.price || 0)}
                    </span>
                    {activeTab === 'enrolled' && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Progress: {course.progress || 0}%
                      </span>
                    )}
                  </div>
                  
                  {activeTab === 'created' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course._id || course.id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(course._id || course.id)}
                        className="flex items-center justify-center space-x-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 py-2 px-3 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {activeTab === 'enrolled' && (
                    <button
                      onClick={() => navigate(`/courses/${course._id || course.id}`)}
                      className="w-full btn-primary"
                    >
                      Continue Learning
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses; 