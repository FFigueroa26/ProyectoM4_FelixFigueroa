import { useState } from 'react'
import { Loader2, Send, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { sendEmail } from '../../services/emailService'
import { getPriorityLabel } from '../../utils/priority'
import type { Task } from '../../types/task'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

interface SendTaskSummaryButtonProps {
  tasks: Task[]
}

export function SendTaskSummaryButton({ tasks }: SendTaskSummaryButtonProps) {
  const [status, setStatus] = useState<SendStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSend = async () => {
    setStatus('sending')
    setMessage('')

    const pending = tasks.filter((t) => !t.completed)
    const completed = tasks.filter((t) => t.completed)

    const taskLines = tasks
      .map((t) => `- [${t.completed ? 'x' : ' '}] ${t.title} (${getPriorityLabel(t.priority)}${t.dueDate ? `, vence ${t.dueDate}` : ''}): ${t.description}`)
      .join('\n')

    const text = [
      'Resumen de tus tareas en MateCode:',
      '',
      `Total: ${tasks.length}`,
      `Pendientes: ${pending.length}`,
      `Completadas: ${completed.length}`,
      '',
      taskLines || 'Aún no tienes tareas registradas.',
    ].join('\n')

    try {
      await sendEmail({
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
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-1.5 rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/20 shrink-0">
          <Mail size={15} />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">Resumen por correo</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Resumen actualizado de tus tareas</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleSend}
          disabled={status === 'sending'}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900/60 disabled:cursor-not-allowed text-white rounded-lg text-[11px] font-semibold whitespace-nowrap shadow-sm transition cursor-pointer"
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

        {status !== 'idle' && (
          <p
            className={`flex items-start gap-1.5 text-[11px] font-medium ${
              status === 'success' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle2 size={13} className="shrink-0" />
            ) : (
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
            )}
            <span>{message}</span>
          </p>
        )}
      </div>
    </div>
  )
}
