import { useState, useEffect, useCallback } from 'react'
import { fetchAdminStoreBySlug } from '../services/adminStoreService.js'

export function useAdminStore(slug) {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!slug) {
      setStore(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminStoreBySlug(slug)
      setStore(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  return { store, loading, error, refreshStore: load }
}
