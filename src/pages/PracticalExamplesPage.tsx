import { useState } from 'react'
import {
  Zap,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  Users,
  FileText,
  BarChart3,
} from 'lucide-react'

const PracticalExamplesPage = () => {
  const [selectedExample, setSelectedExample] = useState<string>(
    'customer-management'
  )
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  )

  const sections = [
    {
      id: 'customer-management',
      title: 'Customer Management',
      description: 'Complete CRUD interface for customer management',
      difficulty: 'Intermediate',
    },
    {
      id: 'form-wizards',
      title: 'Form Wizards',
      description: 'Multi-step forms with validation and progress tracking',
      difficulty: 'Intermediate',
    },
    {
      id: 'dashboard-ui',
      title: 'Dashboard Components',
      description: 'Interactive dashboard with charts and metrics',
      difficulty: 'Advanced',
    },
    {
      id: 'advanced-filtering',
      title: 'Advanced Filtering',
      description: 'Complex filtering with facets and search operators',
      difficulty: 'Advanced',
    },
  ]

  const markAsCompleted = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]))
  }

  const renderCustomerManagementExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Complete Customer Management System
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Customer Management Hook
export function useCustomerManagement() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Queries
  const customersQuery = useCustomerQuery({
    page: 1,
    limit: 10,
    status: 'active'
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCustomer,
    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({ queryKey: ['customers'] });
      
      const previousCustomers = queryClient.getQueryData(['customers']);
      
      // Optimistic update
      queryClient.setQueryData(['customers'], (old: any) => ({
        ...old,
        data: [{ ...newCustomer, id: 'temp-' + Date.now() }, ...old.data],
        totalItems: old.totalItems + 1
      }));

      return { previousCustomers };
    },
    onError: (err, newCustomer, context) => {
      queryClient.setQueryData(['customers'], context?.previousCustomers);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    },
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      navigate(\`/customers/\${customer.id}\`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Customer> }) => 
      updateCustomer(id, data),
    onSuccess: (updatedCustomer) => {
      // Update customer in all relevant queries
      queryClient.setQueryData(['customer', updatedCustomer.id], updatedCustomer);
      
      queryClient.setQueriesData(['customers'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((customer: Customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          ),
        };
      });

      toast({
        title: "Success", 
        description: "Customer updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(['customers'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((customer: Customer) => customer.id !== deletedId),
          totalItems: old.totalItems - 1,
        };
      });

      queryClient.removeQueries({ queryKey: ['customer', deletedId] });
      
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    },
  });

  return {
    customers: customersQuery,
    createCustomer: createMutation,
    updateCustomer: updateMutation,
    deleteCustomer: deleteMutation,
  };
}

// Customer List Component
export function CustomerList() {
  const { customers, deleteCustomer } = useCustomerManagement();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const handleBulkDelete = () => {
    if (confirm(\`Delete \${selectedCustomers.length} customers?\`)) {
      selectedCustomers.forEach(id => deleteCustomer.mutate(id));
      setSelectedCustomers([]);
    }
  };

  if (customers.isLoading) return <CustomerListSkeleton />;
  if (customers.error) return <ErrorMessage error={customers.error} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customers</h2>
        <div className="flex gap-2">
          {selectedCustomers.length > 0 && (
            <Button onClick={handleBulkDelete} variant="destructive">
              Delete Selected ({selectedCustomers.length})
            </Button>
          )}
          <CustomerCreateDialog />
        </div>
      </div>

      <CustomerTable
        data={customers.data?.data || []}
        selectedRows={selectedCustomers}
        onSelectionChange={setSelectedCustomers}
      />
    </div>
  );
}`}
        </pre>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            <h4 className='font-semibold'>Customer List</h4>
          </div>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span>Total Customers:</span>
              <span className='font-medium'>1,234</span>
            </div>
            <div className='flex justify-between'>
              <span>Active:</span>
              <span className='font-medium text-green-600'>1,156</span>
            </div>
            <div className='flex justify-between'>
              <span>Inactive:</span>
              <span className='font-medium text-gray-500'>78</span>
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <h4 className='mb-3 font-semibold'>Recent Actions</h4>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span>Customer created</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-blue-500'></div>
              <span>Customer updated</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-red-500'></div>
              <span>Customer deleted</span>
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-lg bg-blue-50 p-4'>
        <h4 className='mb-2 font-semibold text-blue-900'>
          CRUD Best Practices:
        </h4>
        <ul className='space-y-1 text-sm text-blue-800'>
          <li>• Optimistic updates for better UX</li>
          <li>• Proper error handling and rollback</li>
          <li>• Cache invalidation strategies</li>
          <li>• Bulk operations for efficiency</li>
        </ul>
      </div>
    </div>
  )

  const renderFormWizardsExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Multi-Step Form Wizard</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Form Wizard Hook
