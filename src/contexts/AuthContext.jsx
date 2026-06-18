import { createContext, useState, useEffect, useCallback } from 'react'
import { hasSupabaseConfig } from '../lib/supabase.js'
import {
  signInAdmin as serviceSignIn,
  signOutAdmin as serviceSignOut,
  getCurrentAdminProfile,
  onAuthStateChange,
} from '../services/authService.js'

const ALLOWED_ROLES = ['admin', 'editor']

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    // When Supabase is not configured there is no session to restore.
    if (!hasSupabaseConfig) {
      setLoading(false)
      return () => { cancelled = true }
    }

    // onAuthStateChange fires an INITIAL_SESSION event on subscribe,
    // which handles restoring an existing session without a separate getSession call.
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (cancelled) return
      if (session?.user) {
        setUser(session.user)
        try {
          const p = await getCurrentAdminProfile()
          if (!cancelled) setProfile(p)
        } catch {
          if (!cancelled) setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    const result = await serviceSignIn(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return { success: false, error: result.error }
    }
    // Auth state change listener will also update state, but set directly
    // here for an immediate UI response before the listener fires.
    setUser(result.session.user)
    setProfile(result.profile)
    setLoading(false)
    return { success: true }
  }, [])

  const signOut = useCallback(async () => {
    await serviceSignOut()
    // Auth state change listener clears state on SIGNED_OUT,
    // but clear immediately for instant UI response.
    setUser(null)
    setProfile(null)
    setError(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const p = await getCurrentAdminProfile()
    setProfile(p)
  }, [user])

  const isAuthenticated = Boolean(user)
  const isAdmin =
    isAuthenticated &&
    Boolean(profile) &&
    profile.active === true &&
    ALLOWED_ROLES.includes(profile.role)

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
