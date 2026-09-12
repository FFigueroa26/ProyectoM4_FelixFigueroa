import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { AuthDivider } from '../components/auth/AuthDivider'
import { AuthPageShell } from '../components/auth/AuthPageShell'
import { AuthTextField } from '../components/auth/AuthTextField'
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton'
import { useAuth } from '../hooks/useAuth'
import { getAuthErrorMessage } from '../services/authService'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos.')
      return
    }

    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      setError(getAuthErrorMessage(firebaseError.code || ''))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      setError(getAuthErrorMessage(firebaseError.code || ''))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell
      brandSubtitle="Gestión ordenada y sencilla de tus tareas"
      title="Iniciar Sesión"
      description="Ingresa tus datos para acceder a tu cuenta"
      error={error}
      footer={
        <p className="mt-6 text-center text-xs text-slate-400">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition">
            Crea tu cuenta aquí
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthTextField
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@matecode.com"
          value={email}
          autoComplete="email"
          icon={Mail}
          onChange={setEmail}
        />

        <AuthTextField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          autoComplete="current-password"
          icon={Lock}
          onChange={setPassword}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            'Iniciando sesión...'
          ) : (
            <>
              <span>Iniciar Sesión</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      <AuthDivider />
      <GoogleAuthButton disabled={submitting} onClick={handleGoogle} />
    </AuthPageShell>
  )
}
