import AuthContextProvider from 'context/AuthContext'

export default function CombinedContextsProvider({ children }) {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  )
}
