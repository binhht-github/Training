import { CustomerQueryExamples } from '../api/customerQueries'

const QueryExamplesPage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='mb-4 text-3xl font-bold'>React Query Examples</h1>
        <p className='mb-6 text-muted-foreground'>
          Learn data fetching, mutations, and state management with React Query.
        </p>
      </div>
      <CustomerQueryExamples />
    </div>
  )
}

export default QueryExamplesPage
