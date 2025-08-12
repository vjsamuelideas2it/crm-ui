import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * 
 * This file sets up the QueryClient with application-specific defaults
 * including error handling, retry logic, and caching behavior.
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time until data is considered stale (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Cache time before garbage collection (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry for authentication errors (401/403)
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        
        // Don't retry for client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        
        // Retry up to 2 times for server errors
        return failureCount < 2;
      },
      
      // Retry delay (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    
    mutations: {
      // Retry configuration for mutations
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        
        // Retry once for server errors
        return failureCount < 1;
      },
    },
  },
});

// Global error handler function that can be used in hooks
export const handleQueryError = (error: any) => {
  console.error('Query error:', error);
  
  // Handle Error objects (thrown by services)
  if (error instanceof Error && error.message) {
    return error.message;
  }
  
  // Handle error objects with message property
  if (error?.message) {
    return error.message;
  }
  
  // Handle specific HTTP status codes
  if (error?.status === 401) {
    return 'Authentication required. Please log in again.';
  }
  
  if (error?.status === 403) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  if (error?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  // Handle response errors with error property
  if (error?.error) {
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (error.error.message) {
      return error.error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
}; 