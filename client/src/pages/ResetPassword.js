import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        toast.error('Invalid reset link');
        navigate('/forgot-password');
        return;
      }

      try {
        const response = await axios.get(`/api/auth/reset-password/validate/${token}`);
        if (response.data.valid) {
          setIsValidToken(true);
        } else {
          toast.error('Reset link has expired or is invalid');
          navigate('/forgot-password');
        }
      } catch (error) {
        toast.error('Reset link has expired or is invalid');
        navigate('/forgot-password');
      } finally {
        setTokenValidated(true);
      }
    };

    validateToken();
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = searchParams.get('token');
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password: data.password
      });
      
      if (response.data.success) {
        toast.success('Password reset successfully! You can now login with your new password.');
        navigate('/login');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValidated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isValidToken) {
    return null; // Will redirect to forgot-password
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center shadow-glow">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  className={`input-primary pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`input-primary pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-error-600 dark:text-error-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password requirements:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li className={`flex items-center ${password && password.length >= 6 ? 'text-green-600' : ''}`}>
                  <CheckCircle className={`w-4 h-4 mr-2 ${password && password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
                  At least 6 characters
                </li>
                <li className={`flex items-center ${password && /[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                  <CheckCircle className={`w-4 h-4 mr-2 ${password && /[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                  One lowercase letter
                </li>
                <li className={`flex items-center ${password && /[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                  <CheckCircle className={`w-4 h-4 mr-2 ${password && /[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                  One uppercase letter
                </li>
                <li className={`flex items-center ${password && /\d/.test(password) ? 'text-green-600' : ''}`}>
                  <CheckCircle className={`w-4 h-4 mr-2 ${password && /\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 