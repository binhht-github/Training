import React, { useState } from 'react'
import { ChevronRight, CheckCircle, Code, PlayCircle } from 'lucide-react'

interface User {
  id: string
  fullname: string
  email: string
  role: 'admin' | 'user' | 'manager'
  avatar?: string
}

// Example 1: Basic Component with Props Interface
interface UserCardProps {
  user: User
  onEdit?: (userId: string) => void
  className?: string
  children?: React.ReactNode
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  className,
  children,
}) => {
  return (
    <div className={`rounded-lg border bg-card p-4 ${className || ''}`}>
      <div className='flex items-center space-x-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
          <span className='font-medium text-primary'>{user.fullname[0]}</span>
        </div>
        <div className='flex-1'>
          <h3 className='font-medium'>{user.fullname}</h3>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
          <span className='inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
            {user.role}
          </span>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(user.id)}
            className='rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90'
          >
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

// Example 2: Generic Component
interface TableProps<T> {
  data: T[]
  columns: Array<{
    key: keyof T
    label: string
    render?: (item: T) => React.ReactNode
  }>
  onRowClick?: (row: T) => void
}

function Table<T>({ data, columns, onRowClick }: TableProps<T>) {
  return (
    <div className='rounded-lg border'>
      <table className='w-full'>
        <thead className='border-b bg-muted/50'>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className='px-4 py-3 text-left font-medium'
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className='cursor-pointer border-b hover:bg-muted/50'
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className='px-4 py-3'>
                  {column.render ? column.render(row) : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const TypeScriptPatternsPage = () => {
  const [selectedExample, setSelectedExample] =
    useState<string>('props-interface')
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  )

  // Sample data
  const users: User[] = [
    { id: '1', fullname: 'John Doe', email: 'john@example.com', role: 'admin' },
    {
      id: '2',
      fullname: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
    },
    {
      id: '3',
      fullname: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'manager',
    },
  ]

  const userColumns = [
    { key: 'fullname' as keyof User, label: 'Name' },
    { key: 'email' as keyof User, label: 'Email' },
    {
      key: 'role' as keyof User,
      label: 'Role',
      render: (user: User) => (
        <span className='inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
          {user.role}
        </span>
      ),
    },
  ]

  const sections = [
    {
      id: 'props-interface',
      title: 'Component Props Interface',
      description:
        'Learn to define proper TypeScript interfaces for component props',
      difficulty: 'Beginner',
    },
    {
      id: 'generic-components',
      title: 'Generic Components',
      description: 'Build reusable components with TypeScript generics',
      difficulty: 'Intermediate',
    },
    {
      id: 'custom-hooks',
      title: 'Custom Hooks Patterns',
      description: 'Create type-safe custom hooks following BizFix patterns',
      difficulty: 'Intermediate',
    },
    {
      id: 'form-handling',
      title: 'Form Handling',
      description: 'Handle forms with React Hook Form and Zod validation',
      difficulty: 'Advanced',
    },
  ]

  const markAsCompleted = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]))
  }

  const renderPropsInterfaceExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Props Interface Pattern</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`interface UserCardProps {
  user: User;
  onEdit?: (userId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  className,
  children,
}) => {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      <h3>{user.fullname}</h3>
      <p>{user.email}</p>
      {onEdit && <Button onClick={() => onEdit(user.id)}>Edit</Button>}
      {children}
    </div>
  );
};`}
        </pre>
      </div>

      <div className='space-y-4'>
        <h4 className='font-semibold'>Live Example:</h4>
        <div className='grid gap-4 md:grid-cols-2'>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={(id) => alert(`Editing user: ${id}`)}
            >
              <p className='mt-2 text-xs text-muted-foreground'>
                Additional content can go here
              </p>
            </UserCard>
          ))}
        </div>
      </div>

      <div className='rounded-lg bg-blue-50 p-4'>
        <h4 className='mb-2 font-semibold text-blue-900'>Key Patterns:</h4>
        <ul className='space-y-1 text-sm text-blue-800'>
          <li>• Always define props interface first</li>
          <li>• Use optional props with `?` for flexibility</li>
          <li>• Include `children` for composition</li>
          <li>• Use React.FC for consistent typing</li>
        </ul>
      </div>
    </div>
  )

  const renderGenericComponentsExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Generic Components Pattern
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
}

export function Table<T>({ data, columns, onRowClick }: TableProps<T>) {
  // Implementation
}

// Usage
<Table<User>
  data={users}
  columns={userColumns}
  onRowClick={handleUserClick}
/>`}
        </pre>
      </div>

      <div className='space-y-4'>
        <h4 className='font-semibold'>Live Example:</h4>
        <Table
          data={users}
          columns={userColumns}
          onRowClick={(user) => alert(`Clicked: ${user.fullname}`)}
        />
      </div>

      <div className='rounded-lg bg-green-50 p-4'>
        <h4 className='mb-2 font-semibold text-green-900'>Benefits:</h4>
        <ul className='space-y-1 text-sm text-green-800'>
          <li>• Type safety for any data structure</li>
          <li>• Reusable across different entities</li>
          <li>• IntelliSense support for columns</li>
          <li>• Compile-time error checking</li>
        </ul>
      </div>
    </div>
  )

  const renderCustomHooksExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Custom Hooks Pattern</h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-purple-50 p-4'>
        <h4 className='mb-2 font-semibold text-purple-900'>Hook Patterns:</h4>
        <ul className='space-y-1 text-sm text-purple-800'>
          <li>• Use generics for flexible data types</li>
          <li>• Return arrays or objects consistently</li>
          <li>• Handle errors gracefully</li>
          <li>• Follow React hooks naming convention</li>
        </ul>
      </div>
    </div>
  )

  const renderFormHandlingExample = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-muted p-4'>
        <h3 className='mb-4 text-lg font-semibold'>
          Form Handling with React Hook Form + Zod
        </h3>
        <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
          {`import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user", "manager"]),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm() {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullname: "",
      email: "",
      role: "user",
    },
  });

  const onSubmit = (data: UserFormData) => {
    console.log(data); // Type-safe data
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}`}
        </pre>
      </div>

      <div className='rounded-lg bg-orange-50 p-4'>
        <h4 className='mb-2 font-semibold text-orange-900'>Form Patterns:</h4>
        <ul className='space-y-1 text-sm text-orange-800'>
          <li>• Use Zod for schema validation</li>
          <li>• Infer types from schemas</li>
          <li>• Handle errors consistently</li>
          <li>• Provide good UX feedback</li>
        </ul>
      </div>
    </div>
  )

  const renderExampleContent = () => {
    switch (selectedExample) {
      case 'props-interface':
        return renderPropsInterfaceExample()
      case 'generic-components':
        return renderGenericComponentsExample()
      case 'custom-hooks':
        return renderCustomHooksExample()
      case 'form-handling':
        return renderFormHandlingExample()
      default:
        return renderPropsInterfaceExample()
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600'>
          <Code className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>TypeScript Patterns</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Master React + TypeScript patterns used throughout BizFix CRM. Learn
          proper typing, component architecture, and best practices.
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

export default TypeScriptPatternsPage
