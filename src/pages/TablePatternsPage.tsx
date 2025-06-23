import { useState } from 'react'
import { Table, ChevronRight, CheckCircle, PlayCircle } from 'lucide-react'

const TablePatternsPage = () => {
  const [selectedExample, setSelectedExample] =
    useState<string>('column-definitions')
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  )

  const sections = [
    {
      id: 'column-definitions',
      title: 'Column Definitions',
      description:
        'Learn to create type-safe column definitions with cell renderers',
      difficulty: 'Beginner',
    },
    {
      id: 'sorting-filtering',
      title: 'Sorting & Filtering',
      description:
        'Implement server-side and client-side sorting and filtering',
      difficulty: 'Intermediate',
    },
    {
      id: 'row-selection',
      title: 'Row Selection',
      description: 'Handle row selection and bulk actions',
      difficulty: 'Intermediate',
    },
    {
      id: 'virtualization',
      title: 'Virtualization',
      description: 'Optimize performance for large datasets',
      difficulty: 'Advanced',
    },
  ]

  const markAsCompleted = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]))
  }

  const renderColumnDefinitionsExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Column Definitions Pattern
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`import { ColumnDef } from "@tanstack/react-table";

export const customerColumns: ColumnDef<Customer>[] = [
  // Selection column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Data columns
  {
    accessorKey: "businessName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Business Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("businessName") as string;
      return <div className="font-medium">{value || "N/A"}</div>;
    },
  },

  // Custom cell with complex data
  {
    id: "primaryContact",
    header: "Primary Contact",
    cell: ({ row }) => {
      const customer = row.original;
      const contact = customer.contacts?.find(c => c.isPrimary);

      if (!contact) return <span className="text-muted">No contact</span>;

      return (
        <div>
          <div className="font-medium">{contact.fullname}</div>
          <div className="text-sm text-muted-foreground">{contact.phone}</div>
        </div>
      );
    },
  },

  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(customer.id)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(customer.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(customer.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];`}
        </pre>
      </div>

      <div className='rounded-lg bg-blue-50 p-4'>
        <h4 className='mb-2 font-semibold text-blue-900'>Column Types:</h4>
        <ul className='space-y-1 text-sm text-blue-800'>
          <li>
            • <strong>accessorKey:</strong> Simple data access from object keys
          </li>
          <li>
            • <strong>accessorFn:</strong> Custom function to access complex
            data
          </li>
          <li>
            • <strong>display:</strong> UI-only columns (selection, actions)
          </li>
          <li>
            • <strong>grouping:</strong> Columns that can be grouped
          </li>
        </ul>
      </div>
    </div>
  )

  const renderSortingFilteringExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Sorting & Filtering</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Table Hook with Sorting & Filtering
export function useCustomerTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Build API parameters from table state
  const searchParams = useMemo(() => {
    return buildCustomerSearchParams({
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    });
  }, [sorting, columnFilters, globalFilter, pagination]);

  // Server-side data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["customers", searchParams.toString()],
    queryFn: () => fetchCustomers(searchParams),
    keepPreviousData: true,
  });

  const table = useReactTable({
    data: data?.data || [],
    columns: customerColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    
    // Server-side operations
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    
    getCoreRowModel: getCoreRowModel(),
  });

  return { table, isLoading };
}

