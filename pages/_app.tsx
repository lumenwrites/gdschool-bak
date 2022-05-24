import '../styles/style.scss'

import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import CombinedContextsProvider from 'context/CombinedContexts'

function App({ Component, pageProps }) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <CombinedContextsProvider>
        <Component {...pageProps} />
      </CombinedContextsProvider>
    </UserProvider>
  )
}

export default App
