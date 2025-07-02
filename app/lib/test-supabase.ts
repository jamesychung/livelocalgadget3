import { supabase, checkSupabaseHealth } from './supabase'

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  console.log('🧪 Testing Supabase connection...')
  
  try {
    // Test 1: Check if we can connect
    const healthCheck = await checkSupabaseHealth()
    console.log('✅ Health check:', healthCheck)
    
    // Test 2: Try to get current user (should be null if not logged in)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('✅ Current user:', user ? 'Logged in' : 'Not logged in')
    if (userError) console.log('⚠️ User error (expected if not logged in):', userError.message)
    
    // Test 3: Try a simple query
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1)
    
    if (queryError) {
      console.log('❌ Query error:', queryError.message)
      return false
    }
    
    console.log('✅ Query successful:', users)
    console.log('🎉 Supabase connection is working!')
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  // Only run in browser
  testSupabaseConnection()
} 