import { useCollection } from '../hooks/useCollection.js'

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (Array.isArray(value)) {
    return `${value.length} members`
  }

  if (typeof value === 'object') {
    return value.name ?? value.username ?? value.email ?? value._id ?? '—'
  }

  if (typeof value === 'string' && !Number.isNaN(Date.parse(value)) && value.includes('T')) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))
  }

  return String(value)
}

export default function CollectionPage({ title, description, endpoint, columns }) {
  const { data, error, loading, retry } = useCollection(endpoint)

  return (
    <section className="content-card" aria-labelledby="page-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OCTOFIT TRACKER</p>
          <h1 id="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        {!loading && !error && (
          <span className="badge rounded-pill text-bg-primary">
            {data.length} {data.length === 1 ? 'record' : 'records'}
          </span>
        )}
      </div>

      {loading && (
        <div className="loading-state" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          <span>Loading {title.toLowerCase()}…</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3" role="alert">
          <span>{error}</span>
          <button className="btn btn-outline-danger btn-sm flex-shrink-0" onClick={retry} type="button">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="empty-state">
          <h2>No {title.toLowerCase()} yet</h2>
          <p>Records will appear here when they are available.</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                {columns.map(({ label }) => (
                  <th scope="col" key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={record._id ?? record.id ?? `${endpoint}-${index}`}>
                  {columns.map(({ key }) => (
                    <td key={key}>{formatValue(record[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
