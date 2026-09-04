import { useAuth } from '../hooks/useAuth'

export function TasksPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center pb-6 mb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">MateCode - Tareas</h1>
            <p className="text-sm text-slate-400">
              Sesión activa: <span className="text-blue-400 font-medium">{user?.email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium text-slate-200 transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </header>

        <main className="bg-slate-800/50 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">No hay tareas pendientes por mostrar.</p>
        </main>
      </div>
    </div>
  )
}
