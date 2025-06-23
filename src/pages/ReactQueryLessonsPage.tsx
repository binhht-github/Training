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

const ReactQueryLessonsPage = () => {
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
      title: 'Queries & Data Fetching',
      description: 'Master basic queries, caching, and background refetching',
      difficulty: 'Beginner',
      duration: '45 min',
    },
    {
      id: 'mutations',
      title: 'Mutations & Updates',
      description: 'Handle data mutations with optimistic updates',
      difficulty: 'Intermediate',
      duration: '50 min',
    },
    {
      id: 'cache',
      title: 'Cache Management',
      description: 'Advanced caching strategies and invalidation',
      difficulty: 'Advanced',
      duration: '40 min',
    },
    {
      id: 'error-handling',
      title: 'Error Handling & Retry',
      description: 'Robust error handling and retry mechanisms',
      difficulty: 'Intermediate',
      duration: '35 min',
    },
    {
      id: 'advanced',
      title: 'Advanced Patterns',
      description: 'Infinite queries, parallel queries, and optimizations',
      difficulty: 'Advanced',
      duration: '60 min',
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
    {
      id: '3',
      businessName: 'Marketing Pro',
      email: 'info@marketing.com',
      status: 'inactive',
      revenue: 45000,
    },
  ]

  const simulateApiCall = async (
    delay = 1500,
    shouldError = false
  ): Promise<Customer[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError) {
          reject(new Error('Failed to fetch customers from server'))
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
      {/* Introduction */}
      <div className='rounded-lg bg-blue-50 p-6'>
        <h3 className='mb-4 text-xl font-bold text-blue-900'>
          Lesson 1: Queries & Data Fetching
        </h3>
        <p className='mb-4 text-blue-800'>
          Learn the fundamentals of React Query for server state management,
          caching, and background synchronization.
        </p>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='text-sm'>
            <strong>Duration:</strong> 45 minutes
          </div>
          <div className='text-sm'>
            <strong>Difficulty:</strong> Beginner
          </div>
          <div className='text-sm'>
            <strong>Exercises:</strong> 4 hands-on tasks
          </div>
        </div>
      </div>

      {/* Core Concepts */}
      <div className='space-y-6'>
        <h4 className='text-lg font-bold'>📚 Core Concepts</h4>

        {/* Concept 1: Basic Query */}
        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>1. Basic Query Setup</h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`// 1. Query Client Setup (usually in main.tsx or App.tsx)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppComponents />
    </QueryClientProvider>
  )
}

// 2. Basic Query Hook
import { useQuery } from '@tanstack/react-query'

interface Customer {
  id: string;
  businessName: string;
  email: string;
  status: 'active' | 'inactive';
}

// API function
const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await fetch('/api/customers')
  if (!response.ok) {
    throw new Error('Failed to fetch customers')
  }
  return response.json()
}

// Component using the query
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading customers...</span>
    </div>
  }

  if (error) {
    return <div className="text-red-600 p-4">
      Error: {error.message}
      <button onClick={() => refetch()} className="ml-2 underline">
        Try Again
      </button>
    </div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>Customers ({customers?.length || 0})</h2>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded"
        >
          <RefreshCw className={\`h-4 w-4 \${isFetching ? 'animate-spin' : ''}\`} />
          Refresh
        </button>
      </div>
      
      {customers?.map(customer => (
        <div key={customer.id} className="border rounded p-4">
          <h3 className="font-semibold">{customer.businessName}</h3>
          <p className="text-gray-600">{customer.email}</p>
          <span className={\`px-2 py-1 rounded text-xs \${
            customer.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }\`}>
            {customer.status}
          </span>
        </div>
      ))}
    </div>
  )
}`}
          </pre>
        </div>

        {/* Concept 2: Query with Parameters */}
        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>2. Parameterized Queries</h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`// API function with parameters
interface CustomerFilters {
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  search?: string;
}

const fetchCustomers = async (filters: CustomerFilters): Promise<{
  data: Customer[];
  totalItems: number;
  currentPage: number;
}> => {
  const params = new URLSearchParams()
  
  if (filters.status) params.set('status', filters.status)
  if (filters.page) params.set('page', filters.page.toString())
  if (filters.limit) params.set('limit', filters.limit.toString())
  if (filters.search) params.set('search', filters.search)

  const response = await fetch(\`/api/customers?\${params}\`)
  if (!response.ok) throw new Error('Failed to fetch customers')
  return response.json()
}

// Custom hook for customer query
function useCustomerQuery(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ['customers', filters], // Key includes filters for caching
    queryFn: () => fetchCustomers(filters),
    staleTime: 5 * 60 * 1000,
    // Only fetch if we have meaningful filters or it's the initial load
    enabled: Object.keys(filters).length > 0 || !filters.search,
  })
}

// Component with filtering
function CustomerListWithFilters() {
  const [filters, setFilters] = useState<CustomerFilters>({
    status: 'active',
    page: 1,
    limit: 10
  })

  const { data, isLoading, error } = useCustomerQuery(filters)

  const handleFilterChange = (newFilters: Partial<CustomerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })) // Reset to page 1
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange({ 
            status: e.target.value as 'active' | 'inactive' | undefined 
          })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="text"
          placeholder="Search customers..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Results */}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <p>Showing {data.data.length} of {data.totalItems} customers</p>
          {/* Render customers */}
        </div>
      )}
    </div>
  )
}`}
          </pre>
        </div>

        {/* Interactive Demo */}
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
                Fetch Customers
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
                          <div className='text-right'>
                            <span
                              className={`rounded px-2 py-1 text-xs font-medium ${
                                customer.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {customer.status}
                            </span>
                            <p className='mt-1 text-sm font-medium'>
                              ${customer.revenue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exercise */}
        <div className='rounded-lg bg-yellow-50 p-6'>
          <h5 className='mb-4 font-semibold text-yellow-900'>
            🏋️ Practice Exercise
          </h5>
          <div className='space-y-3'>
            <p className='text-yellow-800'>
              <strong>Task:</strong> Create a ProductList component that fetches
              products with category filtering.
            </p>
            <ul className='ml-4 space-y-1 text-sm text-yellow-800'>
              <li>• Set up a query hook for fetching products</li>
              <li>• Add category filter parameter</li>
              <li>• Implement loading, error, and success states</li>
              <li>• Add a refresh button</li>
              <li>• Include proper TypeScript typing</li>
            </ul>
            <div className='mt-4 rounded bg-yellow-100 p-3'>
              <strong>Bonus:</strong> Add search functionality and pagination
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
          Lesson 2: Mutations & Updates
        </h3>
        <p className='text-green-800'>
          Learn to handle data mutations with optimistic updates, error
          handling, and cache synchronization.
        </p>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <h5 className='mb-4 font-semibold'>Basic Mutation Pattern</h5>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`import { useMutation, useQueryClient } from '@tanstack/react-query'

// API function
const createCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customers'] })

      // Snapshot previous value
      const previousCustomers = queryClient.getQueryData(['customers'])

      // Optimistically update the cache
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
    },
    onSuccess: (newCustomer) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      
      // Or update specific cache entry
      queryClient.setQueryData(['customer', newCustomer.id], newCustomer)
    },
  })
}

