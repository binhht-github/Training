// Training: React Query Patterns in BizFix CRM
// This file demonstrates the API patterns used throughout the application

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Simple types for demonstration
interface TCustomer {
  id: string
  businessName: string
  customerType: 'business' | 'individual'
  email?: string
  phone?: string
  status: 'active' | 'inactive' | 'pending'
  industry?: string
  createdAt: string
  updatedAt: string
}

interface CustomerParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

// Mock API - simplified version
const mockAPI = {
  async getCustomers(_params: CustomerParams) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      data: [
        {
          id: '1',
          businessName: 'Tech Solutions Inc',
          customerType: 'business' as const,
          email: 'contact@techsolutions.com',
          phone: '+1-555-0123',
          status: 'active' as const,
          industry: 'Technology',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          businessName: 'Design Studio Pro',
          customerType: 'business' as const,
          email: 'hello@designstudio.com',
          phone: '+1-555-0124',
          status: 'active' as const,
          industry: 'Design',
          createdAt: '2024-01-16T14:20:00Z',
          updatedAt: '2024-01-16T14:20:00Z',
        },
      ],
      totalItems: 2,
      totalPages: 1,
      currentPage: 0,
    }
  },

  async createCustomer(data: Partial<TCustomer>) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      id: Date.now().toString(),
      businessName: 'New Customer',
      customerType: 'business' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    }
  },

  async updateCustomer(id: string, data: Partial<TCustomer>) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      id,
      businessName: 'Updated Customer',
      customerType: 'business' as const,
      status: 'active' as const,
      updatedAt: new Date().toISOString(),
      ...data,
    }
  },

  async deleteCustomer(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(`Deleted customer ${id}`)
    return { success: true }
  },
}

// Custom hooks
export const useCustomers = (params: CustomerParams = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => mockAPI.getCustomers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<TCustomer>) => mockAPI.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      console.log('Customer created successfully!')
    },
    onError: (error) => {
      console.error('Failed to create customer:', error)
    },
  })
}

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TCustomer> }) =>
      mockAPI.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      console.log('Customer updated successfully!')
    },
    onError: (error) => {
      console.error('Failed to update customer:', error)
    },
  })
}

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => mockAPI.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      console.log('Customer deleted successfully!')
    },
    onError: (error) => {
      console.error('Failed to delete customer:', error)
    },
  })
}

// Example component
export const CustomerQueryExamples = () => {
  const {
    data: customers,
    isLoading,
    error,
  } = useCustomers({ status: 'active' })
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const deleteCustomer = useDeleteCustomer()

  const handleCreateCustomer = () => {
    createCustomer.mutate({
      businessName: 'New Customer',
      customerType: 'business',
      email: 'new@customer.com',
    })
  }

  const handleUpdateCustomer = (id: string) => {
    updateCustomer.mutate({
      id,
      data: { businessName: 'Updated Customer Name' },
    })
  }

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer.mutate(id)
  }

  if (isLoading) return <div>Loading customers...</div>
  if (error) return <div>Error loading customers</div>

  return (
    <div className='space-y-4 p-4'>
      <h2 className='text-xl font-bold'>Customer Query Examples</h2>

      {/* Create Customer */}
      <div>
        <button
          onClick={handleCreateCustomer}
          disabled={createCustomer.isPending}
          className='rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'
        >
          {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
        </button>
      </div>

      {/* Customer List */}
      <div>
        <h3 className='mb-2 text-lg font-semibold'>
          Customers ({customers?.totalItems || 0})
        </h3>
        <div className='space-y-2'>
          {customers?.data?.map((customer) => (
            <div key={customer.id} className='rounded border p-3'>
              <h4 className='font-medium'>{customer.businessName}</h4>
              <p className='text-sm text-gray-600'>{customer.email}</p>
              <div className='mt-2 flex space-x-2'>
                <button
                  onClick={() => handleUpdateCustomer(customer.id)}
                  className='rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600'
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className='rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
