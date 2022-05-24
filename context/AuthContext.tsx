import { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

const Context = createContext({
  user: {} as any,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(Context)

export default function Provider({ children }) {
  const router = useRouter()
  // Next helpers automatically fetch the user, and save his info into cookies
  // And here I'm using this user to fetch extra profile data I've defined
  const { user: helpersUser, error } = useUser()
  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getUserProfile() {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', helpersUser.id)
        .single()
      console.log('[AuthContext] Fetched profile data', profile)
      // Combine data from supabase auth table, with data from profile
      setUser({ ...helpersUser, ...profile })
      setIsLoading(false)
    }
    // Only fetch profile info once user is logged in.
    if (helpersUser) getUserProfile()
  }, [helpersUser])

  async function login() {
    const { user, session, error } = await supabaseClient.auth.signIn({
      provider: 'google',
    })
    console.log('[AuthContext] Log in', { user, session, error })
  }

  const logout = async () => {
    await supabaseClient.auth.signOut()
    setUser(null)
    router.push('/')
    console.log('[AuthContext] Log out')
  }

  return (
    <Context.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </Context.Provider>
  )
}
