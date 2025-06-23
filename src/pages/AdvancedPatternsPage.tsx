import { useState } from 'react'
import { Lightbulb, ChevronRight, CheckCircle, PlayCircle } from 'lucide-react'

const AdvancedPatternsPage = () => {
  const [selectedExample, setSelectedExample] = useState<string>(
    'compound-components'
  )
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  )

  const sections = [
    {
      id: 'compound-components',
      title: 'Compound Components',
      description:
        'Build flexible component APIs with compound component patterns',
      difficulty: 'Advanced',
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      description:
        'Advanced memoization, virtualization, and optimization techniques',
      difficulty: 'Advanced',
    },
    {
      id: 'testing-strategies',
      title: 'Testing Strategies',
      description:
        'Comprehensive testing patterns for React components and hooks',
      difficulty: 'Expert',
    },
    {
      id: 'accessibility',
      title: 'Accessibility Patterns',
      description: 'Building inclusive and accessible user interfaces',
      difficulty: 'Advanced',
    },
  ]

  const markAsCompleted = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]))
  }

  const renderCompoundComponentsExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Compound Component Pattern
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Compound Component with Context
interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown');
  }
  return context;
};

// Main Compound Component
export function Dropdown({ 
  children, 
  onValueChange,
  defaultValue 
}: {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(defaultValue || null);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  
  const onSelect = (value: string) => {
    setSelectedValue(value);
    onValueChange?.(value);
    close();
  };

  const contextValue: DropdownContextValue = {
    isOpen,
    toggle,
    close,
    selectedValue,
    onSelect,
  };

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

// Compound Component Parts
Dropdown.Trigger = function DropdownTrigger({ 
  children, 
  asChild = false 
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const { toggle, isOpen } = useDropdownContext();

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: toggle,
      'aria-expanded': isOpen,
      'aria-haspopup': true,
    });
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
      aria-expanded={isOpen}
      aria-haspopup={true}
    >
      {children}
      <ChevronDown className={\`ml-2 h-4 w-4 transition-transform \${
        isOpen ? 'rotate-180' : ''
      }\`} />
    </button>
  );
};

Dropdown.Content = function DropdownContent({ 
  children 
}: {
  children: React.ReactNode;
}) {
  const { isOpen, close } = useDropdownContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className="absolute top-full left-0 z-50 mt-1 min-w-full rounded-md border bg-popover p-1 shadow-lg"
    >
      {children}
    </div>
  );
};

Dropdown.Item = function DropdownItem({ 
  children, 
  value,
  onSelect: onSelectProp 
}: {
  children: React.ReactNode;
  value: string;
  onSelect?: (value: string) => void;
}) {
  const { onSelect: contextOnSelect, selectedValue } = useDropdownContext();
  const isSelected = selectedValue === value;

  const handleSelect = () => {
    onSelectProp?.(value);
    contextOnSelect(value);
  };

  return (
    <button
      onClick={handleSelect}
      className={\`w-full rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent \${
        isSelected ? 'bg-accent font-medium' : ''
      }\`}
    >
      {children}
    </button>
  );
};

// Usage
function CustomerStatusDropdown() {
  return (
    <Dropdown onValueChange={(value) => console.log('Selected:', value)}>
      <Dropdown.Trigger>
        Select Status
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="active">Active</Dropdown.Item>
        <Dropdown.Item value="inactive">Inactive</Dropdown.Item>
        <Dropdown.Item value="pending">Pending</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-blue-50 p-4'>
        <h4 className='mb-2 font-semibold text-blue-900'>
          Compound Component Benefits:
        </h4>
        <ul className='space-y-1 text-sm text-blue-800'>
          <li>
            • <strong>Flexible API:</strong> Consumers control component
            structure
          </li>
          <li>
            • <strong>Separation of Concerns:</strong> Each part has a single
            responsibility
          </li>
          <li>
            • <strong>Implicit State Sharing:</strong> Context handles state
            communication
          </li>
          <li>
            • <strong>Composability:</strong> Mix and match parts as needed
          </li>
        </ul>
      </div>
    </div>
  )

  const renderPerformanceOptimizationExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Performance Optimization Patterns
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// 1. Memoization Strategies
const CustomerListItem = memo(function CustomerListItem({ 
  customer,
  onEdit,
  onDelete 
}: {
  customer: Customer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  // Memoize callbacks to prevent unnecessary re-renders
  const handleEdit = useCallback(() => onEdit(customer.id), [onEdit, customer.id]);
  const handleDelete = useCallback(() => onDelete(customer.id), [onDelete, customer.id]);

  return (
    <div className="border rounded p-4">
      <h3>{customer.businessName}</h3>
      <p>{customer.email}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
});

// 2. Expensive Computation Memoization
function CustomerAnalytics({ customers }: { customers: Customer[] }) {
  const analytics = useMemo(() => {
    console.log('Computing analytics...'); // Only runs when customers change
    
    return {
      totalRevenue: customers.reduce((sum, customer) => sum + customer.revenue, 0),
      averageRevenue: customers.length > 0 
        ? customers.reduce((sum, customer) => sum + customer.revenue, 0) / customers.length 
        : 0,
      topCustomers: customers
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      revenueByType: customers.reduce((acc, customer) => {
        acc[customer.customerType] = (acc[customer.customerType] || 0) + customer.revenue;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [customers]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>Total Revenue: \${analytics.totalRevenue.toLocaleString()}</div>
      <div>Average Revenue: \${analytics.averageRevenue.toFixed(2)}</div>
      <div>Customer Count: {analytics.topCustomers.length}</div>
    </div>
  );
}

// 3. Virtual Scrolling for Large Lists
function VirtualizedCustomerList({ customers }: { customers: Customer[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: customers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  return (
    <div 
      ref={parentRef}
      className="h-96 overflow-auto"
    >
      <div
        style={{
          height: \`\${virtualizer.getTotalSize()}px\`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const customer = customers[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: \`\${virtualItem.size}px\`,
                transform: \`translateY(\${virtualItem.start}px)\`,
              }}
            >
              <CustomerListItem 
                customer={customer}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Debounced Search Hook
function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function CustomerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounced(searchTerm, 500);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['customers', 'search', debouncedSearchTerm],
    queryFn: () => searchCustomers(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
    staleTime: 30000, // 30 seconds
  });

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search customers..."
        className="w-full p-2 border rounded"
      />
      {isLoading && <div>Searching...</div>}
      {searchResults && (
        <div className="mt-4">
          {searchResults.map(customer => (
            <CustomerListItem key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}

// 5. Code Splitting with Lazy Loading
const CustomerDetail = lazy(() => 
  import('../components/CustomerDetail').then(module => ({
    default: module.CustomerDetail
  }))
);

const CustomerReports = lazy(() => import('../components/CustomerReports'));

function CustomerApp() {
  return (
    <Router>
      <Routes>
        <Route path="/customers" element={<CustomerList />} />
        <Route 
          path="/customers/:id" 
          element={
            <Suspense fallback={<CustomerDetailSkeleton />}>
              <CustomerDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <Suspense fallback={<div>Loading reports...</div>}>
              <CustomerReports />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-green-50 p-4'>
        <h4 className='mb-2 font-semibold text-green-900'>
          Performance Optimization Techniques:
        </h4>
        <ul className='space-y-1 text-sm text-green-800'>
          <li>
            • <strong>React.memo:</strong> Prevent unnecessary component
            re-renders
          </li>
          <li>
            • <strong>useMemo:</strong> Cache expensive computations
          </li>
          <li>
            • <strong>useCallback:</strong> Stabilize function references
          </li>
          <li>
            • <strong>Virtualization:</strong> Handle large datasets efficiently
          </li>
          <li>
            • <strong>Code Splitting:</strong> Load components on demand
          </li>
        </ul>
      </div>
    </div>
  )

  const renderTestingStrategiesExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Comprehensive Testing Strategies
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// 1. Component Testing with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerForm } from '../CustomerForm';

// Test Utilities
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('CustomerForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    
    renderWithProviders(
      <CustomerForm onSubmit={mockOnSubmit} />
    );

    // Fill form fields
    await user.type(screen.getByLabelText(/business name/i), 'Acme Corp');
    await user.type(screen.getByLabelText(/email/i), 'contact@acme.com');
    await user.selectOptions(screen.getByLabelText(/customer type/i), 'business');

    // Submit form
    await user.click(screen.getByRole('button', { name: /create customer/i }));

    // Verify submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        businessName: 'Acme Corp',
        email: 'contact@acme.com',
        customerType: 'business',
      });
    });
  });

  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<CustomerForm onSubmit={jest.fn()} />);

    // Submit without filling required fields
    await user.click(screen.getByRole('button', { name: /create customer/i }));

    // Check for validation errors
    expect(await screen.findByText(/business name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });
});

// 2. Hook Testing
import { renderHook, waitFor } from '@testing-library/react';
import { useCustomerQuery } from '../hooks/useCustomerQuery';

describe('useCustomerQuery', () => {
  it('should fetch customers successfully', async () => {
    const mockCustomers = [
      { id: '1', businessName: 'Acme Corp', email: 'contact@acme.com' },
    ];

    // Mock API response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockCustomers }),
    } as Response);

    const { result } = renderHook(() => useCustomerQuery({ page: 1 }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ data: mockCustomers });
  });

  it('should handle error states', async () => {
    // Mock API error
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCustomerQuery({ page: 1 }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(expect.objectContaining({
      message: 'Network error',
    }));
  });
});

// 3. Integration Testing
describe('Customer Management Integration', () => {
  it('should complete full customer CRUD workflow', async () => {
    const user = userEvent.setup();
    
    // Setup mock server
    server.use(
      rest.get('/api/customers', (req, res, ctx) => {
        return res(ctx.json({ data: [] }));
      }),
      rest.post('/api/customers', (req, res, ctx) => {
        return res(ctx.json({ 
          id: '1', 
          businessName: 'Acme Corp',
          email: 'contact@acme.com' 
        }));
      })
    );

    renderWithProviders(<CustomerManagementPage />);

    // Create new customer
    await user.click(screen.getByRole('button', { name: /add customer/i }));
    await user.type(screen.getByLabelText(/business name/i), 'Acme Corp');
    await user.type(screen.getByLabelText(/email/i), 'contact@acme.com');
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Verify customer appears in list
    expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('contact@acme.com')).toBeInTheDocument();
  });
});

// 4. E2E Testing with Playwright
import { test, expect } from '@playwright/test';

test.describe('Customer Management', () => {
  test('should create and manage customers', async ({ page }) => {
    await page.goto('/customers');

    // Create new customer
    await page.click('[data-testid="add-customer-button"]');
    await page.fill('[data-testid="business-name-input"]', 'Test Corporation');
    await page.fill('[data-testid="email-input"]', 'test@corp.com');
    await page.selectOption('[data-testid="customer-type-select"]', 'business');
    await page.click('[data-testid="save-button"]');

    // Verify customer was created
    await expect(page.locator('text=Test Corporation')).toBeVisible();
    
    // Edit customer
    await page.click('[data-testid="customer-actions-button"]');
    await page.click('text=Edit');
    await page.fill('[data-testid="business-name-input"]', 'Updated Corporation');
    await page.click('[data-testid="save-button"]');

    // Verify update
    await expect(page.locator('text=Updated Corporation')).toBeVisible();
  });
});

// 5. Mock Service Worker Setup
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.get('/api/customers', (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '1';
    const limit = req.url.searchParams.get('limit') || '10';
    
    return res(
      ctx.json({
        data: mockCustomers.slice(
          (parseInt(page) - 1) * parseInt(limit),
          parseInt(page) * parseInt(limit)
        ),
        totalItems: mockCustomers.length,
        currentPage: parseInt(page),
      })
    );
  }),

  rest.post('/api/customers', async (req, res, ctx) => {
    const newCustomer = await req.json();
    const customer = {
      ...newCustomer,
      id: \`\${Date.now()}\`,
      createdAt: new Date().toISOString(),
    };
    
    mockCustomers.push(customer);
    return res(ctx.json(customer));
  }),

  rest.put('/api/customers/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    
    const customerIndex = mockCustomers.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Customer not found' }));
    }
    
    mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...updates };
    return res(ctx.json(mockCustomers[customerIndex]));
  })
);`}
        </pre>
      </div>

      <div className='rounded-lg bg-purple-50 p-4'>
        <h4 className='mb-2 font-semibold text-purple-900'>
          Testing Strategy Layers:
        </h4>
        <ul className='space-y-1 text-sm text-purple-800'>
          <li>
            • <strong>Unit Tests:</strong> Individual components and hooks
          </li>
          <li>
            • <strong>Integration Tests:</strong> Component interactions
          </li>
          <li>
            • <strong>E2E Tests:</strong> Full user workflows
          </li>
          <li>
            • <strong>Visual Tests:</strong> UI consistency and regression
          </li>
          <li>
            • <strong>Performance Tests:</strong> Load and stress testing
          </li>
        </ul>
      </div>
    </div>
  )

  const renderAccessibilityExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Accessibility Patterns</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// 1. Accessible Form Components
function FormField({ 
  label, 
  error, 
  required, 
  children,
  description 
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement;
  description?: string;
}) {
  const id = useId();
  const errorId = \`\${id}-error\`;
  const descriptionId = \`\${id}-description\`;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <div id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </div>
      )}
      
      {React.cloneElement(children, {
        id,
        'aria-invalid': !!error,
        'aria-describedby': [
          error ? errorId : null,
          description ? descriptionId : null,
        ].filter(Boolean).join(' ') || undefined,
      })}
      
      {error && (
        <div 
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}

// 2. Accessible Modal Dialog
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  initialFocus
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  initialFocus?: React.RefObject<HTMLElement>;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Trap focus within modal
  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus initial element or modal
      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else {
        modalRef.current?.focus();
      }
    } else {
      // Restore focus when modal closes
      previousActiveElement.current?.focus();
    }
  }, [isOpen, initialFocus]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// 3. Focus Trap Hook
function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  }, [isActive, ref]);
}

// 4. Accessible Data Table
function AccessibleTable<T>({ 
  data, 
  columns,
  caption,
  sortable = true 
}: {
  data: T[];
  columns: ColumnDef<T>[];
  caption?: string;
  sortable?: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div role="region" aria-label="Data table" tabIndex={0}>
      <table className="w-full border-collapse" role="table">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} role="row">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border p-2 text-left"
                  role="columnheader"
                  aria-sort={
                    sortable && header.column.getCanSort()
                      ? header.column.getIsSorted() === 'asc'
                        ? 'ascending'
                        : header.column.getIsSorted() === 'desc'
                        ? 'descending'
                        : 'none'
                      : undefined
                  }
                >
                  {sortable && header.column.getCanSort() ? (
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      className="flex items-center gap-2 hover:underline"
                      aria-label={\`Sort by \${header.column.id}\`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span aria-hidden="true">
                        {header.column.getIsSorted() === 'asc' ? '↑' : 
                         header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                      </span>
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} role="row">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border p-2"
                  role="gridcell"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 5. Screen Reader Announcements
function useAnnouncement() {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.textContent = message;
      announceRef.current.setAttribute('aria-live', priority);
      
      // Clear after announcement
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const AnnouncementRegion = () => (
    <div
      ref={announceRef}
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    />
  );

  return { announce, AnnouncementRegion };
}

// Usage in a form submission
function CustomerForm() {
  const { announce, AnnouncementRegion } = useAnnouncement();
  
  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await createCustomer(data);
      announce('Customer created successfully', 'polite');
    } catch (error) {
      announce('Error creating customer. Please try again.', 'assertive');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
      <AnnouncementRegion />
    </div>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-orange-50 p-4'>
        <h4 className='mb-2 font-semibold text-orange-900'>
          Accessibility Best Practices:
        </h4>
        <ul className='space-y-1 text-sm text-orange-800'>
          <li>
            • <strong>Semantic HTML:</strong> Use appropriate HTML elements and
            roles
          </li>
          <li>
            • <strong>Keyboard Navigation:</strong> Ensure all interactions work
            with keyboard
          </li>
          <li>
            • <strong>Screen Reader Support:</strong> Provide proper labels and
            announcements
          </li>
          <li>
            • <strong>Focus Management:</strong> Handle focus appropriately in
            dynamic content
          </li>
          <li>
            • <strong>Color Contrast:</strong> Ensure sufficient contrast ratios
          </li>
        </ul>
      </div>
    </div>
  )

  const renderExampleContent = () => {
    switch (selectedExample) {
      case 'compound-components':
        return renderCompoundComponentsExample()
      case 'performance-optimization':
        return renderPerformanceOptimizationExample()
      case 'testing-strategies':
        return renderTestingStrategiesExample()
      case 'accessibility':
        return renderAccessibilityExample()
      default:
        return renderCompoundComponentsExample()
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600'>
          <Lightbulb className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>Advanced Patterns</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Expert-level React patterns including compound components, performance
          optimization, testing strategies, and accessibility best practices for
          production applications.
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

export default AdvancedPatternsPage
