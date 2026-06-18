import { useState, useEffect, useCallback } from 'react'
import { fetchAdminPromotions } from '../services/adminPromotionService.js'

export function useAdminPromotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminPromotions()
      setPromotions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { promotions, loading, error, refreshPromotions: load }
}
