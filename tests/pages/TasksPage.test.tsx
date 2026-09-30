import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TasksPage } from '../../src/pages/TasksPage'
import { ThemeProvider } from '../../src/features/theme/ThemeProvider'
import { EMAIL_NOT_SENT_WARNING } from '../../src/types/navigation'
import * as useAuthHook from '../../src/hooks/useAuth'
import * as useTasksHook from '../../src/hooks/useTasks'

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: vi.fn(),
}))

function renderTasksPage(state: unknown) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/', state }]}>
      <ThemeProvider>
        <TasksPage />
      </ThemeProvider>
    </MemoryRouter>,
  )
}

describe('TasksPage - aviso de navegación', () => {
  beforeEach(() => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { uid: 'u1', email: 'u1@example.com' } as never,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
    })
    vi.mocked(useTasksHook.useTasks).mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      addTask: vi.fn(),
      editTask: vi.fn(),
      toggleTask: vi.fn(),
      removeTask: vi.fn(),
    })
  })

  it('muestra el aviso cuando la navegación trae un warning', () => {
    renderTasksPage({ warning: EMAIL_NOT_SENT_WARNING })

    expect(screen.getByText(EMAIL_NOT_SENT_WARNING)).toBeInTheDocument()
  })

  it('permite descartar el aviso', async () => {
    const user = userEvent.setup()
    renderTasksPage({ warning: EMAIL_NOT_SENT_WARNING })

    await user.click(screen.getByRole('button', { name: /descartar aviso/i }))

    expect(screen.queryByText(EMAIL_NOT_SENT_WARNING)).not.toBeInTheDocument()
  })

  it('no muestra aviso cuando la navegación no trae state', () => {
    renderTasksPage(undefined)

    expect(screen.queryByText(EMAIL_NOT_SENT_WARNING)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /descartar aviso/i })).not.toBeInTheDocument()
  })
})
