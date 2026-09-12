import { useState } from 'react'
import { Loader2, Send, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
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
    <div className="bg-[#231f38] border border-[#393456] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/20 shrink-0">
          <Mail size={17} />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-white">Resumen por Correo</h4>
          <p className="text-[11px] text-slate-400">
            Recibe un resumen actualizado de tus tareas en tu correo.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-1.5">
        <button
          type="button"
          onClick={handleSend}
          disabled={status === 'sending'}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900/60 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          {status === 'sending' ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Enviando…</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>Enviar resumen de tareas</span>
            </>
          )}
        </button>

        {status === 'success' && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>{message}</span>
          </p>
        )}

        {status === 'error' && (
          <p className="flex items-start gap-1.5 text-xs text-red-400 font-medium">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>{message}</span>
          </p>
        )}
      </div>
    </div>
  )
}
