import { UserCardExamples } from '../components/UserCard'

const UserCardExamplesPage = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='mb-4 text-3xl font-bold'>UserCard Examples</h1>
        <p className='mb-6 text-muted-foreground'>
          Explore different variants and use cases of the UserCard component.
        </p>
      </div>
      <UserCardExamples />
    </div>
  )
}

export default UserCardExamplesPage
