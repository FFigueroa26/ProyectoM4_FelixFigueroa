import { auth } from './firebase'

const SEND_EMAIL_ENDPOINT = '/api/send-email'

interface SendEmailInput {
  subject: string
  text: string
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const user = auth.currentUser

  if (!user) {
    throw new Error('Debes iniciar sesión para enviar correos.')
  }

  const idToken = await user.getIdToken()

  const response = await fetch(SEND_EMAIL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(input),
  })

  const data = (await response.json()) as { ok: boolean; error?: string }

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo enviar el correo.')
  }
}
