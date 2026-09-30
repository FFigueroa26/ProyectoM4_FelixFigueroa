import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { JWTVerifyGetKey } from 'jose'

const GOOGLE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'

const CLOCK_SKEW_SECONDS = 60

export interface FirebaseIdentity {
  uid: string
  email: string | null
}

let cachedJwks: JWTVerifyGetKey | null = null

function getJwks(): JWTVerifyGetKey {
  if (!cachedJwks) {
    cachedJwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL))
  }
  return cachedJwks
}

function getProjectId(): string {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID

  if (!projectId) {
    throw new Error('MISSING_PROJECT_ID')
  }

  return projectId
}

export async function verifyFirebaseIdToken(request: Request): Promise<FirebaseIdentity> {
  const authorization = request.headers.get('authorization') ?? ''
  const [scheme, token] = authorization.split(' ')

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new Error('MISSING_TOKEN')
  }

  const projectId = getProjectId()

  const { payload } = await jwtVerify(token, getJwks(), {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ['RS256'],
  })

  if (!payload.sub) {
    throw new Error('MISSING_SUBJECT')
  }

  if (typeof payload.iat === 'number' && payload.iat > Date.now() / 1000 + CLOCK_SKEW_SECONDS) {
    throw new Error('TOKEN_FROM_FUTURE')
  }

  return {
    uid: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : null,
  }
}
