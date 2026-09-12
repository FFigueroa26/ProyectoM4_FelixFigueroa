import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SendTaskSummaryButton } from '../../src/components/tasks/SendTaskSummaryButton'
import * as emailService from '../../src/services/emailService'
import * as authHook from '../../src/hooks/useAuth'

vi.mock('../../src/services/emailService', () => ({
  sendEmail: vi.fn(),
}))

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('SendTaskSummaryButton - Pruebas con servicio simulado', () => {
  const dummyTasks = [
    { id: '1', title: 'Tarea 1', description: 'Desc 1', completed: false, userId: 'u1' },
    { id: '2', title: 'Tarea 2', description: 'Desc 2', completed: true, userId: 'u1' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authHook.useAuth).mockReturnValue({
      user: { email: 'felix@test.com' } as never,
      loading: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('debe enviar el correo y mostrar mensaje de éxito al completar el envío', async () => {
    const user = userEvent.setup()
    vi.mocked(emailService.sendEmail).mockResolvedValueOnce(undefined)

    render(<SendTaskSummaryButton tasks={dummyTasks} />)

    const sendBtn = screen.getByRole('button', { name: /Enviar resumen de tareas/i })

    await user.click(sendBtn)

    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'felix@test.com',
        subject: 'Tu resumen de tareas - MateCode',
      }),
    )
    expect(await screen.findByText(/Correo enviado con éxito/i)).toBeInTheDocument()
  })

  it('caso de error: debe mostrar mensaje de error en la UI cuando falla el servicio', async () => {
    const user = userEvent.setup()
    vi.mocked(emailService.sendEmail).mockRejectedValueOnce(
      new Error('Servicio de email temporalmente no disponible'),
    )

    render(<SendTaskSummaryButton tasks={dummyTasks} />)

    const sendBtn = screen.getByRole('button', { name: /Enviar resumen de tareas/i })

    await user.click(sendBtn)

    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(
      await screen.findByText(/Servicio de email temporalmente no disponible/i),
    ).toBeInTheDocument()
  })
})
