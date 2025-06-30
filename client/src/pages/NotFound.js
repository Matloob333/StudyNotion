import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, BookOpen, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track to continue your learning journey.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Link>
          
          <Link
            to="/courses"
            className="btn-secondary w-full flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Courses
          </Link>
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-dark-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              to="/courses"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              All Courses
            </Link>
            <Link
              to="/dashboard"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Profile
            </Link>
            <Link
              to="/my-courses"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              My Courses
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 