// Column Filter Component
export function DataTableColumnHeader<T>({ column, title }: {
  column: Column<T>;
  title: string;
}) {
  if (!column.getCanSort()) {
    return <div>{title}</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-green-50 p-4'>
        <h4 className='mb-2 font-semibold text-green-900'>
          Filtering Strategies:
        </h4>
        <ul className='space-y-1 text-sm text-green-800'>
          <li>
            • <strong>Global Filter:</strong> Search across all columns
          </li>
          <li>
            • <strong>Column Filters:</strong> Filter specific columns
          </li>
          <li>
            • <strong>Custom Filter Functions:</strong> Advanced filtering logic
          </li>
          <li>
            • <strong>Server-side:</strong> Let backend handle large datasets
          </li>
        </ul>
      </div>
    </div>
  )

  const renderRowSelectionExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Row Selection & Bulk Actions
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`// Row Selection Hook
export function useRowSelection<T>() {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    // ... other config
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedData = selectedRows.map(row => row.original);

  return {
    table,
    selectedRows,
    selectedData,
    hasSelection: selectedRows.length > 0,
    selectionCount: selectedRows.length,
  };
}

// Bulk Actions Component
export function BulkActionsToolbar<T>({ 
  selectedData, 
  onClearSelection 
}: {
  selectedData: T[];
  onClearSelection: () => void;
}) {
  const { mutate: bulkDelete } = useBulkDeleteMutation();
  const { mutate: bulkUpdate } = useBulkUpdateMutation();

  const handleBulkDelete = () => {
    if (confirm(\`Delete \${selectedData.length} items?\`)) {
      bulkDelete(selectedData.map(item => item.id));
      onClearSelection();
    }
  };

  const handleBulkStatusUpdate = (status: string) => {
    bulkUpdate({
      ids: selectedData.map(item => item.id),
      updates: { status }
    });
    onClearSelection();
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">
        {selectedData.length} selected
      </span>
      
      <Button onClick={handleBulkDelete} variant="destructive" size="sm">
        Delete Selected
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Update Status <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleBulkStatusUpdate("active")}>
            Mark as Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkStatusUpdate("inactive")}>
            Mark as Inactive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button onClick={onClearSelection} variant="ghost" size="sm">
        Clear Selection
      </Button>
    </div>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-purple-50 p-4'>
        <h4 className='mb-2 font-semibold text-purple-900'>
          Selection Patterns:
        </h4>
        <ul className='space-y-1 text-sm text-purple-800'>
          <li>
            • <strong>Single Selection:</strong> Radio button behavior
          </li>
          <li>
            • <strong>Multiple Selection:</strong> Checkbox behavior
          </li>
          <li>
            • <strong>Range Selection:</strong> Shift+click selection
          </li>
          <li>
            • <strong>Conditional Selection:</strong> Disable based on criteria
          </li>
        </ul>
      </div>
    </div>
  )

  const renderVirtualizationExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Virtualization with TanStack Virtual
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`import { useVirtualizer } from "@tanstack/react-virtual";

// Virtualized Table Component
export function VirtualizedTable<T>({ 
  data, 
  columns 
}: {
  data: T[];
  columns: ColumnDef<T>[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtual row setup
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Row height
    overscan: 10, // Render extra rows for smooth scrolling
  });

  return (
    <div className="h-[400px] overflow-auto" ref={parentRef}>
      <div
        style={{
          height: \`\${virtualizer.getTotalSize()}px\`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={row.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: \`\${virtualRow.size}px\`,
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
            >
              <div className="flex border-b">
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="px-4 py-2 flex-1"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Infinite Query with Virtualization
export function useInfiniteCustomers() {
  return useInfiniteQuery({
    queryKey: ["customers", "infinite"],
    queryFn: ({ pageParam = 0 }) => 
      fetchCustomers({ page: pageParam, limit: 50 }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
  });
}

export function InfiniteVirtualTable() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useInfiniteCustomers();

  const allRows = data?.pages.flatMap(page => page.data) ?? [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...items].reverse();
    
    if (!lastItem) return;
    
    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, allRows.length, isFetchingNextPage, items]);

  return (
    <div className="h-[600px] overflow-auto" ref={parentRef}>
      {/* Virtualized rows */}
    </div>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-orange-50 p-4'>
        <h4 className='mb-2 font-semibold text-orange-900'>
          Virtualization Benefits:
        </h4>
        <ul className='space-y-1 text-sm text-orange-800'>
          <li>
            • <strong>Performance:</strong> Only render visible rows
          </li>
          <li>
            • <strong>Memory:</strong> Constant memory usage regardless of data
            size
          </li>
          <li>
            • <strong>Smooth Scrolling:</strong> Consistent scroll performance
          </li>
          <li>
            • <strong>Infinite Loading:</strong> Load data as user scrolls
          </li>
        </ul>
      </div>
    </div>
  )

  const renderExampleContent = () => {
    switch (selectedExample) {
      case 'column-definitions':
        return renderColumnDefinitionsExample()
      case 'sorting-filtering':
        return renderSortingFilteringExample()
      case 'row-selection':
        return renderRowSelectionExample()
      case 'virtualization':
        return renderVirtualizationExample()
      default:
        return renderColumnDefinitionsExample()
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600'>
          <Table className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>Table Patterns</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Build sophisticated data tables with TanStack Table. Learn column
          definitions, sorting, filtering, row selection, and performance
          optimization techniques.
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

export default TablePatternsPage
