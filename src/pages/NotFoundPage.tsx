import { Link, useNavigate } from 'react-router-dom'
import { CheckSquare, Home, ArrowLeft, HelpCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function NotFoundPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      {/* Brand Header */}
      <header className="absolute top-8 left-8 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20 group-hover:bg-violet-500 transition">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">MateCode</span>
        </Link>
      </header>

      {/* Main 404 Card */}
      <section className="w-full max-w-lg -translate-y-2 sm:-translate-y-4">
        <div className="bg-[#221e35] border border-[#393456] rounded-2xl p-8 sm:p-10 shadow-2xl text-center">
          {/* Badge Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 mb-6 shadow-inner">
            <HelpCircle className="w-10 h-10 animate-pulse" />
          </div>

          {/* 404 Large Label */}
          <p className="text-sm font-semibold tracking-widest uppercase text-violet-400 mb-2">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Página no encontrada
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            La página que estás buscando no existe, ha sido movida o la dirección ingresada no es correcta.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto py-2.5 px-5 bg-[#2d2745] hover:bg-[#383155] border border-[#3f3960] text-slate-300 hover:text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Regresar</span>
            </button>

            <Link
              to={user ? '/' : '/login'}
              className="w-full sm:w-auto py-2.5 px-6 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{user ? 'Ir a mis tareas' : 'Ir al inicio de sesión'}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
