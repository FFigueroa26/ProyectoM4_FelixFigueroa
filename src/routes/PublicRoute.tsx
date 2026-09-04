import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function PublicRoute() {
  const { user, loading } = useAuth()

  // Si está comprobando sesión, mostramos carga
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Cargando...</p>
      </div>
    )
  }

  // Si ya tiene sesión activa, lo mandamos al panel principal
  if (user) {
    return <Navigate to="/" replace />
  }

  // Si no tiene sesión, puede ver la página pública (login o register)
  return <Outlet />
}
