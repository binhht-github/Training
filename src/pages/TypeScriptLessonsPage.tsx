import React, { useState } from 'react'
import {
  Code,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Target,
  Lightbulb,
} from 'lucide-react'

interface User {
  id: string
  fullname: string
  email: string
  role: 'admin' | 'user' | 'manager'
  avatar?: string
  lastLogin?: string
  isActive: boolean
}

interface Exercise {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  solution?: string
  hints: string[]
}

const TypeScriptLessonsPage = () => {
  const [selectedLesson, setSelectedLesson] = useState<string>('interfaces')
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  )
  const [showSolution, setShowSolution] = useState<string | null>(null)

  const lessons = [
    {
      id: 'interfaces',
      title: 'Interfaces & Type Definitions',
      description: 'Master TypeScript interfaces for React components',
      difficulty: 'Beginner',
      duration: '30 min',
    },
    {
      id: 'generics',
      title: 'Generic Components',
      description: 'Build reusable components with TypeScript generics',
      difficulty: 'Intermediate',
      duration: '45 min',
    },
    {
      id: 'hooks',
      title: 'Custom Hooks with Types',
      description: 'Create type-safe custom hooks and state management',
      difficulty: 'Intermediate',
      duration: '40 min',
    },
    {
      id: 'forms',
      title: 'Advanced Form Patterns',
      description: 'Form handling with React Hook Form, Zod, and TypeScript',
      difficulty: 'Advanced',
      duration: '60 min',
    },
    {
      id: 'patterns',
      title: 'Advanced TypeScript Patterns',
      description: 'Utility types, conditional types, and advanced patterns',
      difficulty: 'Advanced',
      duration: '50 min',
    },
  ]

  const markAsCompleted = (lessonId: string) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]))
  }

  const renderInterfacesLesson = () => (
    <div className='space-y-8'>
      {/* Introduction */}
      <div className='rounded-lg bg-blue-50 p-6'>
        <h3 className='mb-4 text-xl font-bold text-blue-900'>
          Lesson 1: Interfaces & Type Definitions
        </h3>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='flex items-center gap-2'>
            <Target className='h-5 w-5 text-blue-600' />
            <span className='font-medium'>Duration: 30 minutes</span>
          </div>
          <div className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5 text-blue-600' />
            <span className='font-medium'>Difficulty: Beginner</span>
          </div>
          <div className='flex items-center gap-2'>
            <Lightbulb className='h-5 w-5 text-blue-600' />
            <span className='font-medium'>5 Exercises</span>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className='rounded-lg border bg-card p-6'>
        <h4 className='mb-4 text-lg font-bold'>🎯 Learning Objectives</h4>
        <div className='grid gap-3 md:grid-cols-2'>
          <div className='space-y-2'>
            <h5 className='font-semibold'>
              By the end of this lesson, you will:
            </h5>
            <ul className='space-y-1 text-sm'>
              <li>
                ✅ Define proper TypeScript interfaces for React components
              </li>
              <li>✅ Use optional properties and union types effectively</li>
              <li>✅ Handle children props and event callbacks correctly</li>
              <li>✅ Implement discriminated unions for complex props</li>
            </ul>
          </div>
          <div className='space-y-2'>
            <h5 className='font-semibold'>Real-world skills:</h5>
            <ul className='space-y-1 text-sm text-muted-foreground'>
              <li>• Create reusable UI components</li>
              <li>• Build type-safe form components</li>
              <li>• Handle complex component state</li>
              <li>• Design flexible component APIs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Core Concepts */}
      <div className='space-y-6'>
        <h4 className='text-lg font-bold'>📚 Core Concepts</h4>

        {/* Concept 1: Basic Interfaces */}
        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>1. Basic Component Interface</h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`// ❌ Bad: Using 'any' loses type safety
interface BadProps {
  user: any;
  onClick: any;
}

// ✅ Good: Properly typed interface
interface UserCardProps {
  user: {
    id: string;
    fullname: string;
    email: string;
    role: 'admin' | 'user' | 'manager';
    avatar?: string;
  };
  onClick?: (userId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

// 🚀 Better: Extract user type
interface User {
  id: string;
  fullname: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  lastLogin?: Date;
  isActive: boolean;
}

interface UserCardProps {
  user: User;
  onClick?: (userId: string) => void;
  className?: string;
  children?: React.ReactNode;
}`}
          </pre>
          <div className='rounded bg-yellow-50 p-3 text-sm text-yellow-800'>
            <strong>💡 Best Practice:</strong> Always extract complex types into
            separate interfaces for reusability
          </div>
        </div>

        {/* Concept 2: Optional Props */}
        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>
            2. Optional Properties & Default Values
          </h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

