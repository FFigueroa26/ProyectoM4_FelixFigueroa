import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as emailService from '../../src/services/emailService'
import { auth } from '../../src/services/firebase'

vi.mock('../../src/services/firebase', () => ({
  auth: { currentUser: null as { getIdToken: () => Promise<string> } | null },
}))

const mockAuth = auth as unknown as {
  currentUser: { getIdToken: () => Promise<string> } | null
}

describe('emailService - envío autenticado', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('adjunta el ID token de Firebase en la cabecera Authorization', async () => {
    mockAuth.currentUser = { getIdToken: vi.fn().mockResolvedValue('token-abc') }

    await emailService.sendEmail({ subject: 'Hola', text: 'Contenido' })

    expect(mockAuth.currentUser?.getIdToken).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('/api/send-email', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-abc',
      },
    }))
  })

  it('nunca incluye el destinatario en el cuerpo, lo deriva el servidor del token', async () => {
    mockAuth.currentUser = { getIdToken: vi.fn().mockResolvedValue('token-abc') }

    await emailService.sendEmail({ subject: 'Hola', text: 'Contenido' })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string)
    expect(body).not.toHaveProperty('to')
  })

  it('falla antes de llamar al backend si no hay sesión activa', async () => {
    mockAuth.currentUser = null

    await expect(emailService.sendEmail({ subject: 'Hola', text: 'Contenido' })).rejects.toThrow(
      /iniciar sesión/i,
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('propaga el mensaje de error saneado que devuelve el servidor', async () => {
    mockAuth.currentUser = { getIdToken: vi.fn().mockResolvedValue('token-abc') }
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, error: 'Sesión no válida o expirada. Vuelve a iniciar sesión.' }),
    })

    await expect(emailService.sendEmail({ subject: 'Hola', text: 'Contenido' })).rejects.toThrow(
      /Sesión no válida o expirada/i,
    )
  })
})
