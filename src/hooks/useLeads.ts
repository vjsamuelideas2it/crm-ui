import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryKeys, getInvalidationPatterns } from '../constants/queryKeys';
import { handleQueryError } from '../lib/queryClient';
import { 
  leadService, 
  Lead, 
  CreateLeadRequest, 
  UpdateLeadRequest,
  LeadStatus,
  Source
} from '../services/leadService';
import { MESSAGES } from '../utils/Messages';

// Hook return interface
interface UseLeadsReturn {
  // Data
  leads: Lead[];
  leadStatuses: LeadStatus[];
  sources: Source[];
  
  // Loading states
  loading: boolean;
  statusesLoading: boolean;
  sourcesLoading: boolean;
  actionLoading: boolean;
  
  // Error states
  error: string | null;
  statusesError: string | null;
  sourcesError: string | null;
  
  // Actions
  createLead: (leadData: Omit<CreateLeadRequest, 'created_by'>) => Promise<Lead>;
  updateLead: (id: number, leadData: Omit<UpdateLeadRequest, 'updated_by'>) => Promise<Lead>;
  deleteLead: (id: number) => Promise<void>;
  convertLead: (id: number) => Promise<void>;
  
  // Refetch functions
  refetch: () => void;
  refetchStatuses: () => void;
  refetchSources: () => void;
}

export const useLeads = (): UseLeadsReturn => {
  const queryClient = useQueryClient();

  // Query for fetching leads
  const {
    data: leads = [],
    isLoading: loading,
    error: leadsError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.leads.list(),
    queryFn: leadService.getLeads,
    staleTime: 2 * 60 * 1000, // 2 minutes - leads change more frequently
  });

  // Query for fetching lead statuses
  const {
    data: leadStatuses = [],
    isLoading: statusesLoading,
    error: statusesQueryError,
    refetch: refetchStatuses,
  } = useQuery({
    queryKey: queryKeys.leadStatuses.list(),
    queryFn: leadService.getLeadStatuses,
    staleTime: 10 * 60 * 1000, // 10 minutes - statuses don't change often
  });

  // Query for fetching sources
  const {
    data: sources = [],
    isLoading: sourcesLoading,
    error: sourcesQueryError,
    refetch: refetchSources,
  } = useQuery({
    queryKey: queryKeys.sources.list(),
    queryFn: leadService.getSources,
    staleTime: 10 * 60 * 1000, // 10 minutes - sources don't change often
  });

  // Mutation for creating leads
  const {
    mutateAsync: createLeadMutation,
    isPending: isCreating,
  } = useMutation({
    mutationFn: (leadData: Omit<CreateLeadRequest, 'created_by'>) => 
      leadService.createLead(leadData),
    onSuccess: () => {
      // Invalidate leads list
      const invalidationKeys = getInvalidationPatterns.leads.onCreate();
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(MESSAGES.LEAD_CREATE_SUCCESS);
    },
    onError: (error: any) => {
      const errorMessage = handleQueryError(error);
      toast.error(errorMessage || MESSAGES.LEAD_CREATE_ERROR);
    },
  });

  // Mutation for updating leads
  const {
    mutateAsync: updateLeadMutation,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: ({ id, leadData }: { id: number; leadData: Omit<UpdateLeadRequest, 'updated_by'> }) => 
      leadService.updateLead(id, leadData),
    onSuccess: (_, { id }) => {
      // Invalidate leads list and specific lead
      const invalidationKeys = getInvalidationPatterns.leads.onUpdate(id);
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(MESSAGES.LEAD_UPDATE_SUCCESS);
    },
    onError: (error: any) => {
      const errorMessage = handleQueryError(error);
      toast.error(errorMessage || MESSAGES.LEAD_UPDATE_ERROR);
    },
  });

  // Mutation for deleting leads
  const {
    mutateAsync: deleteLeadMutation,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (id: number) => leadService.deleteLead(id),
    onSuccess: (_, id) => {
      // Invalidate leads list and specific lead
      const invalidationKeys = getInvalidationPatterns.leads.onDelete(id);
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(MESSAGES.LEAD_DELETE_SUCCESS);
    },
    onError: (error: any) => {
      const errorMessage = handleQueryError(error);
      toast.error(errorMessage || MESSAGES.LEAD_DELETE_ERROR);
    },
  });

  // Mutation for converting leads
  const {
    mutateAsync: convertLeadMutation,
    isPending: isConverting,
  } = useMutation({
    mutationFn: (id: number) => leadService.convertLead(id),
    onSuccess: (_, id) => {
      // Invalidate leads list and specific lead
      const invalidationKeys = getInvalidationPatterns.leads.onUpdate(id);
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      // Also invalidate customers list since a new customer might be created
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
      toast.success(MESSAGES.LEAD_CONVERT_SUCCESS);
    },
    onError: (error: any) => {
      const errorMessage = handleQueryError(error);
      toast.error(errorMessage || MESSAGES.LEAD_CONVERT_ERROR);
    },
  });

  // Convert React Query errors to strings
  const error = leadsError ? handleQueryError(leadsError) : null;
  const statusesError = statusesQueryError ? handleQueryError(statusesQueryError) : null;
  const sourcesError = sourcesQueryError ? handleQueryError(sourcesQueryError) : null;

  // Combined action loading state
  const actionLoading = isCreating || isUpdating || isDeleting || isConverting;

  // Action functions that maintain the same interface
  const createLead = async (leadData: Omit<CreateLeadRequest, 'created_by'>): Promise<Lead> => {
    try {
      return await createLeadMutation(leadData);
    } catch (err) {
      throw new Error(MESSAGES.LEAD_CREATE_ERROR);
    }
  };

  const updateLead = async (id: number, leadData: Omit<UpdateLeadRequest, 'updated_by'>): Promise<Lead> => {
    try {
      return await updateLeadMutation({ id, leadData });
    } catch (err) {
      throw new Error(MESSAGES.LEAD_UPDATE_ERROR);
    }
  };

  const deleteLead = async (id: number): Promise<void> => {
    try {
      await deleteLeadMutation(id);
    } catch (err) {
      throw new Error(MESSAGES.LEAD_DELETE_ERROR);
    }
  };

  const convertLead = async (id: number): Promise<void> => {
    try {
      await convertLeadMutation(id);
    } catch (err) {
      throw new Error(MESSAGES.LEAD_CONVERT_ERROR);
    }
  };

  return {
    // Data
    leads,
    leadStatuses,
    sources,
    
    // Loading states
    loading,
    statusesLoading,
    sourcesLoading,
    actionLoading,
    
    // Error states
    error,
    statusesError,
    sourcesError,
    
    // Actions
    createLead,
    updateLead,
    deleteLead,
    convertLead,
    
    // Refetch functions
    refetch: () => {
      refetch();
    },
    refetchStatuses: () => {
      refetchStatuses();
    },
    refetchSources: () => {
      refetchSources();
    },
  };
}; 