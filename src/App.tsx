import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import TypeScriptLessonsPage from './pages/TypeScriptLessonsPage'
import QueryLessonsPage from './pages/QueryLessonsPage'
import TypeScriptPatternsPage from './pages/TypeScriptPatternsPage'
import QueryPatternsPage from './pages/QueryPatternsPage'
import TablePatternsPage from './pages/TablePatternsPage'
import PracticalExamplesPage from './pages/PracticalExamplesPage'
import AdvancedPatternsPage from './pages/AdvancedPatternsPage'

// Legacy routes for backward compatibility
import CustomerTablePage from './pages/CustomerTablePage'
import QueryExamplesPage from './pages/QueryExamplesPage'
import UserCardExamplesPage from './pages/UserCardExamplesPage'
import ExercisePage from './pages/ExercisePage'

function App() {
  return (
    <div className='min-h-screen bg-background'>
      <Navigation />
      <main className='container mx-auto px-4 py-8'>
        <Routes>
          {/* Main Training Modules */}
          <Route path='/' element={<HomePage />} />
          <Route
            path='/typescript-lessons'
            element={<TypeScriptLessonsPage />}
          />
          <Route path='/query-lessons' element={<QueryLessonsPage />} />
          <Route
            path='/typescript-patterns'
            element={<TypeScriptPatternsPage />}
          />
          <Route path='/query-patterns' element={<QueryPatternsPage />} />
          <Route path='/table-patterns' element={<TablePatternsPage />} />
          <Route
            path='/practical-examples'
            element={<PracticalExamplesPage />}
          />
          <Route path='/advanced-patterns' element={<AdvancedPatternsPage />} />

          {/* Legacy Routes - Redirect to new modules */}
          <Route path='/user-card' element={<UserCardExamplesPage />} />
          <Route path='/customer-table' element={<CustomerTablePage />} />
          <Route path='/query-examples' element={<QueryExamplesPage />} />
          <Route path='/exercise' element={<ExercisePage />} />
          <Route path='/exercise/:course/:exercise' element={<ExercisePage />} />
        </Routes>
      </main>
      <Toaster position='top-right' expand={false} richColors />
    </div>
  )
}

export default App
