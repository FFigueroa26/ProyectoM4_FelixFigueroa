import { useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../../services/firebase'
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  resetPassword,
  logoutUser,
} from '../../services/authService'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, pass: string) => {
    await loginWithEmail(email, pass)
  }

  const register = async (email: string, pass: string) => {
    await registerWithEmail(email, pass)
  }

  const handleGoogleLogin = async () => {
    await loginWithGoogle()
  }

  const handleResetPassword = async (email: string) => {
    await resetPassword(email)
  }

  const logout = async () => {
    await logoutUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle: handleGoogleLogin,
        resetPassword: handleResetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
