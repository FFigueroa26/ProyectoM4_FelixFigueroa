import type { User as FirebaseUser } from 'firebase/auth'

export type User = FirebaseUser

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, pass: string) => Promise<void>
  register: (email: string, pass: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}
