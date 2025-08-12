export interface Customer {
  id: number
  name: string
  email: string
  company: string
  status: 'Active' | 'Inactive'
  createdAt: Date
}

export interface Lead {
  id: number
  name: string
  email: string
  source: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost'
  createdAt: Date
}

// Mock API functions - replace with actual API calls
export const apiService = {
  // Customer functions
  getCustomers: async (): Promise<Customer[]> => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'John Smith', email: 'john@example.com', company: 'ABC Corp', status: 'Active', createdAt: new Date() },
          { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', company: 'XYZ Inc', status: 'Active', createdAt: new Date() },
        ])
      }, 500)
    })
  },

  createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...customer,
          id: Math.random(),
          createdAt: new Date(),
        })
      }, 500)
    })
  },

  // Lead functions
  getLeads: async (): Promise<Lead[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Alice Cooper', email: 'alice@example.com', source: 'Website', status: 'New', createdAt: new Date() },
          { id: 2, name: 'Bob Wilson', email: 'bob@example.com', source: 'Referral', status: 'Contacted', createdAt: new Date() },
        ])
      }, 500)
    })
  },

  convertLead: async (): Promise<Customer> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: Math.random(),
          name: 'Converted Customer',
          email: 'converted@example.com',
          company: 'New Company',
          status: 'Active',
          createdAt: new Date(),
        })
      }, 500)
    })
  },
} 