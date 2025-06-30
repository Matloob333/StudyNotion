import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Play, Heart, BookOpen, Award, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

const CourseCard = ({ course, viewMode = 'grid', onWishlistToggle, isInWishlist = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const addToWishlistMutation = useMutation(
    async (courseId) => {
      const response = await axios.post(`/api/users/wishlist/${courseId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Added to wishlist!');
        queryClient.invalidateQueries('wishlist');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    }
  );

  const removeFromWishlistMutation = useMutation(
    async (courseId) => {
      const response = await axios.delete(`/api/users/wishlist/${courseId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Removed from wishlist!');
        queryClient.invalidateQueries('wishlist');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
      }
    }
  );

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add courses to wishlist');
      return;
    }

    if (isInWishlist) {
      removeFromWishlistMutation.mutate(course._id);
    } else {
      addToWishlistMutation.mutate(course._id);
    }
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (!course.originalPrice || course.originalPrice <= course.price) return 0;
    return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const defaultThumbnail = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop";

  if (viewMode === 'list') {
    return (
      <div 
        className={`relative group cursor-pointer transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
            : 'bg-white hover:bg-gray-50 border-gray-200'
        } border rounded-xl overflow-hidden shadow-sm hover:shadow-lg`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          {/* Thumbnail */}
          <div className="relative w-64 h-40 flex-shrink-0">
            <img
              src={imageError ? defaultThumbnail : course.thumbnail || course.image || defaultThumbnail}
              alt={course.courseName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
            {getDiscountPercentage() > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                {getDiscountPercentage()}% OFF
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.courseName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                  {course.courseDescription}
                </p>
              </div>
              
              {/* Wishlist Button */}
              {user && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(e);
                  }}
                  className={`ml-4 p-2 rounded-full transition-all duration-200 ${
                    isInWishlist
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>

            {/* Course Stats */}
            <div className="flex items-center gap-6 mb-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.totalDuration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.totalLectures} lectures</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.totalStudents?.toLocaleString() || '0'} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{course.averageRating} ({course.totalRatings?.toLocaleString() || '0'})</span>
              </div>
            </div>

            {/* Level and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
                {course.learningOutcomes && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Award className="w-4 h-4" />
                    <span>{course.learningOutcomes.length} skills</span>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                {course.originalPrice && course.originalPrice > course.price && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(course.originalPrice)}
                  </div>
                )}
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(course.price)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-300 ${
        isDark 
          ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
      } border rounded-xl overflow-hidden shadow-sm hover:shadow-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageError ? defaultThumbnail : course.thumbnail || course.image || defaultThumbnail}
          alt={course.courseName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {getDiscountPercentage() > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              {getDiscountPercentage()}% OFF
            </div>
          )}
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>

        {/* Wishlist Button */}
        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle(e);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isInWishlist
                ? 'text-red-500 bg-white dark:bg-gray-800'
                : 'text-gray-400 bg-white dark:bg-gray-800 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {course.courseName}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {course.courseDescription}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(course.totalDuration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.totalLectures} lectures</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{(course.totalStudents / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {course.averageRating}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({course.totalRatings?.toLocaleString() || '0'})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {course.originalPrice && course.originalPrice > course.price && (
              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(course.originalPrice)}
              </div>
            )}
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(course.price)}
            </div>
          </div>
          
          {course.learningOutcomes && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Award className="w-3 h-3" />
              <span>{course.learningOutcomes.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 