import { useState, useEffect } from 'react'
import { fetchPublicPromotions } from '../services/promotionService.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

export function usePromotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchPublicPromotions()
      .then(data => {
        if (!cancelled) {
          setPromotions(data)
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
    promotions,
    loading,
    error,
    source: hasSupabaseConfig ? 'supabase' : 'json',
  }
}
