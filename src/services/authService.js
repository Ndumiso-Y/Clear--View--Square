import { supabase, hasSupabaseConfig } from '../lib/supabase.js'

const ALLOWED_ROLES = ['admin', 'editor']

async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('id, role, active')
    .eq('id', userId)
    .maybeSingle()
  return data ?? null
}

export async function signInAdmin(email, password) {
  if (!hasSupabaseConfig) {
    return { session: null, profile: null, error: 'Supabase is not configured.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { session: null, profile: null, error: error.message }

  const profile = await fetchProfile(data.user.id)

  if (!profile) {
    await supabase.auth.signOut()
    return { session: null, profile: null, error: 'No admin profile found for this account.' }
  }
  if (!profile.active) {
    await supabase.auth.signOut()
    return { session: null, profile: null, error: 'This account has been deactivated. Contact an administrator.' }
  }
  if (!ALLOWED_ROLES.includes(profile.role)) {
    await supabase.auth.signOut()
    return { session: null, profile: null, error: 'This account does not have admin access.' }
  }

  return { session: data.session, profile, error: null }
}

export async function signOutAdmin() {
  if (!hasSupabaseConfig) return
  await supabase.auth.signOut()
}

export async function getCurrentSession() {
  if (!hasSupabaseConfig) return null
  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export async function getCurrentAdminProfile() {
  if (!hasSupabaseConfig) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return fetchProfile(user.id)
}

// Returns a Supabase subscription object. When Supabase is not configured,
// returns a no-op subscription so callers can unsubscribe safely.
export function onAuthStateChange(callback) {
  if (!hasSupabaseConfig) {
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
  return supabase.auth.onAuthStateChange(callback)
}
