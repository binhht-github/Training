// Training: TanStack Table Implementation
// This demonstrates the table patterns used in BizFix CRM

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'

// Types
interface TCustomer {
  id: string
  businessName: string
  customerType: 'business' | 'individual'
  email?: string
  phone?: string
  status: 'active' | 'inactive' | 'pending'
  industry?: string
  createdAt: string
}

interface CustomerTableProps {
  data?: TCustomer[]
  isLoading?: boolean
  onRowClick?: (customer: TCustomer) => void
}

// Sample data for training
const SAMPLE_CUSTOMERS: TCustomer[] = [
  {
    id: '1',
    businessName: 'Tech Solutions Inc',
    customerType: 'business',
    email: 'contact@techsolutions.com',
    phone: '+1-555-0123',
    status: 'active',
    industry: 'Technology',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    businessName: 'Design Studio Pro',
    customerType: 'business',
    email: 'hello@designstudio.com',
    phone: '+1-555-0124',
    status: 'active',
    industry: 'Design',
    createdAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    businessName: 'John Smith',
    customerType: 'individual',
    email: 'john.smith@email.com',
    phone: '+1-555-0125',
    status: 'pending',
    createdAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    businessName: 'Manufacturing Corp',
    customerType: 'business',
    email: 'info@manufacturing.com',
    phone: '+1-555-0126',
    status: 'inactive',
    industry: 'Manufacturing',
    createdAt: '2024-01-18T16:45:00Z',
  },
]

// Column definitions following BizFix CRM patterns
const createCustomerColumns = (
  onEdit?: (customer: TCustomer) => void,
  onDelete?: (customer: TCustomer) => void
): ColumnDef<TCustomer>[] => [
    // Selection column
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type='checkbox'
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className='rounded'
        />
      ),
      cell: ({ row }) => (
        <input
          type='checkbox'
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className='rounded'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },

    // Business Name with sorting
    {
      accessorKey: 'businessName',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex items-center rounded px-2 py-1 hover:bg-gray-100'
        >
          Business Name
          {column.getIsSorted() === 'asc'
            ? ' ↑'
            : column.getIsSorted() === 'desc'
              ? ' ↓'
              : ' ↕'}
        </button>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className='flex items-center space-x-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
              <span className='text-sm font-medium text-blue-600'>
                {customer.businessName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className='font-medium'>{customer.businessName}</div>
              <div className='text-sm text-gray-500'>ID: {customer.id}</div>
            </div>
          </div>
        )
      },
      size: 250,
    },

    // Customer Type with filtering
    {
      accessorKey: 'customerType',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('customerType') as string
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${type === 'business'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
              }`}
          >
            {type}
          </span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 100,
    },

    // Contact Information
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className='space-y-1'>
            {customer.email && <div className='text-sm'>{customer.email}</div>}
            {customer.phone && (
              <div className='text-sm text-gray-600'>{customer.phone}</div>
            )}
          </div>
        )
      },
      size: 200,
    },

    // Industry
    {
      accessorKey: 'industry',
      header: 'Industry',
      cell: ({ row }) => {
        const industry = row.getValue('industry') as string
        return industry ? (
          <span className='inline-flex rounded bg-gray-100 px-2 py-1 text-xs text-gray-800'>
            {industry}
          </span>
        ) : (
          <span className='text-sm text-gray-400'>-</span>
        )
      },
      size: 120,
    },

    // Status with custom styling
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800',
        }

        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[status as keyof typeof statusColors]
              }`}
          >
            {status}
          </span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 100,
    },

    // Created Date with sorting
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex items-center rounded px-2 py-1 hover:bg-gray-100'
        >
          Created
          {column.getIsSorted() === 'asc'
            ? ' ↑'
            : column.getIsSorted() === 'desc'
              ? ' ↓'
              : ' ↕'}
        </button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return (
          <div className='text-sm'>
            <div>{date.toLocaleDateString()}</div>
            <div className='text-gray-500'>{date.toLocaleTimeString()}</div>
          </div>
        )
      },
      size: 120,
    },

    // Actions column
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className='flex space-x-2'>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(customer)
                }}
                className='rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600'
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(customer)
                }}
                className='rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600'
              >
                Delete
              </button>
            )}
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
      size: 120,
    },
  ]

