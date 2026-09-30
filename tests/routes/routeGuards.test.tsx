import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../../src/routes/ProtectedRoute'
import { PublicRoute } from '../../src/routes/PublicRoute'
import type { User } from '../../src/types/auth'
import * as useAuthHook from '../../src/hooks/useAuth'

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

const mockAuth = (state: { user: User | null; loading: boolean }) => {
  vi.mocked(useAuthHook.useAuth).mockReturnValue({
    ...state,
    login: vi.fn(),
    register: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
  })
}

const dummyUser = { uid: 'user-1', email: 'user@example.com' } as User

describe('ProtectedRoute', () => {
  it('muestra el estado de carga mientras resuelve la sesión', () => {
    mockAuth({ user: null, loading: true })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Zona privada</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Cargando sesión...')).toBeInTheDocument()
    expect(screen.queryByText('Zona privada')).not.toBeInTheDocument()
  })

  it('redirige al login cuando no hay sesión', () => {
    mockAuth({ user: null, loading: false })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Zona privada</p>} />
          </Route>
          <Route path="/login" element={<p>Pantalla de login</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
    expect(screen.queryByText('Zona privada')).not.toBeInTheDocument()
  })

  it('deja pasar a la zona privada cuando hay sesión', () => {
    mockAuth({ user: dummyUser, loading: false })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Zona privada</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Zona privada')).toBeInTheDocument()
  })
})

describe('PublicRoute', () => {
  it('redirige a las tareas cuando ya existe sesión', () => {
    mockAuth({ user: dummyUser, loading: false })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<p>Pantalla de login</p>} />
          </Route>
          <Route path="/" element={<p>Zona privada</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Zona privada')).toBeInTheDocument()
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
  })

  it('deja pasar al login cuando no hay sesión', () => {
    mockAuth({ user: null, loading: false })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<p>Pantalla de login</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })
})
