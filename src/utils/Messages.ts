// Toast Messages for the CRM Application
export const MESSAGES = {
  // General
  LOADING: 'Loading...',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  SUCCESS_GENERIC: 'Operation completed successfully',
  
  // Authentication
  LOGIN_SUCCESS: 'Login successful! Welcome back.',
  LOGIN_ERROR: 'Invalid email or password',
  LOGOUT_SUCCESS: 'Logged out successfully',
  SIGNUP_SUCCESS: 'Account created successfully!',
  SIGNUP_ERROR: 'Failed to create account',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  
  // Leads
  LEAD_CREATE_SUCCESS: 'Lead created successfully!',
  LEAD_CREATE_ERROR: 'Failed to create lead',
  LEAD_UPDATE_SUCCESS: 'Lead updated successfully!',
  LEAD_UPDATE_ERROR: 'Failed to update lead',
  LEAD_DELETE_SUCCESS: 'Lead deleted successfully!',
  LEAD_DELETE_ERROR: 'Failed to delete lead',
  LEAD_FETCH_ERROR: 'Failed to fetch leads',
  LEAD_NOT_FOUND: 'Lead not found',
  LEAD_CONVERT_SUCCESS: 'Lead converted to customer successfully!',
  LEAD_CONVERT_ERROR: 'Failed to convert lead',
  LEAD_DUPLICATE_EMAIL: 'A lead with this email already exists',
  LEAD_DUPLICATE_PHONE: 'A lead with this phone number already exists',
  LEAD_DUPLICATE_CONTACT: 'A lead with this contact information already exists',
  
  // Customers
  CUSTOMER_CREATE_SUCCESS: 'Customer created successfully!',
  CUSTOMER_CREATE_ERROR: 'Failed to create customer',
  CUSTOMER_UPDATE_SUCCESS: 'Customer updated successfully!',
  CUSTOMER_UPDATE_ERROR: 'Failed to update customer',
  CUSTOMER_DELETE_SUCCESS: 'Customer deleted successfully!',
  CUSTOMER_DELETE_ERROR: 'Failed to delete customer',
  CUSTOMER_FETCH_ERROR: 'Failed to fetch customers',
  CUSTOMER_NOT_FOUND: 'Customer not found',
  
  // Users
  USER_CREATE_SUCCESS: 'User created successfully!',
  USER_CREATE_ERROR: 'Failed to create user',
  USER_UPDATE_SUCCESS: 'User updated successfully!',
  USER_UPDATE_ERROR: 'Failed to update user',
  USER_DELETE_SUCCESS: 'User deleted successfully!',
  USER_DELETE_ERROR: 'Failed to delete user',
  USER_FETCH_ERROR: 'Failed to fetch users',
  USER_NOT_FOUND: 'User not found',
  
  // Validation
  VALIDATION_REQUIRED: 'This field is required',
  VALIDATION_EMAIL: 'Please enter a valid email address',
  VALIDATION_PHONE: 'Please enter a valid phone number',
  VALIDATION_PASSWORD_MIN: 'Password must be at least 6 characters',
  VALIDATION_NAME_MIN: 'Name must be at least 2 characters',
  
  // Confirmations
  CONFIRM_DELETE_LEAD: 'Are you sure you want to delete this lead? This action cannot be undone.',
  CONFIRM_DELETE_CUSTOMER: 'Are you sure you want to delete this customer? This action cannot be undone.',
  CONFIRM_DELETE_USER: 'Are you sure you want to delete this user? This action cannot be undone.',
  CONFIRM_CONVERT_LEAD: 'Are you sure you want to convert this lead to a customer?',
  
  // Network
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Form
  FORM_UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  FORM_SAVE_SUCCESS: 'Changes saved successfully!',
  FORM_SAVE_ERROR: 'Failed to save changes',
  
  // Data Loading
  DATA_FETCH_ERROR: 'Failed to fetch data',
  DATA_REFRESH_SUCCESS: 'Data refreshed successfully',
  
  // Roles & Permissions
  ROLES_FETCH_ERROR: 'Failed to fetch roles',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action',
} as const; 