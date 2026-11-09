const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export async function fetchCollection(path, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`)
  }

  const payload = await response.json()

  if (Array.isArray(payload)) {
    return payload
  }

  const collection =
    payload?.results ??
    payload?.items ??
    payload?.data?.results ??
    payload?.data?.items ??
    payload?.data

  if (Array.isArray(collection)) {
    return collection
  }

  throw new Error('The API response did not contain a collection.')
}
