import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  // 1. Mientras Firebase comprueba la sesión, mostramos mensaje de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Cargando sesión...</p>
      </div>
    )
  }

  // 2. Si no hay usuario logueado, redirigimos al login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 3. Si hay usuario, permitimos ver la página hija
  return <Outlet />
}
