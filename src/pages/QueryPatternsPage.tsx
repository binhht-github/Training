import { useState } from 'react'
import {
  Database,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

// Mock data and types for examples
interface Customer {
  id: string
  businessName: string
  customerType: 'business' | 'individual'
  email: string
  phone: string
  status: 'active' | 'inactive'
}

// Note: PaginatedResponse<T> interface is shown in code examples below

const QueryPatternsPage = () => {
  const [selectedExample, setSelectedExample] =
    useState<string>('basic-queries')
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  )
  const [queryState, setQueryState] = useState<{
    isLoading: boolean
    error: string | null
    data: Customer[] | null
  }>({
    isLoading: false,
    error: null,
    data: null,
  })

  // Mock customers data
  const mockCustomers: Customer[] = [
    {
      id: '1',
      businessName: 'Tech Solutions Inc',
      customerType: 'business',
      email: 'contact@techsolutions.com',
      phone: '+1-555-0123',
      status: 'active',
    },
    {
      id: '2',
      businessName: 'John Smith',
      customerType: 'individual',
      email: 'john.smith@email.com',
      phone: '+1-555-0124',
      status: 'active',
    },
    {
      id: '3',
      businessName: 'Design Studio LLC',
      customerType: 'business',
      email: 'hello@designstudio.com',
      phone: '+1-555-0125',
      status: 'inactive',
    },
  ]

  const sections = [
    {
      id: 'basic-queries',
      title: 'Basic Queries',
      description: 'Learn fundamental query patterns with TanStack Query',
      difficulty: 'Beginner',
    },
    {
      id: 'mutations',
      title: 'Mutations & Updates',
      description: 'Handle data mutations and optimistic updates',
      difficulty: 'Intermediate',
    },
    {
      id: 'error-handling',
      title: 'Error Handling',
      description: 'Implement robust error handling and retry logic',
      difficulty: 'Intermediate',
    },
    {
      id: 'cache-management',
      title: 'Cache Management',
      description: 'Master cache invalidation and background refetching',
      difficulty: 'Advanced',
    },
  ]

  const markAsCompleted = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]))
  }

  // Mock API simulation
  const simulateApiCall = async (
    delay = 1000,
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

  const handleSimulateQuery = async (shouldError = false) => {
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

  const renderBasicQueriesExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Basic Query Pattern</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Custom Query Hook
export const useCustomerQuery = (params: CustomerParams) => {
  return useQueryAPIToken<PaginatedResponse<Customer>>(
    ["customers", params],
    \`v1/customer/customer/withQueryParam?\${buildSearchParams(params)}\`,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    }
  );
};

// Usage in Component
function CustomerList() {
  const { data, isLoading, error, refetch } = useCustomerQuery({
    page: 1,
    limit: 10,
    status: 'active'
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.data.map(customer => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  );
}`}
        </pre>
      </div>

      <div className='space-y-4'>
        <h4 className='font-semibold'>Interactive Example:</h4>
        <div className='rounded-lg border p-4'>
          <div className='mb-4 flex gap-2'>
            <button
              onClick={() => handleSimulateQuery(false)}
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
              onClick={() => handleSimulateQuery(true)}
              disabled={queryState.isLoading}
              className='inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50'
            >
              <AlertCircle className='h-4 w-4' />
              Simulate Error
            </button>
          </div>

          <div className='min-h-32'>
            {queryState.isLoading && (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <span className='ml-2 text-muted-foreground'>
                  Loading customers...
                </span>
              </div>
            )}

            {queryState.error && (
              <div className='rounded-lg bg-red-50 p-4'>
                <div className='flex items-center gap-2 text-red-800'>
                  <AlertCircle className='h-5 w-5' />
                  <span className='font-medium'>Error occurred</span>
                </div>
                <p className='mt-2 text-sm text-red-700'>{queryState.error}</p>
              </div>
            )}

            {queryState.data && (
              <div className='space-y-3'>
                <h5 className='font-medium'>
                  Customers ({queryState.data.length})
                </h5>
                <div className='grid gap-3'>
                  {queryState.data.map((customer) => (
                    <div key={customer.id} className='rounded border p-3'>
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
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
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

      <div className='rounded-lg bg-blue-50 p-4'>
        <h4 className='mb-2 font-semibold text-blue-900'>
          Key Query Concepts:
        </h4>
        <ul className='space-y-1 text-sm text-blue-800'>
          <li>
            • <strong>Query Keys:</strong> Unique identifiers for caching
          </li>
          <li>
            • <strong>Stale Time:</strong> How long data is considered fresh
          </li>
          <li>
            • <strong>Cache Time:</strong> How long unused data stays in cache
          </li>
          <li>
            • <strong>Background Refetch:</strong> Automatic data updates
          </li>
        </ul>
      </div>
    </div>
  )

  const renderMutationsExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Mutations Pattern</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Custom Mutation Hook
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutationAPIToken<Customer, CustomerFormData>(
    "v1/customer/customer",
    {
      onMutate: async (newCustomer) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ["customers"] });

        // Snapshot the previous value
        const previousCustomers = queryClient.getQueryData(["customers"]);

        // Optimistically update the cache
        queryClient.setQueryData<PaginatedResponse<Customer>>(
          ["customers"],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              data: [{ ...newCustomer, id: 'temp-id' }, ...old.data],
              totalItems: old.totalItems + 1,
            };
          }
        );

        return { previousCustomers };
      },
      onError: (err, newCustomer, context) => {
        // Rollback optimistic update
        queryClient.setQueryData(["customers"], context?.previousCustomers);
        
        toast({
          title: "Error",
          description: "Failed to create customer",
          variant: "destructive",
        });
      },
      onSuccess: (customer) => {
        toast({
          title: "Success", 
          description: "Customer created successfully",
        });
        
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        
        // Navigate to new customer
        navigate(\`/customers/\${customer.id}\`);
      },
    }
  );
};`}
        </pre>
      </div>

      <div className='rounded-lg bg-green-50 p-4'>
        <h4 className='mb-2 font-semibold text-green-900'>
          Mutation Lifecycle:
        </h4>
        <ul className='space-y-1 text-sm text-green-800'>
          <li>
            • <strong>onMutate:</strong> Run before mutation, for optimistic
            updates
          </li>
          <li>
            • <strong>onError:</strong> Handle errors and rollback if needed
          </li>
          <li>
            • <strong>onSuccess:</strong> Handle successful mutations
          </li>
          <li>
            • <strong>onSettled:</strong> Run after success or error
          </li>
        </ul>
      </div>
    </div>
  )

  const renderErrorHandlingExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Error Handling Pattern</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Global Error Handler
export const useQueryAPIToken = <TData = any,>(
  queryKey: string[],
  url: string,
  options?: UseQueryOptions<TData>
) => {
  const axiosInstance = useAxiosWithToken();

  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(url);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle different error types
          if (error.response?.status === 401) {
            // Redirect to login
            window.location.href = '/login';
          } else if (error.response?.status === 403) {
            throw new Error('You do not have permission to access this resource');
          } else if (error.response?.status >= 500) {
            throw new Error('Server error. Please try again later.');
          }
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (axios.isAxiosError(error) && error.response?.status && error.response.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// Component Error Handling
function CustomerList() {
  const { data, isLoading, error, refetch } = useCustomerQuery();

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <ErrorBoundary
        error={error}
        onRetry={refetch}
        fallback={
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
            <p className="mt-2 text-muted-foreground">{error.message}</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Try Again
            </button>
          </div>
        }
      />
    );
  }

  return <div>{/* Render data */}</div>;
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-red-50 p-4'>
        <h4 className='mb-2 font-semibold text-red-900'>
          Error Handling Best Practices:
        </h4>
        <ul className='space-y-1 text-sm text-red-800'>
          <li>• Handle different HTTP status codes appropriately</li>
          <li>• Implement exponential backoff for retries</li>
          <li>• Don't retry on client errors (4xx)</li>
          <li>• Provide meaningful error messages to users</li>
          <li>• Include retry mechanisms in error states</li>
        </ul>
      </div>
    </div>
  )

  const renderCacheManagementExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Cache Management</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Cache Invalidation Strategies
export const useCustomerMutations = () => {
  const queryClient = useQueryClient();

  const updateCustomer = useMutation({
    mutationFn: updateCustomerAPI,
    onSuccess: (updatedCustomer) => {
      // Update specific customer in cache
      queryClient.setQueryData(['customer', updatedCustomer.id], updatedCustomer);
      
      // Update customer in lists
      queryClient.setQueriesData<PaginatedResponse<Customer>>(
        { queryKey: ['customers'] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map(customer =>
              customer.id === updatedCustomer.id ? updatedCustomer : customer
            ),
          };
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['customer-statistics'] 
      });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: deleteCustomerAPI,
    onSuccess: (_, deletedId) => {
      // Remove from all customer lists
      queryClient.setQueriesData<PaginatedResponse<Customer>>(
        { queryKey: ['customers'] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter(customer => customer.id !== deletedId),
            totalItems: oldData.totalItems - 1,
          };
        }
      );

      // Remove individual customer cache
      queryClient.removeQueries({ queryKey: ['customer', deletedId] });
    },
  });

  return { updateCustomer, deleteCustomer };
};

// Background Refetching
export const useCustomerQuery = (params: CustomerParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => fetchCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchIntervalInBackground: false,
  });
};`}
        </pre>
      </div>

      <div className='rounded-lg bg-purple-50 p-4'>
        <h4 className='mb-2 font-semibold text-purple-900'>
          Cache Strategies:
        </h4>
        <ul className='space-y-1 text-sm text-purple-800'>
          <li>
            • <strong>setQueryData:</strong> Update cache directly
          </li>
          <li>
            • <strong>invalidateQueries:</strong> Mark data as stale
          </li>
          <li>
            • <strong>removeQueries:</strong> Remove from cache entirely
          </li>
          <li>
            • <strong>refetchQueries:</strong> Force immediate refetch
          </li>
          <li>
            • <strong>Background refetch:</strong> Keep data fresh automatically
          </li>
        </ul>
      </div>
    </div>
  )

  const renderExampleContent = () => {
    switch (selectedExample) {
      case 'basic-queries':
        return renderBasicQueriesExample()
      case 'mutations':
        return renderMutationsExample()
      case 'error-handling':
        return renderErrorHandlingExample()
      case 'cache-management':
        return renderCacheManagementExample()
      default:
        return renderBasicQueriesExample()
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600'>
          <Database className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>Query Patterns</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Master TanStack Query patterns for data fetching, caching, mutations,
          and state management in BizFix CRM applications.
        </p>
      </div>

      {/* Progress */}
      <div className='rounded-lg border bg-card p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Your Progress</h2>
          <span className='text-sm text-muted-foreground'>
            {completedSections.size} of {sections.length} completed
          </span>
        </div>
        <div className='mb-4 h-2 rounded-full bg-muted'>
          <div
            className='h-full rounded-full bg-primary transition-all'
            style={{
              width: `${(completedSections.size / sections.length) * 100}%`,
            }}
          />
        </div>
        <div className='grid gap-3 md:grid-cols-2'>
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors ${
                completedSections.has(section.id)
                  ? 'border-green-200 bg-green-50'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className='flex-shrink-0'>
                {completedSections.has(section.id) ? (
                  <CheckCircle className='h-5 w-5 text-green-600' />
                ) : (
                  <PlayCircle className='h-5 w-5 text-muted-foreground' />
                )}
              </div>
              <div className='flex-1'>
                <div className='flex items-center space-x-2'>
                  <span className='font-medium'>{section.title}</span>
                  <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                    {section.difficulty}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-4'>
        {/* Sidebar Navigation */}
        <div className='lg:col-span-1'>
          <nav className='space-y-2'>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedExample(section.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                  selectedExample === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <span className='font-medium'>{section.title}</span>
                <ChevronRight className='h-4 w-4' />
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-3'>
          <div className='rounded-lg border bg-card p-6'>
            {renderExampleContent()}

            <div className='mt-8 flex justify-between'>
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(
                    (s) => s.id === selectedExample
                  )
                  if (currentIndex > 0) {
                    setSelectedExample(sections[currentIndex - 1].id)
                  }
                }}
                disabled={
                  sections.findIndex((s) => s.id === selectedExample) === 0
                }
                className='rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50'
              >
                Previous
              </button>

              <button
                onClick={() => markAsCompleted(selectedExample)}
                disabled={completedSections.has(selectedExample)}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50'
              >
                {completedSections.has(selectedExample)
                  ? 'Completed'
                  : 'Mark as Complete'}
              </button>

              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(
                    (s) => s.id === selectedExample
                  )
                  if (currentIndex < sections.length - 1) {
                    setSelectedExample(sections[currentIndex + 1].id)
                  }
                }}
                disabled={
                  sections.findIndex((s) => s.id === selectedExample) ===
                  sections.length - 1
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

export default QueryPatternsPage
