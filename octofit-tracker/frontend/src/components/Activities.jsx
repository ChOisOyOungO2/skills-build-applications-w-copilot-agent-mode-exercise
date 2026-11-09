import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'type', label: 'Activity' },
  { key: 'user', label: 'Athlete' },
  { key: 'date', label: 'Date' },
  { key: 'durationMinutes', label: 'Duration (min)' },
  { key: 'distanceKm', label: 'Distance (km)' },
  { key: 'caloriesBurned', label: 'Calories' },
]

export default function Activities() {
  return (
    <CollectionPage
      title="Activities"
      description="See the latest workouts and milestones from your community."
      endpoint="/api/activities/"
      columns={columns}
    />
  )
}
