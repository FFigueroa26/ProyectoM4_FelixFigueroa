import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, error: 'Método no permitido.' }, { status: 405 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Cuerpo de solicitud inválido.' }, { status: 400 })
  }

  const { to, subject, text } = body as { to?: string; subject?: string; text?: string }

  if (!to || !subject || !text) {
    return Response.json(
      { ok: false, error: 'Faltan campos obligatorios: to, subject y text.' },
      { status: 400 },
    )
  }

  if (!EMAIL_REGEX.test(to)) {
    return Response.json({ ok: false, error: 'El correo destino no es válido.' }, { status: 400 })
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_REGION ?? 'us-east-1'
  const from = process.env.SES_FROM_EMAIL

  if (!accessKeyId || !secretAccessKey || !from) {
    return Response.json(
      { ok: false, error: 'Configuración de correo incompleta en el servidor.' },
      { status: 500 },
    )
  }

  const client = new SESClient({ region, credentials: { accessKeyId, secretAccessKey } })

  const command = new SendEmailCommand({
    Source: from,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: text } },
    },
  })

  try {
    await client.send(command)
    return Response.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al enviar el correo.'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}