export function useFormWizard<T extends Record<string, any>>(
  steps: Array<{
    id: string;
    title: string;
    schema: z.ZodSchema<any>;
  }>,
  initialData?: Partial<T>
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepConfig = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const form = useForm({
    resolver: zodResolver(currentStepConfig.schema),
    defaultValues: formData,
    mode: 'onChange',
  });

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      form.reset(formData);
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const stepData = form.getValues();
      const updatedData = { ...formData, ...stepData };
      setFormData(updatedData);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      if (!isLastStep) {
        setCurrentStep(currentStep + 1);
        form.reset(updatedData);
      }
    }
  };

  const previousStep = () => {
    if (!isFirstStep) {
      const stepData = form.getValues();
      setFormData({ ...formData, ...stepData });
      setCurrentStep(currentStep - 1);
      form.reset(formData);
    }
  };

  const submitForm = async (onSubmit: (data: T) => Promise<void>) => {
    const isValid = await form.trigger();
    if (isValid) {
      const finalData = { ...formData, ...form.getValues() } as T;
      await onSubmit(finalData);
    }
  };

  return {
    form,
    currentStep,
    currentStepConfig,
    formData,
    completedSteps,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    previousStep,
    submitForm,
    progress: ((currentStep + 1) / steps.length) * 100,
  };
}

// Customer Onboarding Wizard
const customerSteps = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    schema: z.object({
      businessName: z.string().min(2),
      customerType: z.enum(['business', 'individual']),
      email: z.string().email(),
    }),
  },
  {
    id: 'contact-info',
    title: 'Contact Details',
    schema: z.object({
      phone: z.string().min(10),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
      }),
    }),
  },
  {
    id: 'preferences',
    title: 'Preferences',
    schema: z.object({
      preferredContact: z.enum(['email', 'phone', 'mail']),
      newsletter: z.boolean(),
      notifications: z.boolean(),
    }),
  },
];