// Component usage
function CreateCustomerForm() {
  const createMutation = useCreateCustomer()

  const handleSubmit = async (formData: FormData) => {
    try {
      await createMutation.mutateAsync({
        businessName: formData.get('businessName') as string,
        email: formData.get('email') as string,
        status: 'active'
      })
      // Handle success (e.g., show toast, redirect)
    } catch (error) {
      // Handle error (e.g., show error message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
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

  const renderLessonContent = () => {
    switch (selectedLesson) {
      case 'queries':
        return renderQueriesLesson()
      case 'mutations':
        return renderMutationsLesson()
      // Add other lessons here
      default:
        return renderQueriesLesson()
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600'>
          <Database className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>React Query Mastery</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Master server state management with TanStack Query through
          comprehensive lessons, practical exercises, and real-world examples.
        </p>
      </div>

      {/* Progress */}
      <div className='rounded-lg border bg-card p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Learning Progress</h2>
          <span className='text-sm text-muted-foreground'>
            {completedLessons.size} of {lessons.length} lessons completed
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
        {/* Lesson Navigation */}
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
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      {completedLessons.has(lesson.id) ? (
                        <CheckCircle className='h-4 w-4 text-green-600' />
                      ) : (
                        <PlayCircle className='h-4 w-4' />
                      )}
                      <span className='font-medium'>{lesson.title}</span>
                    </div>
                    <p className='mt-1 text-xs opacity-75'>{lesson.duration}</p>
                  </div>
                  <ChevronRight className='h-4 w-4' />
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
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
                Previous Lesson
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
                Next Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReactQueryLessonsPage
