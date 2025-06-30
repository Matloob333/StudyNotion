import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Clock, Star, User, BookOpen, Trash2 } from 'lucide-react';

// Utility to format price in INR
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setWishlist([
      {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "John Doe",
        rating: 4.8,
        students: 1250,
        duration: "12 hours",
        lessons: 45,
        price: 99.99,
        image: "https://via.placeholder.com/300x200",
        category: "Web Development",
        level: "Beginner"
      },
      {
        id: 2,
        title: "React Masterclass",
        instructor: "Jane Smith",
        rating: 4.9,
        students: 890,
        duration: "8 hours",
        lessons: 32,
        price: 79.99,
        image: "https://via.placeholder.com/300x200",
        category: "Web Development",
        level: "Intermediate"
      },
      {
        id: 3,
        title: "Data Science Fundamentals",
        instructor: "Mike Johnson",
        rating: 4.7,
        students: 2100,
        duration: "15 hours",
        lessons: 60,
        price: 129.99,
        image: "https://via.placeholder.com/300x200",
        category: "Data Science",
        level: "Beginner"
      }
    ]);
    setLoading(false);
  }, []);

  const handleRemoveFromWishlist = (courseId) => {
    setWishlist(wishlist.filter(course => course.id !== courseId));
  };

  const handleEnroll = (courseId) => {
    // Handle enrollment logic here
    console.log('Enrolling in course:', courseId);
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlist.length} course{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring courses and add them to your wishlist to save them for later.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition duration-200"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(course.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {course.category}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(course.price)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {course.students} students
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-200 flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Enroll Now</span>
                    </button>
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-full border border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 