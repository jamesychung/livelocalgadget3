import { createClient } from '@supabase/supabase-js'

// Get environment variables or use defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Debug environment variables
console.log('Environment Variables Debug:')
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
console.log('Using URL:', supabaseUrl)
console.log('Using Key length:', supabaseAnonKey.length)

// Validate the API key format
if (!supabaseAnonKey || supabaseAnonKey.length < 100) {
  console.error('Invalid Supabase API key. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Export a function to check Supabase health
export const checkSupabaseHealth = async () => {
  try {
    console.log("Checking Supabase health...")
    console.log("Supabase URL:", supabaseUrl)
    console.log("API Key length:", supabaseAnonKey?.length || 0)
    
    // Try a simple query to test connection
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error("Supabase health check failed:", error)
      return false
    }
    
    console.log("Supabase health check successful:", data)
    return true
  } catch (error: any) {
    console.error("Supabase health check failed:", error)
    return false
  }
}

// Export a function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error("Error getting current user:", error)
    return null
  }
  return user
}

// Export a function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error signing out:", error)
    return false
  }
  return true
} 