// Component with default values
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ...restProps
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={\`btn btn-\${variant} btn-\${size} \${disabled ? 'opacity-50' : ''}\`}
      {...restProps}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// Usage examples
<Button onClick={() => {}}>Save</Button>
<Button variant="danger" onClick={() => {}}>Delete</Button>
<Button size="small" loading onClick={() => {}}>Submit</Button>`}
          </pre>
        </div>

        {/* Concept 3: Event Handlers */}
        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>3. Event Handlers & Callbacks</h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`// Different ways to type event handlers
interface FormProps {
  // Option 1: Specific event type
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  
  // Option 2: Custom callback with data
  onDataSubmit: (data: FormData) => void;
  
  // Option 3: Async handlers
  onAsyncSubmit: (data: FormData) => Promise<void>;
  
  // Option 4: Handlers with multiple parameters
  onFieldChange: (fieldName: string, value: string) => void;
}

// Example implementation
const ContactForm: React.FC<FormProps> = ({
  onSubmit,
  onDataSubmit,
  onAsyncSubmit,
  onFieldChange
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Call the prop handlers
    onSubmit(e);
    onDataSubmit(formData);
    await onAsyncSubmit(formData);
  };

  const handleFieldChange = (field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      onFieldChange(field, value);
    };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={handleFieldChange('name')}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={handleFieldChange('email')}
        placeholder="Email"
      />
      <textarea
        value={formData.message}
        onChange={handleFieldChange('message')}
        placeholder="Message"
      />
      <button type="submit">Send Message</button>
    </form>
  );
};`}
          </pre>
        </div>

        {/* Concept 4: Discriminated Unions */}
        <div className='rounded-lg border bg-card p-6'>
          <h5 className='mb-4 font-semibold'>
            4. Discriminated Unions for Complex Props
          </h5>
          <pre className='mb-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {`// Example: Modal component with different modes
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

interface ConfirmModalProps extends BaseModalProps {
  mode: 'confirm';
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface FormModalProps extends BaseModalProps {
  mode: 'form';
  children: React.ReactNode;
  onSubmit: (data: any) => void;
}

interface InfoModalProps extends BaseModalProps {
  mode: 'info';
  content: React.ReactNode;
}

// Union type ensures only valid combinations
type ModalProps = ConfirmModalProps | FormModalProps | InfoModalProps;

const Modal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose, title } = props;

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </header>
        
        <div className="modal-body">
          {props.mode === 'confirm' && (
            <div>
              <p>{props.message}</p>
              <div className="modal-actions">
                <button onClick={props.onConfirm}>
                  {props.confirmText || 'Confirm'}
                </button>
                <button onClick={onClose}>
                  {props.cancelText || 'Cancel'}
                </button>
              </div>
            </div>
          )}
          
          {props.mode === 'form' && (
            <form onSubmit={(e) => {
              e.preventDefault();
              props.onSubmit(new FormData(e.currentTarget));
            }}>
              {props.children}
            </form>
          )}
          
          {props.mode === 'info' && (
            <div>{props.content}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Usage examples - TypeScript ensures correct props
<Modal 
  mode="confirm" 
  isOpen={true} 
  onClose={() => {}} 
  title="Delete User"
  message="Are you sure you want to delete this user?"
  onConfirm={() => {}}
/>

<Modal 
  mode="form"
  isOpen={true}
  onClose={() => {}}
  title="Add User"
  onSubmit={(data) => {}}
>
  <input name="name" placeholder="Name" />
  <input name="email" placeholder="Email" />
</Modal>`}
          </pre>
        </div>
      </div>

      {/* Exercises */}
      <div className='space-y-6'>
        <h4 className='text-lg font-bold'>🏋️ Practice Exercises</h4>

        <ExerciseCard
          exercise={{
            id: 'exercise-1',
            title: 'Exercise 1: User Profile Component',
            description:
              'Create a UserProfile component interface with proper typing',
            difficulty: 'Easy',
            hints: [
              'Define a User interface with id, name, email, and optional avatar',
              'Include optional onEdit and onDelete callbacks',
              'Support different display modes (compact, full, card)',
              'Add className prop for styling flexibility',
            ],
          }}
          showSolution={showSolution === 'exercise-1'}
          onToggleSolution={() =>
            setShowSolution(showSolution === 'exercise-1' ? null : 'exercise-1')
          }
          solution={`interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  lastLogin?: Date;
}

interface UserProfileProps {
  user: User;
  mode?: 'compact' | 'full' | 'card';
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  className?: string;
  showLastLogin?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  mode = 'card',
  onEdit,
  onDelete,
  className,
  showLastLogin = false
}) => {
  // Component implementation
};`}
        />

        <ExerciseCard
          exercise={{
            id: 'exercise-2',
            title: 'Exercise 2: Data Table Component',
            description:
              'Build a generic table component with type-safe column definitions',
            difficulty: 'Medium',
            hints: [
              'Use generics to make the table work with any data type',
              'Define a Column interface with key, label, and optional render function',
              'Include sorting and filtering capabilities',
              'Add row selection with proper typing',
            ],
          }}
          showSolution={showSolution === 'exercise-2'}
          onToggleSolution={() =>
            setShowSolution(showSolution === 'exercise-2' ? null : 'exercise-2')
          }
          solution={`interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowSelect?: (selectedRows: T[]) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowSelect,
  onSort,
  loading = false
}: TableProps<T>) {
  // Implementation
}`}
        />

        <ExerciseCard
          exercise={{
            id: 'exercise-3',
            title: 'Exercise 3: Form Component with Validation',
            description:
              'Create a flexible form component with proper TypeScript validation',
            difficulty: 'Hard',
            hints: [
              'Use discriminated unions for different field types',
              'Implement proper validation with error messaging',
              'Support async validation',
              'Make it work with any form schema',
            ],
          }}
          showSolution={showSolution === 'exercise-3'}
          onToggleSolution={() =>
            setShowSolution(showSolution === 'exercise-3' ? null : 'exercise-3')
          }
          solution={`type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';

