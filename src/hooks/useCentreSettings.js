import { useState, useEffect, useCallback } from 'react'
import { fetchCentreSettings, DEFAULT_SETTINGS } from '../services/centreSettingsService.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

export function useCentreSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading]   = useState(hasSupabaseConfig)
  const [error, setError]       = useState(null)

  const load = useCallback(async () => {
    if (!hasSupabaseConfig) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCentreSettings()
      setSettings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { settings, loading, error, refreshSettings: load }
}
