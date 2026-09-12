import { useState } from 'react'
import { X, CheckCircle2, Circle, AlignLeft, Trash2, Edit3, Check, CalendarDays, Flag } from 'lucide-react'
import type { Task, TaskInput } from '../../types/task'

interface TaskModalProps {
  task: Task
  onClose: () => void
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (id: string, input: TaskInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TaskModal({ task, onClose, onToggle, onEdit, onDelete }: TaskModalProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(task.title)

  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [description, setDescription] = useState(task.description || '')

  const handleSaveTitle = async () => {
    if (!title.trim()) return
    await onEdit(task.id, { title: title.trim(), description, dueDate: task.dueDate, priority: task.priority })
    setIsEditingTitle(false)
  }

  const handleSaveDesc = async () => {
    await onEdit(task.id, { title, description: description.trim(), dueDate: task.dueDate, priority: task.priority })
    setIsEditingDesc(false)
  }

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
      await onDelete(task.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-xl bg-[#221e35] border border-[#393456] rounded-2xl shadow-2xl p-6 text-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2c2744] transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3 mb-6 pr-8">
          <button
            type="button"
            onClick={() => onToggle(task.id, !task.completed)}
            aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            className={`mt-1 rounded-full transition cursor-pointer shrink-0 ${
              task.completed
                ? 'text-white bg-emerald-500 shadow-md shadow-emerald-500/30 scale-105'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
            }`}
            title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {task.completed ? (
              <CheckCircle2 size={22} className="text-emerald-400" />
            ) : (
              <Circle size={22} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171424] border border-[#443e66] rounded-lg text-white font-semibold text-lg focus:outline-none focus:border-violet-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-xs cursor-pointer"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className={`text-lg font-bold cursor-pointer hover:text-violet-200 transition ${
                    task.completed ? 'line-through text-slate-400' : 'text-white'
                  }`}
                >
                  {task.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition p-1 cursor-pointer"
                >
                  <Edit3 size={13} />
                </button>
              </div>
            )}

            <p className="text-xs text-slate-400 mt-1">
              En lista:{' '}
              <span className={`font-semibold ${task.completed ? 'text-emerald-400' : 'text-violet-400'}`}>
                {task.completed ? 'Completadas' : 'Pendientes'}
              </span>
            </p>

            <div className="flex items-center gap-2 flex-wrap mt-3 text-xs">
              <span className="inline-flex items-center gap-1 text-amber-300">
                <Flag size={13} /> Prioridad: {task.priority === 'high' ? 'Alta' : task.priority === 'low' ? 'Baja' : 'Media'}
              </span>
              {task.dueDate && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <CalendarDays size={13} /> Vence: {task.dueDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <AlignLeft size={16} className="text-slate-400" />
              <span>Descripción</span>
            </div>
            {!isEditingDesc && task.description && (
              <button
                type="button"
                onClick={() => setIsEditingDesc(true)}
                className="text-xs text-slate-400 hover:text-white bg-[#2b2642] px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                Editar
              </button>
            )}
          </div>

          {isEditingDesc ? (
            <div className="space-y-2">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Añadir una descripción más detallada..."
                className="w-full p-3 bg-[#171424] border border-[#443e66] rounded-xl text-white text-sm focus:outline-none focus:border-violet-400 resize-none"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDesc}
                  className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDescription(task.description || '')
                    setIsEditingDesc(false)
                  }}
                  className="px-3 py-1.5 bg-[#2b2642] hover:bg-[#383256] text-slate-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : task.description ? (
            <div
              onClick={() => setIsEditingDesc(true)}
              className="p-3 bg-[#181527] border border-[#342f4e] rounded-xl text-sm text-slate-300 whitespace-pre-wrap cursor-pointer hover:border-[#463f68] transition"
            >
              {task.description}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingDesc(true)}
              className="w-full p-3 text-left bg-[#181527] hover:bg-[#201c33] border border-[#342f4e] rounded-xl text-xs text-slate-400 hover:text-slate-300 transition cursor-pointer"
            >
              Añadir una descripción más detallada...
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#342f4e]">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-300 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            <span>Eliminar tarea</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2b2642] hover:bg-[#383256] text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
