import type { Customer, TableState, FilterConfig } from '../types/training'

// Mock data generators
export function generateMockCustomers(count: number = 10): Customer[] {
  const businessTypes = ['business', 'individual'] as const
  const statuses = ['active', 'inactive', 'pending'] as const

  return Array.from({ length: count }, (_, index) => ({
    id: `customer-${index + 1}`,
    businessName:
      `${['Tech Solutions', 'Design Studio', 'Marketing Pro', 'Data Corp', 'Cloud Systems'][index % 5]} ${index > 4 ? index - 4 : ''}`.trim(),
    customerType: businessTypes[index % 2],
    email: `contact${index + 1}@example.com`,
    phone: `+1-555-0${(100 + index).toString().slice(-3)}`,
    status: statuses[index % 3],
    revenue: Math.floor(Math.random() * 100000) + 10000,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    contacts: [
      {
        id: `contact-${index + 1}`,
        fullname: `John Doe ${index + 1}`,
        email: `john${index + 1}@example.com`,
        phone: `+1-555-1${(100 + index).toString().slice(-3)}`,
        isPrimary: true,
        role: 'Primary Contact',
      },
    ],
    address: {
      street: `${123 + index} Main Street`,
      city: ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Boston'][
        index % 5
      ],
      state: ['NY', 'CA', 'CA', 'IL', 'MA'][index % 5],
      zipCode: `${10000 + index}`,
      country: 'US',
    },
  }))
}

// URL search params utilities
export function buildSearchParams(
  params: Record<string, unknown>
): URLSearchParams {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          searchParams.set(`${key}[${index}]`, String(item))
        })
      } else if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(
          ([nestedKey, nestedValue]) => {
            if (nestedValue !== null && nestedValue !== undefined) {
              searchParams.set(`${key}[${nestedKey}]`, String(nestedValue))
            }
          }
        )
      } else {
        searchParams.set(key, String(value))
      }
    }
  })

  return searchParams
}

// Table state to search params
export function tableStateToSearchParams(state: TableState): URLSearchParams {
  const params = new URLSearchParams()

  // Pagination
  params.set('page', String(state.pagination.pageIndex + 1))
  params.set('limit', String(state.pagination.pageSize))

  // Sorting
  if (state.sorting.length > 0) {
    state.sorting.forEach((sort, index) => {
      params.set(`sort[${index}][field]`, sort.id)
      params.set(`sort[${index}][direction]`, sort.desc ? 'desc' : 'asc')
    })
  }

  // Column filters
  if (state.columnFilters.length > 0) {
    state.columnFilters.forEach((filter, index) => {
      params.set(`filter[${index}][field]`, filter.id)
      params.set(`filter[${index}][value]`, String(filter.value))
    })
  }

  // Global filter
  if (state.globalFilter) {
    params.set('search', state.globalFilter)
  }

  return params
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Local storage utilities
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error)
  }
}

// Form validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Number formatting utilities
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// Date utilities
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(d)
  }
}

// Filter utilities
export function applyFilters<T>(
  data: T[],
  filters: FilterConfig[],
  searchQuery?: string
): T[] {
  let filteredData = [...data]

  // Apply column filters
  filters.forEach((filter) => {
    filteredData = filteredData.filter((item) => {
      const value = (item as Record<string, unknown>)[filter.field]
      const filterValue = filter.value.toLowerCase()

      if (value === null || value === undefined) {
        return false
      }

      const stringValue = String(value).toLowerCase()

      switch (filter.operator) {
        case 'equals':
          return stringValue === filterValue
        case 'contains':
          return stringValue.includes(filterValue)
        case 'startsWith':
          return stringValue.startsWith(filterValue)
        case 'endsWith':
          return stringValue.endsWith(filterValue)
        case 'greaterThan':
          return Number(value) > Number(filter.value)
        case 'lessThan':
          return Number(value) < Number(filter.value)
        default:
          return true
      }
    })
  })

  // Apply global search
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filteredData = filteredData.filter((item) => {
      return Object.values(item as Record<string, unknown>).some((value) => {
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(query)
      })
    })
  }

  return filteredData
}

// Progress tracking utilities
export function calculateProgress(
  completed: string[],
  total: string[]
): number {
  if (total.length === 0) return 0
  return Math.round((completed.length / total.length) * 100)
}

// Color utilities for difficulty badges
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800'
    case 'advanced':
      return 'bg-orange-100 text-orange-800'
    case 'expert':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// ID generation
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Class name utility (cn function)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Mock API delay
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Error message formatting
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}
