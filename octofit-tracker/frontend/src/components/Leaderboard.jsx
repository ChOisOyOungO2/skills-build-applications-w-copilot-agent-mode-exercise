import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'user', label: 'Athlete' },
  { key: 'team', label: 'Team' },
  { key: 'points', label: 'Points' },
]

export default function Leaderboard() {
  return (
    <CollectionPage
      title="Leaderboard"
      description="Celebrate the athletes earning the most points this week."
      endpoint="/api/leaderboard/"
      columns={columns}
    />
  )
}
