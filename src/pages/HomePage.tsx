import { Link } from 'react-router-dom'
import {
  Code,
  Database,
  Table,
  Zap,
  Lightbulb,
  CheckCircle,
  Clock,
  BookOpen,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react'

const HomePage = () => {
  const modules = [
    {
      id: 1,
      path: '/typescript-lessons',
      title: 'TypeScript Mastery',
      description:
        'Comprehensive TypeScript lessons with hands-on exercises, real-world examples, and detailed explanations.',
      icon: Code,
      duration: '3-4 days',
      difficulty: 'Beginner',
      topics: [
        'Interfaces & Types',
        'Generic Components',
        'Custom Hooks',
        'Advanced Patterns',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      path: '/query-lessons',
      title: 'React Query Mastery',
      description:
        'Master TanStack Query with interactive demos, practical exercises, and advanced caching strategies.',
      icon: Database,
      duration: '3-4 days',
      difficulty: 'Intermediate',
      topics: [
        'Query Fundamentals',
        'Mutations & Updates',
        'Cache Management',
        'Advanced Patterns',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      id: 3,
      path: '/table-patterns',
      title: 'Table Patterns',
      description:
        'Build complex data tables with TanStack Table, including sorting, filtering, and virtualization.',
      icon: Table,
      duration: '3-4 days',
      difficulty: 'Intermediate',
      topics: [
        'Column Definitions',
        'Sorting & Filtering',
        'Row Selection',
        'Virtualization',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 4,
      path: '/practical-examples',
      title: 'Practical Examples',
      description:
        'Real-world implementations of customer management, forms, and CRUD operations.',
      icon: Zap,
      duration: '2-3 days',
      difficulty: 'Intermediate',
      topics: [
        'CRUD Operations',
        'Form Wizards',
        'Dashboard UI',
        'Advanced Filtering',
      ],
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 5,
      path: '/advanced-patterns',
      title: 'Advanced Patterns',
      description:
        'Expert-level concepts including compound components, performance optimization, and testing.',
      icon: Lightbulb,
      duration: '3-4 days',
      difficulty: 'Advanced',
      topics: [
        'Compound Components',
        'Performance',
        'Testing',
        'Accessibility',
      ],
      color: 'from-red-500 to-red-600',
    },
  ]

  const features = [
    {
      icon: Target,
      title: 'Hands-on Learning',
      description: 'Learn by building real components used in BizFix CRM',
    },
    {
      icon: CheckCircle,
      title: 'Progressive Difficulty',
      description: 'Start with basics and advance to expert-level patterns',
    },
    {
      icon: Users,
      title: 'Team Mentorship',
      description: 'Get guidance from experienced BizFix developers',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Guides',
      description: 'Detailed documentation and code examples',
    },
  ]

  return (
    <div className='space-y-12'>
      {/* Hero Section */}
      <div className='text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600'>
          <BookOpen className='h-8 w-8 text-white' />
        </div>
        <h1 className='mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl'>
          BizFix CRM Training Environment
        </h1>
        <p className='mx-auto max-w-3xl text-xl text-muted-foreground lg:text-2xl'>
          Master the technologies and patterns used in BizFix CRM through
          comprehensive, hands-on training modules designed for new team
          members.
        </p>
        <div className='mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
          <Link
            to='/typescript-lessons'
            className='inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90'
          >
            Start Learning <ArrowRight className='h-5 w-5' />
          </Link>
          <a
            href='#modules'
            className='inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-lg font-medium hover:bg-accent'
          >
            View All Modules
          </a>
        </div>
      </div>

      {/* Features */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className='rounded-lg border bg-card p-6 text-center'
            >
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Icon className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 font-semibold'>{feature.title}</h3>
              <p className='text-sm text-muted-foreground'>
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Training Modules */}
      <div id='modules' className='space-y-6'>
        <div className='text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Training Modules</h2>
          <p className='max-width-2xl mx-auto text-muted-foreground'>
            Follow our structured learning path to become proficient in BizFix
            CRM development patterns.
          </p>
        </div>

        <div className='space-y-6'>
          {modules.map((module) => {
            const Icon = module.icon
            const difficultyColors: Record<string, string> = {
              Beginner: 'bg-green-100 text-green-800',
              Intermediate: 'bg-yellow-100 text-yellow-800',
              Advanced: 'bg-red-100 text-red-800',
            }

            return (
              <div
                key={module.id}
                className='group rounded-lg border bg-card transition-all hover:shadow-lg'
              >
                <div className='p-6'>
                  <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex-1'>
                      <div className='mb-4 flex items-start gap-4'>
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${module.color}`}
                        >
                          <Icon className='h-6 w-6 text-white' />
                        </div>
                        <div className='flex-1'>
                          <div className='mb-2 flex items-center gap-3'>
                            <h3 className='text-xl font-semibold'>
                              {module.title}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${difficultyColors[module.difficulty]}`}
                            >
                              {module.difficulty}
                            </span>
                          </div>
                          <p className='text-muted-foreground'>
                            {module.description}
                          </p>
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-4 w-4' />
                          <span>{module.duration}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <BookOpen className='h-4 w-4' />
                          <span>{module.topics.length} topics</span>
                        </div>
                      </div>

                      <div className='mt-4 flex flex-wrap gap-2'>
                        {module.topics.map((topic) => (
                          <span
                            key={topic}
                            className='rounded-md bg-muted px-2 py-1 text-xs font-medium'
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className='flex-shrink-0'>
                      <Link
                        to={module.path}
                        className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 group-hover:shadow-lg'
                      >
                        Start Module <ArrowRight className='h-4 w-4' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Learning Path */}
      <div className='rounded-lg bg-muted p-8'>
        <h2 className='mb-6 text-2xl font-semibold'>
          Recommended Learning Path
        </h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground'>
              Week 1
            </div>
            <h3 className='font-semibold'>Foundations</h3>
            <p className='text-sm text-muted-foreground'>
              Master TypeScript patterns and component architecture
            </p>
          </div>
          <div className='space-y-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground'>
              Week 2
            </div>
            <h3 className='font-semibold'>Data Management</h3>
            <p className='text-sm text-muted-foreground'>
              Learn React Query for server state management
            </p>
          </div>
          <div className='space-y-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground'>
              Week 3
            </div>
            <h3 className='font-semibold'>Complex UI</h3>
            <p className='text-sm text-muted-foreground'>
              Build advanced tables and interactive components
            </p>
          </div>
          <div className='space-y-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground'>
              Week 4
            </div>
            <h3 className='font-semibold'>Real-World Skills</h3>
            <p className='text-sm text-muted-foreground'>
              Apply patterns in practical and advanced scenarios
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className='text-center'>
        <h2 className='mb-4 text-2xl font-semibold'>Ready to Begin?</h2>
        <p className='mb-6 text-muted-foreground'>
          Start your journey to becoming a BizFix CRM frontend expert
        </p>
        <Link
          to='/typescript-lessons'
          className='inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90'
        >
          Begin Training <ArrowRight className='h-5 w-5' />
        </Link>
      </div>
    </div>
  )
}

export default HomePage
