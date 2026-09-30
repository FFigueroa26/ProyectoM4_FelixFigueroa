import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { POST, GET } from '../../api/send-email'
import { verifyFirebaseIdToken } from '../../api/_lib/verifyFirebaseToken.js'
import { SendEmailCommand } from '@aws-sdk/client-ses'

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }))

vi.mock('../../api/_lib/verifyFirebaseToken.js', () => ({
  verifyFirebaseIdToken: vi.fn(),
}))

vi.mock('@aws-sdk/client-ses', () => ({
  SESClient: vi.fn().mockImplementation(function SESClient() {
    return { send: sendMock }
  }),
  SendEmailCommand: vi.fn().mockImplementation(function SendEmailCommand(input: unknown) {
    return { input }
  }),
}))

const validBody = { subject: 'Resumen', text: 'Contenido' }

function makeRequest(body: unknown = validBody): Request {
  return new Request('https://example.com/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const originalEnv = { ...process.env }

afterAll(() => {
  process.env = originalEnv
  vi.restoreAllMocks()
})

describe('api/send-email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'info').mockImplementation(() => {})
    sendMock.mockResolvedValue({})
    process.env.AWS_ACCESS_KEY_ID = 'AKIA_TEST'
    process.env.AWS_SECRET_ACCESS_KEY = 'secret-test'
    process.env.SES_FROM_EMAIL = 'noreply@example.com'
    process.env.AWS_REGION = 'us-east-1'
    vi.mocked(verifyFirebaseIdToken).mockResolvedValue({
      uid: 'uid-1',
      email: 'owner@example.com',
    })
  })

  it('rechaza GET con 405', async () => {
    const response = GET()

    expect(response.status).toBe(405)
    expect(await response.json()).toEqual({ ok: false, error: 'Método no permitido.' })
  })

  it('devuelve 401 si la verificación del token falla', async () => {
    vi.mocked(verifyFirebaseIdToken).mockRejectedValue(new Error('MISSING_TOKEN'))

    const response = await POST(makeRequest())

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({
      ok: false,
      error: 'Sesión no válida o expirada. Vuelve a iniciar sesión.',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('devuelve 403 si el token no trae correo', async () => {
    vi.mocked(verifyFirebaseIdToken).mockResolvedValue({ uid: 'uid-1', email: null })

    const response = await POST(makeRequest())

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({
      ok: false,
      error: 'Tu cuenta no tiene un correo asociado.',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('devuelve 400 si el cuerpo no es JSON válido', async () => {
    const response = await POST(makeRequest('{ roto'))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ ok: false, error: 'Cuerpo de solicitud inválido.' })
  })

  it('devuelve 400 si faltan subject o text', async () => {
    const response = await POST(makeRequest({ subject: 'Solo subject' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      ok: false,
      error: 'Faltan campos obligatorios: subject y text.',
    })
  })

  it('devuelve 500 sin filtrar detalles si falta la configuración de AWS', async () => {
    delete process.env.SES_FROM_EMAIL

    const response = await POST(makeRequest())

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      ok: false,
      error: 'No se pudo enviar el correo. Inténtalo más tarde.',
    })
  })

  it('envía al correo del token e ignora cualquier destinatario del cliente', async () => {
    const response = await POST(makeRequest({ ...validBody, to: 'attacker@example.com' }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(SendEmailCommand).toHaveBeenCalledWith({
      Source: 'noreply@example.com',
      Destination: { ToAddresses: ['owner@example.com'] },
      Message: {
        Subject: { Data: 'Resumen' },
        Body: { Text: { Data: 'Contenido' } },
      },
    })
  })

  it('devuelve 502 con mensaje genérico cuando SES rechaza el envío', async () => {
    const error = Object.assign(new Error('Address blacklisted'), { name: 'MessageRejected' })
    sendMock.mockRejectedValueOnce(error)

    const response = await POST(makeRequest())

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({
      ok: false,
      error: 'No se pudo entregar el mensaje. Inténtalo más tarde.',
    })
  })
})
