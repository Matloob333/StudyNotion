import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  Award, 
  Play, 
  CheckCircle, 
  Heart,
  Share2,
  Download,
  MessageCircle,
  Calendar,
  Globe,
  BarChart3,
  Target,
  FileText,
  Video,
  Link,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import VideoPlayer from '../components/VideoPlayer';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  
  const [activeSection, setActiveSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch course details
  const { data: course, isLoading, error } = useQuery(
    ['course', id],
    async () => {
      const response = await axios.get(`/api/courses/${id}`);
      return response.data;
    }
  );

  // Fetch enrollment status
  const { data: enrollmentStatus } = useQuery(
    ['enrollment-status', id],
    async () => {
      if (!user) return { isEnrolled: false };
      const response = await axios.get(`/api/courses/${id}/enrollment-status`);
      return response.data;
    },
    { enabled: !!user }
  );

  // Fetch wishlist status
  const { data: wishlist = [] } = useQuery(
    ['wishlist', user?._id],
    async () => {
      if (!user) return [];
      const response = await axios.get('/api/users/wishlist');
      return response.data;
    },
    { enabled: !!user }
  );

  // Enroll mutation
  const enrollMutation = useMutation(
    async () => {
      const response = await axios.post(`/api/courses/${id}/enroll`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Successfully enrolled in course!');
        queryClient.invalidateQueries(['enrollment-status', id]);
        queryClient.invalidateQueries(['course', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to enroll in course');
      }
    }
  );

  // Wishlist mutation
  const wishlistMutation = useMutation(
    async () => {
      if (wishlist.includes(id)) {
        await axios.delete(`/api/users/wishlist/${id}`);
      } else {
        await axios.post('/api/users/wishlist', { courseId: id });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wishlist', user?._id]);
        toast.success(wishlist.includes(id) ? 'Removed from wishlist' : 'Added to wishlist');
      },
      onError: () => {
        toast.error('Failed to update wishlist');
      }
    }
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  const getDiscountPercentage = () => {
    if (!course?.originalPrice || course.originalPrice <= course.price) return 0;
    return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  };

  const toggleSection = (sectionIndex) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionIndex)) {
      newExpanded.delete(sectionIndex);
    } else {
      newExpanded.add(sectionIndex);
    }
    setExpandedSections(newExpanded);
  };

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }
    enrollMutation.mutate();
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Please login to add courses to wishlist');
      navigate('/login');
      return;
    }
    wishlistMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(id);
  const isEnrolled = enrollmentStatus?.isEnrolled;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <button onClick={() => navigate('/courses')} className="hover:text-blue-500">
              Courses
            </button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{course.courseName}</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {course.courseName}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {course.courseDescription}
          </p>

          {/* Course Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium text-gray-900 dark:text-white">
                {course.averageRating}
              </span>
              <span>({course.totalRatings?.toLocaleString() || '0'} ratings)</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.totalStudents?.toLocaleString() || '0'} students enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.totalDuration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.totalLectures} lectures</span>
            </div>
          </div>

          {/* Instructor Info */}
          {course.instructor && (
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <img
                src={course.instructor.profilePicture || 'https://via.placeholder.com/50'}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instructor</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {course.instructor.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {course.courseVideo && (
              <div className="mb-8">
                <VideoPlayer videoUrl={course.courseVideo} />
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {['overview', 'curriculum', 'reviews', 'instructor'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${
                      selectedTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {selectedTab === 'overview' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    What you'll learn
                  </h3>
                  {course.learningOutcomes && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Course description
                  </h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    {showFullDescription ? (
                      <div>
                        <p className="mb-4">{course.courseDescription}</p>
                        <button
                          onClick={() => setShowFullDescription(false)}
                          className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Show less
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-4">
                          {course.courseDescription.length > 300
                            ? `${course.courseDescription.substring(0, 300)}...`
                            : course.courseDescription}
                        </p>
                        {course.courseDescription.length > 300 && (
                          <button
                            onClick={() => setShowFullDescription(true)}
                            className="text-blue-500 hover:text-blue-600 font-medium"
                          >
                            Read more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTab === 'curriculum' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Course content
                  </h3>
                  <div className="space-y-2">
                    {course.courseContent?.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => toggleSection(sectionIndex)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {section.sectionTitle}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {section.lectures.length} lectures • {formatDuration(
                                section.lectures.reduce((total, lecture) => total + lecture.duration, 0)
                              )}
                            </p>
                          </div>
                          {expandedSections.has(sectionIndex) ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedSections.has(sectionIndex) && (
                          <div className="border-t border-gray-200 dark:border-gray-700">
                            {section.lectures.map((lecture, lectureIndex) => (
                              <div key={lectureIndex} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {lecture.title}
                                  </span>
                                  {lecture.isPreview && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      Preview
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {formatDuration(lecture.duration)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Student reviews
                  </h3>
                  {course.reviews && course.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {course.reviews.slice(0, 5).map((review, index) => (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={review.user.profilePicture || 'https://via.placeholder.com/32'}
                              alt={review.user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {review.user.name}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No reviews yet.</p>
                  )}
                </div>
              )}

              {selectedTab === 'instructor' && course.instructor && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    About the instructor
                  </h3>
                  <div className="flex items-start gap-4">
                    <img
                      src={course.instructor.profilePicture || 'https://via.placeholder.com/80'}
                      alt={course.instructor.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {course.instructor.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {course.instructor.email}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Expert instructor with years of experience in teaching and industry.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                {/* Course Image */}
                <img
                  src={course.thumbnail || course.image || 'https://via.placeholder.com/400x250'}
                  alt={course.courseName}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />

                {/* Price */}
                <div className="mb-6">
                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(course.price)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                        {getDiscountPercentage()}% OFF
                      </span>
                    </div>
                  )}
                  {(!course.originalPrice || course.originalPrice <= course.price) && (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formatPrice(course.price)}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/courses/${id}/learn`)}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrollMutation.isLoading}
                      className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrollMutation.isLoading ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )}
                  
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistMutation.isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium border transition-colors flex items-center justify-center gap-2 ${
                      isInWishlist
                        ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                    {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>

                {/* Course Includes */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    This course includes:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatDuration(course.totalDuration)} on-demand video
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Downloadable resources
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Full lifetime access
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Certificate of completion
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 