import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { verifyFirebaseIdToken } from './_lib/verifyFirebaseToken.js'
import type { FirebaseIdentity } from './_lib/verifyFirebaseToken.js'

interface SafeErrorInfo {
  name: string
  status?: number
}

function logEvent(event: string, details: Record<string, string | number | undefined> = {}): void {
  const safeDetails = Object.entries(details)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(' ')

  console.info(`[send-email] ${event}${safeDetails ? ` ${safeDetails}` : ''}`)
}

function describeError(error: unknown): SafeErrorInfo {
  if (typeof error === 'object' && error !== null) {
    const candidate = error as { name?: unknown; $metadata?: { httpStatusCode?: unknown } }
    const status = candidate.$metadata?.httpStatusCode

    return {
      name: typeof candidate.name === 'string' ? candidate.name : 'UnknownError',
      status: typeof status === 'number' ? status : undefined,
    }
  }

  return { name: 'UnknownError' }
}

function publicErrorMessage(name: string): string {
  switch (name) {
    case 'MessageRejected':
    case 'AccountSendingPausedException':
      return 'No se pudo entregar el mensaje. Inténtalo más tarde.'
    case 'Throttling':
    case 'TooManyRequestsException':
      return 'Se alcanzó el límite de envíos. Inténtalo de nuevo en unos minutos.'
    default:
      return 'No se pudo enviar el correo. Inténtalo más tarde.'
  }
}

function fail(status: number, error: string): Response {
  return Response.json({ ok: false, error }, { status })
}

export function GET(): Response {
  return fail(405, 'Método no permitido.')
}

export async function POST(request: Request): Promise<Response> {
  let identity: FirebaseIdentity
  try {
    identity = await verifyFirebaseIdToken(request)
  } catch (error) {
    const { name } = describeError(error)
    logEvent('auth_failed', { reason: name })
    return fail(401, 'Sesión no válida o expirada. Vuelve a iniciar sesión.')
  }

  const recipient = identity.email
  if (!recipient) {
    logEvent('missing_claim', { uid: identity.uid, claim: 'email' })
    return fail(403, 'Tu cuenta no tiene un correo asociado.')
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return fail(400, 'Cuerpo de solicitud inválido.')
  }

  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const text = typeof body.text === 'string' ? body.text : ''

  if (!subject || !text) {
    return fail(400, 'Faltan campos obligatorios: subject y text.')
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_REGION ?? 'us-east-1'
  const from = process.env.SES_FROM_EMAIL

  if (!accessKeyId || !secretAccessKey || !from) {
    logEvent('config_missing', { uid: identity.uid })
    return fail(500, 'No se pudo enviar el correo. Inténtalo más tarde.')
  }

  const client = new SESClient({ region, credentials: { accessKeyId, secretAccessKey } })

  const command = new SendEmailCommand({
    Source: from,
    Destination: { ToAddresses: [recipient] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: text } },
    },
  })

  try {
    await client.send(command)
  } catch (error) {
    const safeError = describeError(error)
    logEvent('ses_error', { uid: identity.uid, ...safeError })
    return fail(502, publicErrorMessage(safeError.name))
  }

  logEvent('sent', { uid: identity.uid })
  return Response.json({ ok: true })
}
