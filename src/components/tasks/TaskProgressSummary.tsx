import { CheckCircle2, Clock, Target } from 'lucide-react'
import type { ReactNode } from 'react'

interface TaskProgressSummaryProps {
  completedTasks: number
  pendingTasks: number
  emailAction?: ReactNode
}

export function TaskProgressSummary({
  completedTasks,
  pendingTasks,
  emailAction,
}: TaskProgressSummaryProps) {
  const totalTasks = completedTasks + pendingTasks
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  const statusText =
    totalTasks === 0
      ? 'Crea tu primera tarea para comenzar a medir tu avance.'
      : pendingTasks === 0
        ? 'Has completado todas tus tareas.'
        : `Te ${pendingTasks === 1 ? 'falta' : 'faltan'} ${pendingTasks} ${
            pendingTasks === 1 ? 'tarea' : 'tareas'
          } por completar.`

  return (
    <section className="bg-[#1c1338]/70 border border-[#3b2769] rounded-2xl p-4 shadow-xl backdrop-blur-md h-full">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 shrink-0">
            <Target size={17} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white">Progreso de tareas</h2>
            <p className="text-xs text-slate-400 mt-0.5">{statusText}</p>
          </div>
        </div>

        <span className="text-2xl font-bold text-white leading-none">{progress}%</span>
      </div>

      <div
        className="h-2.5 rounded-full bg-[#120d22] border border-[#342858] overflow-hidden"
        role="progressbar"
        aria-label="Progreso de tareas completadas"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="rounded-xl bg-[#221841]/70 border border-[#3b276b] px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span>Completadas</span>
          </div>
          <p className="text-lg font-bold text-white mt-0.5">{completedTasks}</p>
        </div>

        <div className="rounded-xl bg-[#221841]/70 border border-[#3b276b] px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} className="text-violet-400 shrink-0" />
            <span>Pendientes</span>
          </div>
          <p className="text-lg font-bold text-white mt-0.5">{pendingTasks}</p>
        </div>
      </div>

      {emailAction && <div className="mt-4 pt-3 border-t border-[#3b276b]">{emailAction}</div>}
    </section>
  )
}
