/**
 * Centralized Query Keys for React Query
 * 
 * This file contains all query keys used throughout the application.
 * Using a centralized approach ensures consistency and helps with cache invalidation.
 */

// Base query key factories
export const queryKeys = {
  // Auth-related queries
  auth: {
    me: () => ['auth', 'me'] as const,
    validate: (token: string) => ['auth', 'validate', token] as const,
  },

  // User-related queries
  users: {
    all: () => ['users'] as const,
    list: (filters?: any) => ['users', 'list', filters] as const,
    detail: (id: number) => ['users', 'detail', id] as const,
    assignable: () => ['users', 'assignable'] as const,
  },

  // Lead-related queries
  leads: {
    all: () => ['leads'] as const,
    list: (filters?: any) => ['leads', 'list', filters] as const,
    detail: (id: number) => ['leads', 'detail', id] as const,
    byStatus: (statusId: number) => ['leads', 'byStatus', statusId] as const,
  },

  // Customer-related queries
  customers: {
    all: () => ['customers'] as const,
    list: (filters?: any) => ['customers', 'list', filters] as const,
    detail: (id: number) => ['customers', 'detail', id] as const,
  },

  // Work Items
  workItems: {
    all: () => ['workItems'] as const,
    list: (filters?: any) => ['workItems', 'list', filters] as const,
    detail: (id: number) => ['workItems', 'detail', id] as const,
  },

  // Tasks
  tasks: {
    all: () => ['tasks'] as const,
    list: (filters?: any) => ['tasks', 'list', filters] as const,
    detail: (id: number) => ['tasks', 'detail', id] as const,
    byWorkItem: (workItemId: number) => ['tasks', 'byWorkItem', workItemId] as const,
  },

  // Role-related queries
  roles: {
    all: () => ['roles'] as const,
    list: () => ['roles', 'list'] as const,
    detail: (id: number) => ['roles', 'detail', id] as const,
  },

  // Lead Status-related queries
  leadStatuses: {
    all: () => ['leadStatuses'] as const,
    list: () => ['leadStatuses', 'list'] as const,
    detail: (id: number) => ['leadStatuses', 'detail', id] as const,
  },

  // Source-related queries
  sources: {
    all: () => ['sources'] as const,
    list: () => ['sources', 'list'] as const,
    detail: (id: number) => ['sources', 'detail', id] as const,
  },

  // Health check
  health: {
    check: () => ['health', 'check'] as const,
  },
} as const;

// Helper type for extracting query key types
export type QueryKeys = typeof queryKeys;

// Utility function to invalidate related queries
export const getInvalidationPatterns = {
  leads: {
    onCreate: () => [queryKeys.leads.all()],
    // Also invalidate customers, since an update to a converted lead should reflect in Customers list
    onUpdate: (id: number) => [queryKeys.leads.all(), queryKeys.leads.detail(id), queryKeys.customers.all()],
    // Ensure customers (converted leads) list also refreshes when a lead is deleted
    onDelete: (id: number) => [queryKeys.leads.all(), queryKeys.leads.detail(id), queryKeys.customers.all()],
  },
  customers: {
    onCreate: () => [queryKeys.customers.all(), queryKeys.leads.all()],
    onUpdate: () => [queryKeys.customers.all(), queryKeys.leads.all()],
    onDelete: () => [queryKeys.customers.all(), queryKeys.leads.all()],
  },
  users: {
    onCreate: () => [queryKeys.users.all(), queryKeys.users.assignable()],
    onUpdate: (id: number) => [queryKeys.users.all(), queryKeys.users.detail(id), queryKeys.users.assignable()],
    onDelete: (id: number) => [queryKeys.users.all(), queryKeys.users.detail(id), queryKeys.users.assignable()],
  },
  workItems: {
    onCreate: () => [queryKeys.workItems.all(), queryKeys.tasks.all()],
    onUpdate: (id: number) => [queryKeys.workItems.all(), queryKeys.workItems.detail(id), queryKeys.tasks.all()],
    onDelete: (id: number) => [queryKeys.workItems.all(), queryKeys.workItems.detail(id), queryKeys.tasks.all()],
  },
  tasks: {
    onCreate: (workItemId?: number) => [queryKeys.tasks.all(), workItemId ? queryKeys.tasks.byWorkItem(workItemId) : undefined].filter(Boolean) as any[],
    onUpdate: (id: number, workItemId?: number) => [queryKeys.tasks.all(), queryKeys.tasks.detail(id), workItemId ? queryKeys.tasks.byWorkItem(workItemId) : undefined, queryKeys.workItems.all()].filter(Boolean) as any[],
    onDelete: (id: number, workItemId?: number) => [queryKeys.tasks.all(), queryKeys.tasks.detail(id), workItemId ? queryKeys.tasks.byWorkItem(workItemId) : undefined, queryKeys.workItems.all()].filter(Boolean) as any[],
  },
}; 