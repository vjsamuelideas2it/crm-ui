import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(data);
      
      if (response.success) {
        // Store user and token in memory and localStorage
        login(response.data.user, response.data.token);
        
        // Show success toast
        toast.success('Login successful! Redirecting to dashboard...', {
          duration: 2000,
          className: 'auth-toast success',
        });
        
        // Navigate to intended destination or dashboard
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Show error toast
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage, {
        duration: 4000,
        className: 'auth-toast error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-logo">
            CRM
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Body */}
        <div className="auth-card__body">
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
              {errors.email && (
                <div className="form-error">
                  <ExclamationCircleIcon className="error-icon" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <div className="form-error">
                  <ExclamationCircleIcon className="error-icon" />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-group">
              <button
                type="submit"
                disabled={isLoading}
                className="submit-btn"
              >
                <span className={`btn-text ${isLoading ? 'loading' : ''}`}>
                  Sign In
                </span>
                <div className={`btn-loader ${isLoading ? 'loading' : ''}`}>
                  <div className="spinner"></div>
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="auth-card__footer">
          <p className="auth-link-text">
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-link"
              onClick={handleSignupClick}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 