import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryKeys, getInvalidationPatterns } from '../constants/queryKeys';
import { handleQueryError } from '../lib/queryClient';
import { leadService, Lead, CreateLeadRequest } from '../services/leadService';
import { MESSAGES } from '../utils/Messages';

// Hook interface
interface UseCustomersReturn {
  customers: Lead[];
  loading: boolean;
  error: string | null;
  addCustomer: (customer: Omit<CreateLeadRequest, 'created_by'>) => Promise<Lead>;
  refetch: () => void;
  isAddingCustomer: boolean;
}

export const useCustomers = (): UseCustomersReturn => {
  const queryClient = useQueryClient();

  // Query for fetching customers (leads where is_converted=true)
  const {
    data: customers = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.customers.list(),
    queryFn: async () => {
      const leads = await leadService.getLeads();
      return leads.filter(l => l.is_converted && l.is_active !== false);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for adding customers (create lead with is_converted=true)
  const {
    mutateAsync: addCustomerMutation,
    isPending: isAddingCustomer,
  } = useMutation({
    mutationFn: async (customer: Omit<CreateLeadRequest, 'created_by'>) => {
      // currentUser not needed; created_by is injected inside leadService
      const payload: Omit<CreateLeadRequest, 'created_by'> = {
        ...customer,
        is_converted: true,
      } as any;
      return leadService.createLead(payload as any);
    },
    onSuccess: () => {
      const invalidationKeys = getInvalidationPatterns.customers.onCreate();
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(MESSAGES.CUSTOMER_CREATE_SUCCESS);
    },
    onError: (error: any) => {
      const errorMessage = handleQueryError(error);
      toast.error(errorMessage || MESSAGES.CUSTOMER_CREATE_ERROR);
    },
  });

  const error = queryError ? handleQueryError(queryError) : null;

  const addCustomer = async (customer: Omit<CreateLeadRequest, 'created_by'>): Promise<Lead> => {
    try {
      return await addCustomerMutation(customer);
    } catch (err) {
      throw new Error(MESSAGES.CUSTOMER_CREATE_ERROR);
    }
  };

  return { customers, loading, error, addCustomer, refetch: () => { refetch(); }, isAddingCustomer };
}; 