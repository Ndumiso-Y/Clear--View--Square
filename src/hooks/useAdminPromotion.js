import { useState, useEffect, useCallback } from 'react'
import { fetchAdminPromotionBySlug } from '../services/adminPromotionService.js'

export function useAdminPromotion(slug) {
  const [promotion, setPromotion] = useState(null)
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!slug) {
      setPromotion(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminPromotionBySlug(slug)
      setPromotion(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  return { promotion, loading, error, refreshPromotion: load }
}
