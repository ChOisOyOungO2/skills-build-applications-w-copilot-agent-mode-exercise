import { useCallback, useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

export function useCollection(path) {
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCollection() {
      setLoading(true)
      setError('')

      try {
        const collection = await fetchCollection(path, { signal: controller.signal })
        setData(collection)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load this collection.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadCollection()
    return () => controller.abort()
  }, [path, reloadKey])

  const retry = useCallback(() => setReloadKey((key) => key + 1), [])

  return { data, error, loading, retry }
}
