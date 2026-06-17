import { useState, useEffect } from 'react'
import { fetchPublicStores } from '../services/storeService.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

export function useStores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchPublicStores()
      .then(data => {
        if (!cancelled) {
          setStores(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return {
    stores,
    loading,
    error,
    source: hasSupabaseConfig ? 'supabase' : 'json',
  }
}
