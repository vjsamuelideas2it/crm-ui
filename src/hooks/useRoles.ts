import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../constants/queryKeys';
import { handleQueryError } from '../lib/queryClient';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config/env';

// Role interface matching backend structure
export interface Role {
  id: number;
  name: string;
  description?: string;
}

// API response interface
interface RolesResponse {
  success: boolean;
  data: {
    roles: Role[];
    count: number;
  };
  message?: string;
}

// Get auth headers helper
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// API service function
const fetchRoles = async (): Promise<Role[]> => {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: RolesResponse = await response.json();

  if (data.success) {
    return data.data.roles;
  } else {
    throw new Error(data.message || 'Failed to fetch roles');
  }
};

// Hook interface
interface UseRolesReturn {
  roles: Role[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRoles = (): UseRolesReturn => {
  const {
    data: roles = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: fetchRoles,
    staleTime: 10 * 60 * 1000, // 10 minutes - roles don't change often
  });

  // Convert React Query error to string
  const error = queryError ? handleQueryError(queryError) : null;

  return {
    roles,
    loading,
    error,
    refetch: () => {
      refetch();
    },
  };
};

export default useRoles; 