import { useAuth } from '../hooks/useAuth'

export function TasksPage() {
  const { user, logout } = useAuth()

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem', width: '100%' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <h2>MateCode - Tareas</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sesión activa: <strong>{user?.email}</strong>
          </p>
        </div>
        <button type="button" onClick={() => logout()} className="btn btn-secondary">
          Cerrar sesión
        </button>
      </header>

      <main>
        <p style={{ color: 'var(--text-muted)' }}>
          Autenticación verificada con éxito. Próximo paso: Hito 4 (Rutas protegidas) y CRUD de tareas.
        </p>
      </main>
    </div>
  )
}