export function CustomerOnboardingWizard() {
  const { mutate: createCustomer, isLoading } = useCreateCustomer();
  
  const wizard = useFormWizard(customerSteps);

  const handleSubmit = async (data: CustomerFormData) => {
    createCustomer(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {wizard.currentStep + 1} of {customerSteps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(wizard.progress)}% Complete
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full">
          <div 
            className="h-2 bg-primary rounded-full transition-all"
            style={{ width: \`\${wizard.progress}%\` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8">
        {customerSteps.map((step, index) => (
          <div
            key={step.id}
            className={\`flex items-center \${
              index !== customerSteps.length - 1 ? 'flex-1' : ''
            }\`}
          >
            <button
              onClick={() => wizard.goToStep(index)}
              disabled={!wizard.completedSteps.has(index) && index !== wizard.currentStep}
              className={\`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors \${
                wizard.completedSteps.has(index)
                  ? 'bg-primary border-primary text-primary-foreground'
                  : index === wizard.currentStep
                  ? 'border-primary text-primary'
                  : 'border-muted-foreground text-muted-foreground'
              }\`}
            >
              {wizard.completedSteps.has(index) ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </button>
            <span className="ml-2 text-sm font-medium">{step.title}</span>
            {index !== customerSteps.length - 1 && (
              <div className="flex-1 h-px bg-muted mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form className="space-y-6">
        {wizard.currentStep === 0 && <BasicInfoStep form={wizard.form} />}
        {wizard.currentStep === 1 && <ContactInfoStep form={wizard.form} />}
        {wizard.currentStep === 2 && <PreferencesStep form={wizard.form} />}
      </form>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={wizard.previousStep}
          disabled={wizard.isFirstStep}
          variant="outline"
        >
          Previous
        </Button>
        
        {wizard.isLastStep ? (
          <Button
            onClick={() => wizard.submitForm(handleSubmit)}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Customer'}
          </Button>
        ) : (
          <Button onClick={wizard.nextStep}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-green-50 p-4'>
        <h4 className='mb-2 font-semibold text-green-900'>
          Form Wizard Features:
        </h4>
        <ul className='space-y-1 text-sm text-green-800'>
          <li>• Progressive disclosure of form fields</li>
          <li>• Step-by-step validation</li>
          <li>• Progress tracking and navigation</li>
          <li>• Data persistence between steps</li>
        </ul>
      </div>
    </div>
  )

  const renderDashboardUIExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Interactive Dashboard</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Dashboard Metrics Hook
export function useDashboardMetrics(dateRange: DateRange) {
  const metricsQuery = useQuery({
    queryKey: ['dashboard-metrics', dateRange],
    queryFn: () => fetchDashboardMetrics(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const chartDataQuery = useQuery({
    queryKey: ['dashboard-charts', dateRange],
    queryFn: () => fetchChartData(dateRange),
    staleTime: 5 * 60 * 1000,
  });

  return {
    metrics: metricsQuery,
    charts: chartDataQuery,
    isLoading: metricsQuery.isLoading || chartDataQuery.isLoading,
  };
}

// Metric Card Component
export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  trend = 'up' 
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={\`text-sm \${trendColors[trend]}\`}>
              {change}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
export function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { metrics, charts, isLoading } = useDashboardMetrics(dateRange);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={\`$\${metrics.data?.totalRevenue.toLocaleString()}\`}
          change="+12.5% from last month"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Active Customers"
          value={metrics.data?.activeCustomers}
          change="+5.2% from last month"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Conversion Rate"
          value={\`\${metrics.data?.conversionRate}%\`}
          change="-2.1% from last month"
          icon={TrendingUp}
          trend="down"
        />
        <MetricCard
          title="Avg. Order Value"
          value={\`$\${metrics.data?.avgOrderValue}\`}
          change="+8.3% from last month"
          icon={ShoppingCart}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.data?.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Customer Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.data?.customerDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {charts.data?.customerDistribution.map((entry, index) => (
                  <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="p-6">
          <RecentActivityList />
        </div>
      </div>
    </div>
  );
}`}
        </pre>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <BarChart3 className='h-5 w-5 text-blue-500' />
            <h4 className='font-semibold'>Revenue</h4>
          </div>
          <div className='text-2xl font-bold'>$124,563</div>
          <div className='text-sm text-green-600'>+12.5% from last month</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <Users className='h-5 w-5 text-green-500' />
            <h4 className='font-semibold'>Customers</h4>
          </div>
          <div className='text-2xl font-bold'>1,234</div>
          <div className='text-sm text-green-600'>+5.2% from last month</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='mb-3 flex items-center gap-2'>
            <FileText className='h-5 w-5 text-purple-500' />
            <h4 className='font-semibold'>Orders</h4>
          </div>
          <div className='text-2xl font-bold'>856</div>
          <div className='text-sm text-red-600'>-2.1% from last month</div>
        </div>
      </div>

      <div className='rounded-lg bg-orange-50 p-4'>
        <h4 className='mb-2 font-semibold text-orange-900'>
          Dashboard Best Practices:
        </h4>
        <ul className='space-y-1 text-sm text-orange-800'>
          <li>• Real-time data updates with background refetching</li>
          <li>• Responsive charts and visualizations</li>
          <li>• Interactive date range selection</li>
          <li>• Performance optimization with data virtualization</li>
        </ul>
      </div>
    </div>
  )

  const renderAdvancedFilteringExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Advanced Filtering System
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Advanced Filter Hook
export function useAdvancedFilters<T>() {
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  const addFilter = (filter: FilterConfig) => {
    setFilters(prev => [...prev, { ...filter, id: generateId() }]);
  };

  const updateFilter = (id: string, updates: Partial<FilterConfig>) => {
    setFilters(prev => 
      prev.map(filter => 
        filter.id === id ? { ...filter, ...updates } : filter
      )
    );
  };

  const removeFilter = (id: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== id));
  };

  const clearAllFilters = () => {
    setFilters([]);
    setSearchQuery('');
  };

  const saveCurrentFilters = (name: string) => {
    const savedFilter: SavedFilter = {
      id: generateId(),
      name,
      filters,
      searchQuery,
      createdAt: new Date(),
    };
    setSavedFilters(prev => [...prev, savedFilter]);
  };

  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
    setSearchQuery(savedFilter.searchQuery);
  };

  const buildQueryParams = (): URLSearchParams => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }

    filters.forEach((filter, index) => {
      params.set(\`filter[\${index}][field]\`, filter.field);
      params.set(\`filter[\${index}][operator]\`, filter.operator);
      params.set(\`filter[\${index}][value]\`, filter.value);
    });

    return params;
  };

  return {
    filters,
    searchQuery,
    savedFilters,
    addFilter,
    updateFilter,
    removeFilter,
    clearAllFilters,
    setSearchQuery,
    saveCurrentFilters,
    loadSavedFilter,
    buildQueryParams,
    hasActiveFilters: filters.length > 0 || searchQuery.length > 0,
  };
}

// Filter Builder Component
export function FilterBuilder({ onFiltersChange }: {
  onFiltersChange: (params: URLSearchParams) => void;
}) {
  const {
    filters,
    searchQuery,
    savedFilters,
    addFilter,
    updateFilter,
    removeFilter,
    clearAllFilters,
    setSearchQuery,
    saveCurrentFilters,
    loadSavedFilter,
    buildQueryParams,
    hasActiveFilters,
  } = useAdvancedFilters();

  useEffect(() => {
    onFiltersChange(buildQueryParams());
  }, [filters, searchQuery]);

  const fieldOptions = [
    { value: 'businessName', label: 'Business Name', type: 'text' },
    { value: 'customerType', label: 'Customer Type', type: 'select', options: ['business', 'individual'] },
    { value: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    { value: 'createdAt', label: 'Created Date', type: 'date' },
    { value: 'revenue', label: 'Revenue', type: 'number' },
  ];

  const operatorOptions = {
    text: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
    ],
    select: [
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not equals' },
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'Greater than' },
      { value: 'lessThan', label: 'Less than' },
      { value: 'between', label: 'Between' },
    ],
    date: [
      { value: 'equals', label: 'On' },
      { value: 'before', label: 'Before' },
      { value: 'after', label: 'After' },
      { value: 'between', label: 'Between' },
    ],
  };

  return (
    <div className="space-y-4">
      {/* Global Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search across all fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button onClick={clearAllFilters} variant="outline">
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Active Filters:</div>
          {filters.map((filter) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              fieldOptions={fieldOptions}
              operatorOptions={operatorOptions}
              onUpdate={(updates) => updateFilter(filter.id, updates)}
              onRemove={() => removeFilter(filter.id)}
            />
          ))}
        </div>
      )}

      {/* Add Filter */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => addFilter({
            field: 'businessName',
            operator: 'contains',
            value: '',
          })}
          variant="outline"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Filter
        </Button>

        {hasActiveFilters && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-2">
                <Input
                  placeholder="Filter name..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveCurrentFilters(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {savedFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Saved Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {savedFilters.map((savedFilter) => (
                <DropdownMenuItem
                  key={savedFilter.id}
                  onClick={() => loadSavedFilter(savedFilter)}
                >
                  {savedFilter.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-red-50 p-4'>
        <h4 className='mb-2 font-semibold text-red-900'>
          Advanced Filter Features:
        </h4>
        <ul className='space-y-1 text-sm text-red-800'>
          <li>• Dynamic filter builder with multiple conditions</li>
          <li>• Save and reuse filter combinations</li>
          <li>• Global search across all fields</li>
          <li>• Type-aware operators and validation</li>
        </ul>
      </div>
    </div>
  )

  const renderExampleContent = () => {
    switch (selectedExample) {
      case 'customer-management':
        return renderCustomerManagementExample()
      case 'form-wizards':
        return renderFormWizardsExample()
      case 'dashboard-ui':
        return renderDashboardUIExample()
      case 'advanced-filtering':
        return renderAdvancedFilteringExample()
      default:
        return renderCustomerManagementExample()
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600'>
          <Zap className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>Practical Examples</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Real-world implementations combining React, TypeScript, TanStack
          Query, and TanStack Table to build complete features found in BizFix
          CRM.
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

export default PracticalExamplesPage
