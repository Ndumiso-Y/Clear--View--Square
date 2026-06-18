import { useState, useEffect, useCallback } from 'react'
import { fetchAdminStores } from '../services/adminStoreService.js'

export function useAdminStores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminStores()
      setStores(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { stores, loading, error, refreshStores: load }
}