// Table component
export const CustomerTable: React.FC<CustomerTableProps> = ({
  data = SAMPLE_CUSTOMERS,
  isLoading = false,
  onRowClick,
}) => {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5, // Small page size for training
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  // Action handlers
  const handleEdit = (customer: TCustomer) => {
    alert(`Edit customer: ${customer.businessName}`)
  }

  const handleDelete = (customer: TCustomer) => {
    if (confirm(`Delete customer: ${customer.businessName}?`)) {
      alert(`Customer ${customer.businessName} deleted`)
    }
  }

  // Column definitions with actions
  const columns = useMemo(
    () => createCustomerColumns(handleEdit, handleDelete),
    []
  )

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
  })

  // Get selected customers
  const selectedCustomers = Object.keys(rowSelection)
    .map((id) => data.find((customer) => customer.id === id))
    .filter(Boolean) as TCustomer[]

  if (isLoading) {
    return (
      <div className='rounded-lg border p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
        <p className='mt-2 text-gray-600'>Loading customers...</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Table Toolbar */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {/* Global Search */}
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder='Search customers...'
            className='rounded-md border px-3 py-2'
          />

          {/* Customer Type Filter */}
          <select
            value={
              (
                table.getColumn('customerType')?.getFilterValue() as string[]
              )?.join(',') ?? ''
            }
            onChange={(e) => {
              const value = e.target.value
              table
                .getColumn('customerType')
                ?.setFilterValue(value ? value.split(',') : undefined)
            }}
            className='rounded-md border px-3 py-2'
          >
            <option value=''>All Types</option>
            <option value='business'>Business</option>
            <option value='individual'>Individual</option>
          </select>

          {/* Status Filter */}
          <select
            value={
              (table.getColumn('status')?.getFilterValue() as string[])?.join(
                ','
              ) ?? ''
            }
            onChange={(e) => {
              const value = e.target.value
              table
                .getColumn('status')
                ?.setFilterValue(value ? value.split(',') : undefined)
            }}
            className='rounded-md border px-3 py-2'
          >
            <option value=''>All Statuses</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
            <option value='pending'>Pending</option>
          </select>

          {/* Clear Filters */}
          {(columnFilters.length > 0 || globalFilter) && (
            <button
              onClick={() => {
                setColumnFilters([])
                setGlobalFilter('')
              }}
              className='rounded-md bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300'
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Selected Counter */}
        {selectedCustomers.length > 0 && (
          <div className='text-sm text-gray-600'>
            {selectedCustomers.length} selected
          </div>
        )}
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-lg border'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-4 py-3 text-left text-sm font-medium text-gray-900'
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`cursor-pointer hover:bg-gray-50 ${row.getIsSelected() ? 'bg-blue-50' : ''
                    }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='px-4 py-3 text-sm'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-4 py-8 text-center text-gray-500'
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className='rounded border px-2 py-1 disabled:opacity-50'
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='rounded border px-2 py-1 disabled:opacity-50'
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='rounded border px-2 py-1 disabled:opacity-50'
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className='rounded border px-2 py-1 disabled:opacity-50'
          >
            {'>>'}
          </button>
        </div>

        <div className='flex items-center space-x-2'>
          <span className='text-sm text-gray-700'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
            className='rounded border px-2 py-1'
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Info */}
      <div className='space-y-1 text-sm text-gray-600'>
        <div>
          Showing {table.getRowModel().rows.length} of {data.length} customers
        </div>
        {selectedCustomers.length > 0 && (
          <div>
            Selected: {selectedCustomers.map((c) => c.businessName).join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}

// Example usage component
export const CustomerTableExample = () => {
  const [customers] = useState<TCustomer[]>(SAMPLE_CUSTOMERS)
  const [isLoading] = useState(false)

  const handleRowClick = (customer: TCustomer) => {
    alert(`Clicked on: ${customer.businessName}`)
  }

  return (
    <div className='mx-auto max-w-7xl p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Customer Management
        </h1>
        <p className='text-gray-600'>
          This is a training example of TanStack Table implementation
        </p>
      </div>

      <CustomerTable
        data={customers}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
