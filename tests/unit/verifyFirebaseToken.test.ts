import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { verifyFirebaseIdToken } from '../../api/_lib/verifyFirebaseToken'

const jwtVerifyMock = vi.fn()

vi.mock('jose', () => ({
  jwtVerify: (...args: unknown[]) => jwtVerifyMock(...args),
  createRemoteJWKSet: () => ({}),
}))

function makeRequest(authorization?: string): Request {
  return new Request('https://example.com/api/send-email', {
    method: 'POST',
    headers: authorization ? { authorization } : {},
  })
}

describe('verifyFirebaseIdToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.FIREBASE_PROJECT_ID = 'matecode-test'
  })

  afterEach(() => {
    delete process.env.FIREBASE_PROJECT_ID
  })

  it('rechaza la petición si no viene cabecera Authorization', async () => {
    await expect(verifyFirebaseIdToken(makeRequest())).rejects.toThrow('MISSING_TOKEN')
    expect(jwtVerifyMock).not.toHaveBeenCalled()
  })

  it('rechaza esquemas distintos de Bearer', async () => {
    await expect(verifyFirebaseIdToken(makeRequest('Basic abc123'))).rejects.toThrow('MISSING_TOKEN')
    expect(jwtVerifyMock).not.toHaveBeenCalled()
  })

  it('verifica contra el issuer y audience del proyecto, restringido a RS256', async () => {
    jwtVerifyMock.mockResolvedValue({ payload: { sub: 'uid-1', email: 'felix@test.com' } })

    const identity = await verifyFirebaseIdToken(makeRequest('Bearer token-abc'))

    expect(jwtVerifyMock).toHaveBeenCalledWith(
      'token-abc',
      expect.anything(),
      expect.objectContaining({
        issuer: 'https://securetoken.google.com/matecode-test',
        audience: 'matecode-test',
        algorithms: ['RS256'],
      }),
    )
    expect(identity).toEqual({ uid: 'uid-1', email: 'felix@test.com' })
  })

  it('propaga el rechazo cuando la firma o el token no son válidos', async () => {
    jwtVerifyMock.mockRejectedValue(new Error('JWSSignatureVerificationFailed'))

    await expect(verifyFirebaseIdToken(makeRequest('Bearer token-falso'))).rejects.toThrow(
      'JWSSignatureVerificationFailed',
    )
  })

  it('rechaza un token sin claim sub', async () => {
    jwtVerifyMock.mockResolvedValue({ payload: { email: 'felix@test.com' } })

    await expect(verifyFirebaseIdToken(makeRequest('Bearer token-abc'))).rejects.toThrow(
      'MISSING_SUBJECT',
    )
  })

  it('rechaza un token emitido en el futuro', async () => {
    const future = Math.floor(Date.now() / 1000) + 3600
    jwtVerifyMock.mockResolvedValue({ payload: { sub: 'uid-1', iat: future, email: 'a@test.com' } })

    await expect(verifyFirebaseIdToken(makeRequest('Bearer token-abc'))).rejects.toThrow(
      'TOKEN_FROM_FUTURE',
    )
  })

  it('devuelve email null cuando el token no incluye el claim', async () => {
    jwtVerifyMock.mockResolvedValue({ payload: { sub: 'uid-1' } })

    const identity = await verifyFirebaseIdToken(makeRequest('Bearer token-abc'))

    expect(identity.email).toBeNull()
  })
})
