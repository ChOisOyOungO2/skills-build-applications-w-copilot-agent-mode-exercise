import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'description', label: 'About' },
  { key: 'members', label: 'Members' },
]

export default function Teams() {
  return (
    <CollectionPage
      title="Teams"
      description="Meet the teams supporting each other along the way."
      endpoint="/api/teams/"
      columns={columns}
    />
  )
}
