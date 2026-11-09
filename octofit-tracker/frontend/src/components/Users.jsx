import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'team', label: 'Team' },
]

export default function Users() {
  return (
    <CollectionPage
      title="Users"
      description="Get to know the athletes in your Octofit community."
      endpoint="/api/users/"
      columns={columns}
    />
  )
}
