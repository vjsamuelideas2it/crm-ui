import { API_BASE_URL, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../config/env';

// Lead interfaces
export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status_id: number;
  source_id: number;
  assigned_to?: number;
  notes?: string;
  is_converted: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status?: LeadStatus;
  source?: Source;
  assigned_user?: {
    id: number;
    name: string;
    email: string;
  };
  created_user?: { id: number; name: string; email?: string };
  updated_user?: { id: number; name: string; email?: string };
}

export interface LeadStatus {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface Source {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone?: string;
  status_id: number;
  source_id: number;
  assigned_to?: number;
  notes?: string;
  created_by: number; // Required by backend contract
  is_converted?: boolean;
}

export interface UpdateLeadRequest {
  name?: string;
  email?: string;
  phone?: string;
  status_id?: number;
  source_id?: number;
  assigned_to?: number;
  notes?: string;
  updated_by: number; // Required by backend contract
  is_converted?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper function to get current user ID
const getCurrentUserId = (): number => {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) {
    throw new Error('User not authenticated');
  }
  const user = JSON.parse(userStr);
  return user.id;
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const responseText = await response.text();
    
    let errorData;
    let errorMessage = 'Unknown error';
    
    try {
      errorData = JSON.parse(responseText);
      
      // Extract error message from backend JSON error format
      if (errorData.error && typeof errorData.error === 'object' && errorData.error.message) {
        errorMessage = errorData.error.message;
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else {
        errorMessage = `HTTP ${response.status}`;
      }
    } catch (parseError) {
      // Fallback: try to extract error message from HTML response
      const htmlMatch = responseText.match(/<pre>(.*?)<\/pre>/s);
      if (htmlMatch) {
        // Extract the first line of the error (before the stack trace)
        const errorLine = htmlMatch[1].split('<br>')[0].trim();
        // Remove HTML entities
        errorMessage = errorLine
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/^Error:\s*/, ''); // Remove "Error: " prefix
      } else {
        errorMessage = `HTTP ${response.status}: Invalid response format`;
      }
    }
    
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  if (!data.success) {
    // Handle success:false responses
    let errorMessage = 'Request failed';
    if (data.error && typeof data.error === 'object' && data.error.message) {
      errorMessage = data.error.message;
    } else if (typeof data.error === 'string') {
      errorMessage = data.error;
    } else if (data.message) {
      errorMessage = data.message;
    }
    
    throw new Error(errorMessage);
  }
  
  return data.data;
};

class LeadService {
  async getLeads(): Promise<Lead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, { method: 'GET', headers: getAuthHeaders() });
      return handleResponse<Lead[]>(response);
    } catch (error) { console.error('Error fetching leads:', error); throw error; }
  }

  async getLeadById(id: number): Promise<Lead> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, { method: 'GET', headers: getAuthHeaders() });
      return handleResponse<Lead>(response);
    } catch (error) { console.error('Error fetching lead:', error); throw error; }
  }

  async createLead(leadData: Omit<CreateLeadRequest, 'created_by'>): Promise<Lead> {
    try {
      const currentUserId = getCurrentUserId();
      const requestPayload: CreateLeadRequest = { ...leadData, created_by: currentUserId };
      const response = await fetch(`${API_BASE_URL}/leads`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(requestPayload) });
      return handleResponse<Lead>(response);
    } catch (error) { console.error('Error creating lead:', error); throw error; }
  }

  async updateLead(id: number, leadData: Omit<UpdateLeadRequest, 'updated_by'>): Promise<Lead> {
    try {
      const currentUserId = getCurrentUserId();
      const requestPayload: UpdateLeadRequest = { ...leadData, updated_by: currentUserId };
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(requestPayload) });
      return handleResponse<Lead>(response);
    } catch (error) { console.error('Error updating lead:', error); throw error; }
  }

  async deleteLead(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      await handleResponse<void>(response);
    } catch (error) { console.error('Error deleting lead:', error); throw error; }
  }

  async getLeadStatuses(): Promise<LeadStatus[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/lead-statuses`, { method: 'GET', headers: getAuthHeaders() });
      const data = await handleResponse<{ statuses: LeadStatus[] }>(response);
      return data.statuses;
    } catch (error) { console.error('Error fetching lead statuses:', error); throw error; }
  }

  async getSources(): Promise<Source[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sources`, { method: 'GET', headers: getAuthHeaders() });
      const data = await handleResponse<{ sources: Source[] }>(response);
      return data.sources;
    } catch (error) { console.error('Error fetching sources:', error); throw error; }
  }

  async convertLead(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}/convert`, { method: 'POST', headers: getAuthHeaders() });
      await handleResponse<void>(response);
    } catch (error) { console.error('Error converting lead:', error); throw error; }
  }

  async getLeadsByStatus(statusId: number): Promise<Lead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/status/${statusId}`, { method: 'GET', headers: getAuthHeaders() });
      return handleResponse<Lead[]>(response);
    } catch (error) { console.error('Error fetching leads by status:', error); throw error; }
  }
}

export const leadService = new LeadService(); 