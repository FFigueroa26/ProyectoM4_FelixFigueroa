const SEND_EMAIL_ENDPOINT = '/api/send-email'

export interface SendEmailInput {
  to: string
  subject: string
  text: string
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const response = await fetch(SEND_EMAIL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const data = (await response.json()) as { ok: boolean; error?: string }

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo enviar el correo.')
  }
}
