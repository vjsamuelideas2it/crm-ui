import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants/queryKeys';
import { handleQueryError } from '../lib/queryClient';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config/env';
import { getInvalidationPatterns } from '../constants/queryKeys';

// User interface matching backend structure
export interface User {
  id: number;
  name: string;
  email?: string;
  role: {
    id: number;
    name: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

// Get auth headers helper
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// API service function - now using main users endpoint
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json() as ApiResponse<any[]>;
  
  // Filter and transform to only include active users with minimal data
  return data.data
    .filter((user: any) => user.is_active !== false) // Only active users
    .map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }))
    .sort((a: User, b: User) => a.name.localeCompare(b.name)); // Sort by name
};

// Hook interface
interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createUser: (payload: { name: string; email: string; password: string; role_id: number }) => Promise<void>;
  updateUser: (id: number, payload: Partial<{ name: string; email: string; password: string; role_id: number }>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

// Hook for users (filtered for assignment purposes)
export const useUsers = (): UseUsersReturn => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  });

  const { mutateAsync: createUserMutation } = useMutation({
    mutationFn: async (payload: { name: string; email: string; password: string; role_id: number }) => {
      const res = await fetch(`${API_BASE_URL}/users`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      getInvalidationPatterns.users.onCreate().forEach(key => queryClient.invalidateQueries({ queryKey: key }));
    }
  });

  const { mutateAsync: updateUserMutation } = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<{ name: string; email: string; password: string; role_id: number }> }) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: (_data, { id }) => {
      getInvalidationPatterns.users.onUpdate(id).forEach(key => queryClient.invalidateQueries({ queryKey: key }));
    }
  });

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: (_data, id) => {
      getInvalidationPatterns.users.onDelete(id as number).forEach(key => queryClient.invalidateQueries({ queryKey: key }));
    }
  });

  // Convert React Query error to string
  const error = queryError ? handleQueryError(queryError) : null;

  return {
    users,
    loading,
    error,
    refetch: () => {
      refetch();
    },
    createUser: (payload) => createUserMutation(payload),
    updateUser: (id, payload) => updateUserMutation({ id, payload }),
    deleteUser: (id) => deleteUserMutation(id),
  };
}; 