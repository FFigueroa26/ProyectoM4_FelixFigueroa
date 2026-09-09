import { useState } from 'react'
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { sendEmail } from '../../services/emailService'
import type { Task } from '../../types/task'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

interface SendTaskSummaryButtonProps {
  tasks: Task[]
}

export function SendTaskSummaryButton({ tasks }: SendTaskSummaryButtonProps) {
  const { user } = useAuth()
  const [status, setStatus] = useState<SendStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSend = async () => {
    if (!user?.email) return

    setStatus('sending')
    setMessage('')

    const pending = tasks.filter((t) => !t.completed)
    const completed = tasks.filter((t) => t.completed)

    const taskLines = tasks
      .map((t) => `- [${t.completed ? 'x' : ' '}] ${t.title}: ${t.description}`)
      .join('\n')

    const text = [
      `Resumen de tus tareas en MateCode:`,
      ``,
      `Total: ${tasks.length}`,
      `Pendientes: ${pending.length}`,
      `Completadas: ${completed.length}`,
      ``,
      taskLines || 'Aún no tienes tareas registradas.',
    ].join('\n')

    try {
      await sendEmail({
        to: user.email,
        subject: 'Tu resumen de tareas - MateCode',
        text,
      })
      setStatus('success')
      setMessage('Correo enviado con éxito ✅')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.'
      setStatus('error')
      setMessage(`No se pudo enviar el correo: ${errorMessage}`)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSend}
        disabled={status === 'sending'}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed border border-blue-500 rounded-lg text-xs font-medium text-white transition cursor-pointer"
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send size={14} />
            Enviar resumen de tareas
          </>
        )}
      </button>

      {status === 'success' && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-400">
          <CheckCircle2 size={16} />
          {message}
        </p>
      )}

      {status === 'error' && (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-red-400">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {message}
        </p>
      )}
    </div>
  )
}