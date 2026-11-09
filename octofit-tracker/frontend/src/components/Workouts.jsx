import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'name', label: 'Workout' },
  { key: 'category', label: 'Category' },
  { key: 'durationMinutes', label: 'Duration (min)' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'description', label: 'Description' },
]

export default function Workouts() {
  return (
    <CollectionPage
      title="Workouts"
      description="Find a workout to match your goals and energy today."
      endpoint="/api/workouts/"
      columns={columns}
    />
  )
}
