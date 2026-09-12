import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { AuthDivider } from '../components/auth/AuthDivider'
import { AuthPageShell } from '../components/auth/AuthPageShell'
import { AuthTextField } from '../components/auth/AuthTextField'
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton'
import { useAuth } from '../hooks/useAuth'
import { getAuthErrorMessage } from '../services/authService'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password || !confirmPassword) {
      setError('Por favor completa todos los campos.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      await register(email, password)
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
      brandSubtitle="Crea tu cuenta y empieza a organizarte"
      title="Crear Cuenta"
      description="Regístrate gratis con tu email o Google"
      error={error}
      footer={
        <p className="mt-6 text-center text-xs text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition">
            Inicia sesión aquí
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
          placeholder="Mínimo 6 caracteres"
          value={password}
          autoComplete="new-password"
          icon={Lock}
          onChange={setPassword}
        />

        <AuthTextField
          id="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          placeholder="Repite la contraseña"
          value={confirmPassword}
          autoComplete="new-password"
          icon={Lock}
          onChange={setConfirmPassword}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            'Creando cuenta...'
          ) : (
            <>
              <span>Registrarse Gratis</span>
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
