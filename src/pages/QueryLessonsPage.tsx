import React, { useState } from 'react'
import {
  Database,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

interface Customer {
  id: string
  businessName: string
  email: string
  status: 'active' | 'inactive'
  revenue: number
}

const QueryLessonsPage = () => {
  const [selectedLesson, setSelectedLesson] = useState<string>('queries')
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  )
  const [queryState, setQueryState] = useState({
    isLoading: false,
    error: null as string | null,
    data: null as Customer[] | null,
  })

  const lessons = [
    {
      id: 'queries',
      title: 'Basic Queries',
      description: 'Learn query fundamentals and data fetching',
      difficulty: 'Beginner',
      duration: '45 min',
    },
    {
      id: 'mutations',
      title: 'Mutations',
      description: 'Handle data updates with optimistic updates',
      difficulty: 'Intermediate',
      duration: '50 min',
    },
    {
      id: 'cache',
      title: 'Cache Management',
      description: 'Advanced caching and invalidation strategies',
      difficulty: 'Advanced',
      duration: '40 min',
    },
  ]

  const mockCustomers: Customer[] = [
    {
      id: '1',
      businessName: 'Tech Solutions Inc',
      email: 'contact@tech.com',
      status: 'active',
      revenue: 150000,
    },
    {
      id: '2',
      businessName: 'Design Studio',
      email: 'hello@design.com',
      status: 'active',
      revenue: 85000,
    },
  ]

  const simulateApiCall = async (
    delay = 1500,
    shouldError = false
  ): Promise<Customer[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError) {
          reject(new Error('Failed to fetch customers'))
        } else {
          resolve(mockCustomers)
        }
      }, delay)
    })
  }

  const handleQueryDemo = async (shouldError = false) => {
    setQueryState({ isLoading: true, error: null, data: null })
    try {
      const data = await simulateApiCall(2000, shouldError)
      setQueryState({ isLoading: false, error: null, data })
    } catch (error) {
      setQueryState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      })
    }
  }

  const markAsCompleted = (lessonId: string) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]))
  }

  const renderQueriesLesson = () => (
    <div className='space-y-8'>
      <div className='rounded-lg bg-blue-50 p-6'>
        <h3 className='mb-4 text-xl font-bold text-blue-900'>
          Lesson 1: Basic Queries & Data Fetching
        </h3>
        <p className='text-blue-800'>
          Master the fundamentals of React Query for server state management and
          caching.
        </p>
      </div>

      <div className='space-y-6'>
        <h4 className='text-lg font-bold'>📚 Key Concepts</h4>

        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>1. Basic Query Setup</h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`// 1. Setup Query Client
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes  
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

// 2. Create API function
const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await fetch('/api/customers')
  if (!response.ok) {
    throw new Error('Failed to fetch customers')
  }
  return response.json()
}

// 3. Use in component
function CustomerList() {
  const {
    data: customers,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />

  return (
    <div>
      <button onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? 'Refreshing...' : 'Refresh'}
      </button>
      {customers?.map(customer => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  )
}`}
          </pre>
        </div>

        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>2. Parameterized Queries</h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`// Query with parameters
interface CustomerFilters {
  status?: 'active' | 'inactive'
  page?: number
  search?: string
}

const fetchCustomers = async (filters: CustomerFilters) => {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.page) params.set('page', filters.page.toString())
  if (filters.search) params.set('search', filters.search)

  const response = await fetch(\`/api/customers?\${params}\`)
  return response.json()
}

// Custom hook
function useCustomerQuery(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ['customers', filters], // Include filters in key
    queryFn: () => fetchCustomers(filters),
    enabled: !!filters.status || filters.page !== undefined,
  })
}

// Usage with filters
function CustomerListWithFilters() {
  const [filters, setFilters] = useState<CustomerFilters>({
    status: 'active',
    page: 1
  })

  const { data, isLoading } = useCustomerQuery(filters)

  return (
    <div>
      <select 
        value={filters.status} 
        onChange={(e) => setFilters({...filters, status: e.target.value})}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {/* Render results */}
    </div>
  )
}`}
          </pre>
        </div>

        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>🎮 Interactive Demo</h5>
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <button
                onClick={() => handleQueryDemo(false)}
                disabled={queryState.isLoading}
                className='inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
              >
                {queryState.isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <RefreshCw className='h-4 w-4' />
                )}
                Fetch Data
              </button>
              <button
                onClick={() => handleQueryDemo(true)}
                disabled={queryState.isLoading}
                className='inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50'
              >
                <AlertCircle className='h-4 w-4' />
                Simulate Error
              </button>
            </div>

            <div className='min-h-32 rounded border bg-muted/50 p-4'>
              {queryState.isLoading && (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                  <span className='ml-2'>Loading customers...</span>
                </div>
              )}

              {queryState.error && (
                <div className='rounded bg-red-50 p-4'>
                  <div className='flex items-center gap-2 text-red-800'>
                    <AlertCircle className='h-5 w-5' />
                    <span className='font-medium'>Error occurred</span>
                  </div>
                  <p className='mt-2 text-sm text-red-700'>
                    {queryState.error}
                  </p>
                </div>
              )}

              {queryState.data && (
                <div className='space-y-3'>
                  <h6 className='font-medium'>
                    Customers ({queryState.data.length})
                  </h6>
                  <div className='grid gap-3'>
                    {queryState.data.map((customer) => (
                      <div
                        key={customer.id}
                        className='rounded border bg-card p-3'
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>
                              {customer.businessName}
                            </h6>
                            <p className='text-sm text-muted-foreground'>
                              {customer.email}
                            </p>
                          </div>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${
                              customer.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {customer.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-yellow-50 p-6'>
          <h5 className='mb-4 font-semibold text-yellow-900'>🏋️ Exercise 1</h5>
          <div className='space-y-3'>
            <p className='text-yellow-800'>
              <strong>Task:</strong> Create a ProductList component with search
              and category filtering.
            </p>
            <ul className='ml-4 space-y-1 text-sm text-yellow-800'>
              <li>• Set up useQuery hook for products</li>
              <li>• Add search input with debounced query</li>
              <li>• Implement category filter dropdown</li>
              <li>• Handle loading and error states</li>
              <li>• Add refresh functionality</li>
            </ul>
            <div className='mt-4 rounded bg-yellow-100 p-3'>
              <strong>Bonus:</strong> Add pagination and infinite loading
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMutationsLesson = () => (
    <div className='space-y-8'>
      <div className='rounded-lg bg-green-50 p-6'>
        <h3 className='mb-4 text-xl font-bold text-green-900'>
          Lesson 2: Mutations & Data Updates
        </h3>
        <p className='text-green-800'>
          Learn to handle data mutations with optimistic updates and cache
          synchronization.
        </p>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <h5 className='mb-4 font-semibold'>Basic Mutation Pattern</h5>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`import { useMutation, useQueryClient } from '@tanstack/react-query'

// API function
const createCustomer = async (customerData: CreateCustomerData): Promise<Customer> => {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData)
  })
  if (!response.ok) throw new Error('Failed to create customer')
  return response.json()
}

// Custom hook
function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onMutate: async (newCustomer) => {
      // Cancel queries to prevent conflicts
      await queryClient.cancelQueries({ queryKey: ['customers'] })

      // Snapshot previous data
      const previousCustomers = queryClient.getQueryData(['customers'])

      // Optimistically update cache
      queryClient.setQueryData(['customers'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: [{ ...newCustomer, id: 'temp-' + Date.now() }, ...old.data],
          totalItems: old.totalItems + 1
        }
      })

      return { previousCustomers }
    },
    onError: (err, newCustomer, context) => {
      // Rollback on error
      queryClient.setQueryData(['customers'], context?.previousCustomers)
      toast.error('Failed to create customer')
    },
    onSuccess: (customer) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer created successfully')
    },
  })
}

// Component usage
function CreateCustomerForm() {
  const createMutation = useCreateCustomer()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      await createMutation.mutateAsync({
        businessName: formData.get('businessName') as string,
        email: formData.get('email') as string,
        status: 'active'
      })
      // Reset form or redirect
    } catch (error) {
      // Error is handled in onError
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="businessName" placeholder="Business Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button 
        type="submit" 
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Create Customer'}
      </button>
    </form>
  )
}`}
        </pre>
      </div>
    </div>
  )

  const renderCacheLesson = () => (
    <div className='space-y-8'>
      <div className='rounded-lg bg-purple-50 p-6'>
        <h3 className='mb-4 text-xl font-bold text-purple-900'>
          Lesson 3: Cache Management
        </h3>
        <p className='text-purple-800'>
          Master advanced caching strategies, invalidation, and background
          synchronization.
        </p>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <h5 className='mb-4 font-semibold'>Cache Strategies</h5>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Cache invalidation strategies
const useCustomerMutations = () => {
  const queryClient = useQueryClient()

  const updateCustomer = useMutation({
    mutationFn: updateCustomerAPI,
    onSuccess: (updatedCustomer) => {
      // Strategy 1: Update specific cache entry
      queryClient.setQueryData(['customer', updatedCustomer.id], updatedCustomer)
      
      // Strategy 2: Update in list cache
      queryClient.setQueriesData(
        { queryKey: ['customers'] },
        (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.map((customer: Customer) =>
              customer.id === updatedCustomer.id ? updatedCustomer : customer
            ),
          }
        }
      )

      // Strategy 3: Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] })
    },
  })

  const deleteCustomer = useMutation({
    mutationFn: deleteCustomerAPI,
    onSuccess: (_, deletedId) => {
      // Remove from lists
      queryClient.setQueriesData(
        { queryKey: ['customers'] },
        (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.filter((customer: Customer) => customer.id !== deletedId),
            totalItems: oldData.totalItems - 1,
          }
        }
      )

      // Remove individual cache
      queryClient.removeQueries({ queryKey: ['customer', deletedId] })
    },
  })

  return { updateCustomer, deleteCustomer }
}`}
        </pre>
      </div>
    </div>
  )

  const renderLessonContent = () => {
    switch (selectedLesson) {
      case 'queries':
        return renderQueriesLesson()
      case 'mutations':
        return renderMutationsLesson()
      case 'cache':
        return renderCacheLesson()
      default:
        return renderQueriesLesson()
    }
  }

  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600'>
          <Database className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>React Query Lessons</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Master TanStack Query with detailed lessons, interactive examples, and
          hands-on exercises.
        </p>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Progress</h2>
          <span className='text-sm text-muted-foreground'>
            {completedLessons.size} of {lessons.length} completed
          </span>
        </div>
        <div className='mb-4 h-2 rounded-full bg-muted'>
          <div
            className='h-full rounded-full bg-gradient-to-r from-green-500 to-blue-600 transition-all'
            style={{
              width: `${(completedLessons.size / lessons.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-4'>
        <div className='lg:col-span-1'>
          <nav className='space-y-2'>
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson.id)}
                className={`w-full rounded-lg px-3 py-4 text-left transition-colors ${
                  selectedLesson === lesson.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className='flex items-center space-x-2'>
                  {completedLessons.has(lesson.id) ? (
                    <CheckCircle className='h-4 w-4 text-green-600' />
                  ) : (
                    <PlayCircle className='h-4 w-4' />
                  )}
                  <div>
                    <div className='font-medium'>{lesson.title}</div>
                    <div className='text-xs opacity-75'>{lesson.duration}</div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className='lg:col-span-3'>
          <div className='rounded-lg border bg-card p-6'>
            {renderLessonContent()}

            <div className='mt-8 flex justify-between'>
              <button
                onClick={() => {
                  const currentIndex = lessons.findIndex(
                    (l) => l.id === selectedLesson
                  )
                  if (currentIndex > 0) {
                    setSelectedLesson(lessons[currentIndex - 1].id)
                  }
                }}
                disabled={
                  lessons.findIndex((l) => l.id === selectedLesson) === 0
                }
                className='rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50'
              >
                Previous
              </button>

              <button
                onClick={() => markAsCompleted(selectedLesson)}
                disabled={completedLessons.has(selectedLesson)}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50'
              >
                {completedLessons.has(selectedLesson)
                  ? 'Completed ✓'
                  : 'Mark Complete'}
              </button>

              <button
                onClick={() => {
                  const currentIndex = lessons.findIndex(
                    (l) => l.id === selectedLesson
                  )
                  if (currentIndex < lessons.length - 1) {
                    setSelectedLesson(lessons[currentIndex + 1].id)
                  }
                }}
                disabled={
                  lessons.findIndex((l) => l.id === selectedLesson) ===
                  lessons.length - 1
                }
                className='rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueryLessonsPage
