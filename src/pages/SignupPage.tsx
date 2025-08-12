import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authService, SignupRequest } from '../services/authService';
import { useRoles } from '../hooks/useRoles';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { roles, loading: rolesLoading, error: rolesError, refetch: refetchRoles } = useRoles();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SignupFormData>({
    mode: 'onBlur',
    defaultValues: {
      role_id: undefined, // Will be set when roles load
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    clearErrors(); // Clear any previous errors
    
    try {
      const response = await authService.signup(data);
      
      if (response.success) {
        // Store user and token in memory and localStorage
        login(response.data.user, response.data.token);
        
        // Show success toast
        toast.success('Account created successfully! Redirecting to dashboard...', {
          duration: 2000,
          className: 'auth-toast success',
        });
        
        // Navigate to dashboard
        navigate('/', { replace: true });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      
      // Handle specific error cases
      if (errorMessage.includes('email already exists')) {
        // Show error toast for duplicate email
        toast.error('An account with this email already exists', {
          duration: 4000,
          className: 'auth-toast error',
        });
      } else if (errorMessage.includes('Invalid role')) {
        // Set field-specific error for role
        setError('role_id', {
          type: 'manual',
          message: 'Please select a valid role',
        });
      } else {
        // Generic error toast
        toast.error(errorMessage, {
          duration: 4000,
          className: 'auth-toast error',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Get default role ID (prefer "User" role, fallback to first role)
  const getDefaultRoleId = () => {
    if (roles.length === 0) return undefined;
    const userRole = roles.find(role => role.name.toLowerCase() === 'user');
    return userRole ? userRole.id : roles[0].id;
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-logo">
            CRM
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join us to start managing your leads and customers</p>
        </div>

        {/* Body */}
        <div className="auth-card__body">
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Name must be less than 100 characters',
                  },
                })}
              />
              {errors.name && (
                <div className="form-error">
                  <ExclamationCircleIcon className="error-icon" />
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>

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
                placeholder="Create a password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Password must be less than 100 characters',
                  },
                })}
              />
              {errors.password && (
                <div className="form-error">
                  <ExclamationCircleIcon className="error-icon" />
                  <span>{errors.password.message}</span>
                </div>
              )}
              <div className="form-help">
                Password must be at least 6 characters long
              </div>
            </div>

            {/* Role Field */}
            <div className="form-group">
              <label htmlFor="role_id" className="form-label">
                Role
              </label>
              
              {rolesLoading ? (
                <div className="form-loading-state">
                  <div className="spinner"></div>
                  <span>Loading roles...</span>
                </div>
              ) : rolesError ? (
                <div className="form-error-state">
                  <div className="form-error">
                    <ExclamationCircleIcon className="error-icon" />
                    <span>Failed to load roles</span>
                  </div>
                  <button 
                    type="button" 
                    className="retry-btn"
                    onClick={refetchRoles}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <select
                  id="role_id"
                  className={`form-select ${errors.role_id ? 'error' : ''}`}
                  {...register('role_id', {
                    required: 'Please select a role',
                    valueAsNumber: true,
                  })}
                  defaultValue={getDefaultRoleId()}
                >
                  <option value="">Select your role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              )}
              
              {errors.role_id && (
                <div className="form-error">
                  <ExclamationCircleIcon className="error-icon" />
                  <span>{errors.role_id.message}</span>
                </div>
              )}
              
              {!rolesLoading && !rolesError && (
                <div className="form-help">
                  Select your role in the organization
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-group">
              <button
                type="submit"
                disabled={isLoading || rolesLoading}
                className="submit-btn"
              >
                <span className={`btn-text ${isLoading ? 'loading' : ''}`}>
                  Create Account
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
            Already have an account?{' '}
            <button
              type="button"
              className="auth-link"
              onClick={handleLoginClick}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 