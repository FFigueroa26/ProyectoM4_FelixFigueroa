import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from '../../src/pages/NotFoundPage'
import * as useAuthHook from '../../src/hooks/useAuth'

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('NotFoundPage - Pruebas de componente', () => {
  it('debe renderizar el título de error 404 y la descripción', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
    })

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Error 404')).toBeInTheDocument()
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
    expect(screen.getByText(/La página que estás buscando no existe/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ir al inicio de sesión/i })).toBeInTheDocument()
  })

  it('debe mostrar el enlace hacia mis tareas si el usuario está autenticado', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
      } as any,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
    })

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Ir a mis tareas/i })).toBeInTheDocument()
  })
})
