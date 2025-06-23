// Training: React + TypeScript Component Patterns
// This file demonstrates the key patterns used in BizFix CRM

import { cn } from '@/lib/utils'
import React, { memo, useState } from 'react'

// 1. Always define props interface
interface UserCardProps {
  user: TUser
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'compact' | 'detailed'
}

// 2. Type definition (should be in types/ directory in real app)
interface TUser {
  id: string
  fullname: string
  email: string
  role: 'admin' | 'user' | 'manager'
  avatar?: string
  lastLoginAt?: string
  isActive: boolean
}

// 3. Main component with proper TypeScript
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  className,
  children,
  variant = 'default',
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 4. Conditional rendering based on props
  const renderUserActions = () => {
    if (!onEdit && !onDelete) return null

    return (
      <div className='mt-2 flex space-x-2'>
        {onEdit && (
          <button
            onClick={() => onEdit(user.id)}
            className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600'
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(user.id)}
            className='rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600'
          >
            Delete
          </button>
        )}
      </div>
    )
  }

  // 5. Variant-based styling
  const getCardStyles = () => {
    const baseStyles = 'border rounded-lg p-4'

    switch (variant) {
      case 'compact':
        return cn(baseStyles, 'p-2', className)
      case 'detailed':
        return cn(baseStyles, 'p-6 shadow-lg', className)
      default:
        return cn(baseStyles, className)
    }
  }

  // 6. Status badge component
  const StatusBadge = () => (
    <span
      className={cn(
        'rounded-full px-2 py-1 text-xs font-medium',
        user.isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      )}
    >
      {user.isActive ? 'Active' : 'Inactive'}
    </span>
  )

  return (
    <div className={getCardStyles()}>
      <div className='flex items-start justify-between'>
        <div className='flex items-center space-x-3'>
          {/* Avatar */}
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullname}
                className='h-10 w-10 rounded-full'
              />
            ) : (
              <span className='font-medium text-gray-600'>
                {user.fullname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h3 className='font-semibold text-gray-900'>{user.fullname}</h3>
            <p className='text-sm text-gray-500'>{user.email}</p>
            {variant === 'detailed' && user.lastLoginAt && (
              <p className='text-xs text-gray-400'>
                Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Status and Role */}
        <div className='flex flex-col items-end space-y-2'>
          <StatusBadge />
          <span className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-800'>
            {user.role}
          </span>
        </div>
      </div>

      {/* Expandable Details */}
      {variant === 'detailed' && (
        <div className='mt-4'>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>

          {isExpanded && (
            <div className='mt-2 rounded bg-gray-50 p-3'>
              <p className='text-sm'>
                <strong>Role:</strong> {user.role}
              </p>
              <p className='text-sm'>
                <strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}
              </p>
              {user.lastLoginAt && (
                <p className='text-sm'>
                  <strong>Last Login:</strong>{' '}
                  {new Date(user.lastLoginAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {renderUserActions()}

      {/* Children prop for extensibility */}
      {children}
    </div>
  )
}

// 7. Memoized version for performance
export const MemoizedUserCard = memo(UserCard)

// 8. Usage examples (for documentation)
export const UserCardExamples = () => {
  const sampleUser: TUser = {
    id: '1',
    fullname: 'John Doe',
    email: 'john.doe@bizfix.com',
    role: 'admin',
    isActive: true,
    lastLoginAt: '2024-01-15T10:30:00Z',
  }

  const handleEdit = (userId: string) => {
    console.log('Edit user:', userId)
  }

  const handleDelete = (userId: string) => {
    console.log('Delete user:', userId)
  }

  return (
    <div className='space-y-4 p-4'>
      <h2 className='text-xl font-bold'>User Card Examples</h2>

      {/* Default variant */}
      <UserCard user={sampleUser} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Compact variant */}
      <UserCard user={sampleUser} variant='compact' />

      {/* Detailed variant */}
      <UserCard
        user={sampleUser}
        variant='detailed'
        onEdit={handleEdit}
        className='border-blue-200'
      >
        <div className='mt-2 text-sm text-gray-600'>
          Custom content via children prop
        </div>
      </UserCard>
    </div>
  )
}
