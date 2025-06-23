import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Menu,
  X,
  BookOpen,
  Code,
  Database,
  Table,
  Zap,
  Lightbulb,
} from 'lucide-react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: BookOpen },
    { path: '/typescript-lessons', label: 'TypeScript Lessons', icon: Code },
    { path: '/query-lessons', label: 'Query Lessons', icon: Database },
    { path: '/typescript-patterns', label: 'TS Patterns', icon: Code },
    { path: '/query-patterns', label: 'Query Patterns', icon: Database },
    { path: '/table-patterns', label: 'Table Patterns', icon: Table },
    { path: '/practical-examples', label: 'Practical Examples', icon: Zap },
    { path: '/advanced-patterns', label: 'Advanced Patterns', icon: Lightbulb },
    { path: '/exercise', label: ' Exercise', icon: BookOpen },
  ]

  return (
    <nav className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground'>
              <BookOpen className='h-5 w-5' />
            </div>
            <span className='text-lg font-semibold'>BizFix CRM Training</span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:space-x-1'>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  <Icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              aria-expanded='false'
            >
              {isOpen ? (
                <X className='h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className='md:hidden'>
            <div className='space-y-1 px-2 pb-3 pt-2'>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                      }`
                    }
                  >
                    <Icon className='h-5 w-5' />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
