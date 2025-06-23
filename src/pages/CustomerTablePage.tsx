import { CustomerTable } from '../components/CustomerTable'

const CustomerTablePage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='mb-4 text-3xl font-bold'>Customer Table</h1>
        <p className='mb-6 text-muted-foreground'>
          Advanced data table with sorting, filtering, pagination, and row
          selection.
        </p>
      </div>
      <CustomerTable />
    </div>
  )
}

export default CustomerTablePage