interface BaseField {
  name: string;
  label: string;
  required?: boolean;
  validation?: (value: any) => string | null;
}

interface TextField extends BaseField {
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  maxLength?: number;
}

interface SelectField extends BaseField {
  type: 'select';
  options: Array<{ value: string; label: string }>;
}

type FormField = TextField | SelectField;

interface FormProps<T extends Record<string, any>> {
  fields: FormField[];
  initialValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  validationSchema?: (data: T) => Record<string, string>;
}`}
        />
      </div>
    </div>
  )

  const renderGenericsLesson = () => (
    <div className='space-y-8'>
      <div className='rounded-lg bg-green-50 p-6'>
        <h3 className='mb-4 text-xl font-bold text-green-900'>
          Lesson 2: Generic Components
        </h3>
        <p className='text-green-800'>
          Learn to build flexible, reusable components that work with any data
          type while maintaining full type safety.
        </p>
      </div>

      {/* Content similar to interfaces but for generics */}
      <div className='rounded-lg border bg-card p-6'>
        <h4 className='mb-4 font-bold'>Why Generics Matter</h4>
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <h5 className='mb-2 font-semibold text-red-600'>
              ❌ Without Generics
            </h5>
            <ul className='space-y-1 text-sm'>
              <li>• Duplicate components for different data types</li>
              <li>• Loss of type safety with 'any'</li>
              <li>• Difficult to maintain</li>
              <li>• No IntelliSense support</li>
            </ul>
          </div>
          <div>
            <h5 className='mb-2 font-semibold text-green-600'>
              ✅ With Generics
            </h5>
            <ul className='space-y-1 text-sm'>
              <li>• Single component works with any type</li>
              <li>• Full type safety maintained</li>
              <li>• Easy to maintain and extend</li>
              <li>• Complete IntelliSense support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add more detailed generic examples here */}
    </div>
  )

  // Component for rendering exercise cards
  const ExerciseCard: React.FC<{
    exercise: Exercise
    showSolution: boolean
    onToggleSolution: () => void
    solution: string
  }> = ({ exercise, showSolution, onToggleSolution, solution }) => (
    <div className='rounded-lg border bg-card p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h5 className='font-semibold'>{exercise.title}</h5>
          <p className='text-sm text-muted-foreground'>
            {exercise.description}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            exercise.difficulty === 'Easy'
              ? 'bg-green-100 text-green-800'
              : exercise.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {exercise.difficulty}
        </span>
      </div>

      <div className='space-y-4'>
        <div>
          <h6 className='mb-2 font-medium'>💡 Hints:</h6>
          <ul className='space-y-1 text-sm'>
            {exercise.hints.map((hint, index) => (
              <li key={index}>• {hint}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={onToggleSolution}
          className='text-sm font-medium text-primary hover:underline'
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>

        {showSolution && (
          <pre className='overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100'>
            {solution}
          </pre>
        )}
      </div>
    </div>
  )

  const renderLessonContent = () => {
    switch (selectedLesson) {
      case 'interfaces':
        return renderInterfacesLesson()
      case 'generics':
        return renderGenericsLesson()
      // Add other lessons
      default:
        return renderInterfacesLesson()
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600'>
          <Code className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-3xl font-bold'>TypeScript Mastery</h1>
        <p className='mx-auto max-w-2xl text-muted-foreground'>
          Comprehensive TypeScript lessons with hands-on exercises, real-world
          examples, and best practices from BizFix CRM development.
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
            className='h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all'
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

export default TypeScriptLessonsPage
