import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('approve');
  const [formData, setFormData] = useState({
    adminNotes: '',
    rejectionReason: '',
    revisionNotes: '',
    newPrice: '',
    priceOverrideReason: ''
  });

  // Fetch admin dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery(
    'admin-dashboard',
    async () => {
      const response = await axios.get('/api/admin/dashboard');
      return response.data;
    }
  );

  // Fetch pending courses
  const { data: pendingCourses = [], isLoading: pendingLoading } = useQuery(
    ['pending-courses', activeTab],
    async () => {
      const response = await axios.get(`/api/admin/pending-courses?status=${activeTab}`);
      return response.data.courses || [];
    }
  );

  // Fetch all courses
  const { data: allCourses = [], isLoading: allLoading } = useQuery(
    'all-courses',
    async () => {
      const response = await axios.get('/api/admin/all-courses');
      return response.data.courses || [];
    }
  );

  // Fetch instructors
  const { data: instructors = [] } = useQuery(
    'instructors',
    async () => {
      const response = await axios.get('/api/admin/instructors');
      return response.data;
    }
  );

  // Approve course mutation
  const approveMutation = useMutation(
    async ({ courseId, data }) => {
      const response = await axios.post(`/api/admin/approve-course/${courseId}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pending-courses']);
        queryClient.invalidateQueries('all-courses');
        queryClient.invalidateQueries('admin-dashboard');
        toast.success('Course approved successfully!');
        setShowModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error approving course');
      }
    }
  );

  // Reject course mutation
  const rejectMutation = useMutation(
    async ({ courseId, data }) => {
      const response = await axios.post(`/api/admin/reject-course/${courseId}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pending-courses']);
        queryClient.invalidateQueries('all-courses');
        queryClient.invalidateQueries('admin-dashboard');
        toast.success('Course rejected successfully!');
        setShowModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error rejecting course');
      }
    }
  );

  // Request revision mutation
  const revisionMutation = useMutation(
    async ({ courseId, data }) => {
      const response = await axios.post(`/api/admin/request-revision/${courseId}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pending-courses']);
        queryClient.invalidateQueries('all-courses');
        queryClient.invalidateQueries('admin-dashboard');
        toast.success('Revision requested successfully!');
        setShowModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error requesting revision');
      }
    }
  );

  // Delete course mutation
  const deleteMutation = useMutation(
    async (courseId) => {
      const response = await axios.delete(`/api/admin/delete-course/${courseId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pending-courses']);
        queryClient.invalidateQueries('all-courses');
        queryClient.invalidateQueries('admin-dashboard');
        toast.success('Course deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error deleting course');
      }
    }
  );

  const handleAction = (course, action) => {
    setSelectedCourse(course);
    setModalType(action);
    setShowModal(true);
    setFormData({
      adminNotes: '',
      rejectionReason: '',
      revisionNotes: '',
      newPrice: '',
      priceOverrideReason: ''
    });
  };

  const handleSubmit = () => {
    if (!selectedCourse) return;

    const data = {
      adminNotes: formData.adminNotes
    };

    switch (modalType) {
      case 'approve':
        if (formData.newPrice) {
          data.adminPriceOverride = parseFloat(formData.newPrice);
          data.adminPriceOverrideReason = formData.priceOverrideReason;
        }
        approveMutation.mutate({ courseId: selectedCourse._id, data });
        break;
      case 'reject':
        data.rejectionReason = formData.rejectionReason;
        rejectMutation.mutate({ courseId: selectedCourse._id, data });
        break;
      case 'revision':
        data.revisionNotes = formData.revisionNotes;
        revisionMutation.mutate({ courseId: selectedCourse._id, data });
        break;
      default:
        break;
    }
  };

  const handleDelete = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteMutation.mutate(courseId);
    }
  };

  const isLoading = statsLoading || pendingLoading || allLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  const stats = dashboardStats?.stats || {};
  const courses = activeTab === 'all' ? allCourses : pendingCourses;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage courses, instructors, and platform settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCourses || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingCourses || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Instructors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalInstructors || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalStudents || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white dark:bg-dark-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Pending ({stats.pendingCourses || 0})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'approved'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Approved ({stats.approvedCourses || 0})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rejected'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <XCircle className="w-4 h-4 inline mr-2" />
            Rejected ({stats.rejectedCourses || 0})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            All Courses
          </button>
        </div>

        {/* Courses List */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {activeTab === 'pending' && 'Pending Approval'}
              {activeTab === 'approved' && 'Approved Courses'}
              {activeTab === 'rejected' && 'Rejected Courses'}
              {activeTab === 'all' && 'All Courses'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={course.thumbnail || 'https://via.placeholder.com/40x40'}
                          alt={course.courseName}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {course.courseName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {course.category?.name || 'No Category'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {course.instructor?.firstName} {course.instructor?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {course.instructor?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        ₹{course.price}
                      </div>
                      {course.adminPriceOverride && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                          Admin Override
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.approvalStatus === 'Approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : course.approvalStatus === 'Rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : course.approvalStatus === 'Under Review'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {course.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {course.approvalStatus === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleAction(course, 'approve')}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(course, 'reject')}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(course, 'revision')}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {modalType === 'approve' && 'Approve Course'}
              {modalType === 'reject' && 'Reject Course'}
              {modalType === 'revision' && 'Request Revision'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Course: <span className="font-medium">{selectedCourse.courseName}</span>
              </p>
            </div>

            {modalType === 'approve' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-700 dark:text-gray-100"
                    rows="3"
                    placeholder="Add any notes for the instructor..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Override Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.newPrice}
                    onChange={(e) => setFormData({ ...formData, newPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-700 dark:text-gray-100"
                    placeholder="Enter new price"
                  />
                </div>
                {formData.newPrice && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Override Reason
                    </label>
                    <textarea
                      value={formData.priceOverrideReason}
                      onChange={(e) => setFormData({ ...formData, priceOverrideReason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-700 dark:text-gray-100"
                      rows="2"
                      placeholder="Reason for price change..."
                    />
                  </div>
                )}
              </>
            )}

            {modalType === 'reject' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={formData.rejectionReason}
                    onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-700 dark:text-gray-100"
                    rows="3"
                    placeholder="Explain why the course is being rejected..."
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-700 dark:text-gray-100"
                    rows="2"
                    placeholder="Additional notes..."
                  />
                </div>
              </>
            )}

            {modalType === 'revision' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Revision Notes *
                  </label>
                  <textarea
                    value={formData.revisionNotes}
                    onChange={(e) => setFormData({ ...formData, revisionNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-700 dark:text-gray-100"
                    rows="3"
                    placeholder="What changes are needed?"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-700 dark:text-gray-100"
                    rows="2"
                    placeholder="Additional notes..."
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  (modalType === 'reject' && !formData.rejectionReason) ||
                  (modalType === 'revision' && !formData.revisionNotes) ||
                  approveMutation.isLoading ||
                  rejectMutation.isLoading ||
                  revisionMutation.isLoading
                }
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  modalType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : modalType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {approveMutation.isLoading || rejectMutation.isLoading || revisionMutation.isLoading
                  ? 'Processing...'
                  : modalType === 'approve'
                  ? 'Approve'
                  : modalType === 'reject'
                  ? 'Reject'
                  : 'Request Revision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 