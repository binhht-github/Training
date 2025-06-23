import React from 'react'

// Core training types
export interface TrainingModule {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  duration: string
  topics: string[]
  color: string
  icon: string
}

export interface TrainingSection {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  content?: string
  examples?: CodeExample[]
}

export interface CodeExample {
  id: string
  title: string
  description: string
  code: string
  language: 'typescript' | 'javascript' | 'jsx' | 'tsx'
  tags: string[]
}

export interface TrainingProgress {
  moduleId: string
  completedSections: string[]
  startedAt: Date
  lastActivityAt: Date
  progressPercentage: number
}

// API types for training examples
export interface Customer {
  id: string
  businessName: string
  customerType: 'business' | 'individual'
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  revenue: number
  createdAt: string
  updatedAt?: string
  contacts?: Contact[]
  address?: Address
}

export interface Contact {
  id: string
  fullname: string
  email: string
  phone: string
  isPrimary: boolean
  role?: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface User {
  id: string
  fullname: string
  email: string
  role: 'admin' | 'user' | 'manager'
  avatar?: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

// Form types
export interface CustomerFormData {
  businessName: string
  customerType: 'business' | 'individual'
  email: string
  phone: string
  address: Address
  contacts: Contact[]
  preferredContact?: 'email' | 'phone' | 'mail'
  newsletter?: boolean
  notifications?: boolean
}

// API response types
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
  code: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  hasMore: boolean
}

// Table types
export interface TableState {
  pagination: {
    pageIndex: number
    pageSize: number
  }
  sorting: Array<{
    id: string
    desc: boolean
  }>
  columnFilters: Array<{
    id: string
    value: unknown
  }>
  globalFilter: string
}

// Filter types
export interface FilterConfig {
  id: string
  field: string
  operator: string
  value: string
}

export interface SavedFilter {
  id: string
  name: string
  filters: FilterConfig[]
  searchQuery: string
  createdAt: Date
}

// Dashboard types
export interface DashboardMetrics {
  totalRevenue: number
  activeCustomers: number
  conversionRate: number
  avgOrderValue: number
}

export interface ChartData {
  revenueTrend: Array<{
    date: string
    revenue: number
  }>
  customerDistribution: Array<{
    name: string
    value: number
  }>
}

// Utility types
export type DateRange = {
  from: Date
  to: Date
}

export type SortDirection = 'asc' | 'desc'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

// Component prop types
export interface ComponentExample {
  title: string
  description: string
  component: () => React.ReactElement
  code: string
  props?: Record<string, unknown>
}

export interface InteractiveExample {
  id: string
  title: string
  description: string
  initialState: unknown
  actions: Array<{
    name: string
    description: string
    handler: (state: unknown) => unknown
  }>
}

// Training assessment types
export interface Assessment {
  id: string
  moduleId: string
  questions: Question[]
  passingScore: number
  timeLimit?: number
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'code-completion' | 'true-false' | 'short-answer'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  codeContext?: string
}

export interface AssessmentResult {
  assessmentId: string
  userId: string
  score: number
  passed: boolean
  answers: Array<{
    questionId: string
    answer: string | number
    isCorrect: boolean
  }>
  completedAt: Date
}

// Training environment configuration
export interface TrainingConfig {
  modules: TrainingModule[]
  apiBaseUrl: string
  features: {
    assessments: boolean
    codePlayground: boolean
    liveExamples: boolean
    progressTracking: boolean
  }
}
