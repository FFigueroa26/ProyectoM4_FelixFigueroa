import { useState, type FormEvent } from 'react'
import type { TaskInput } from '../../types/task'

interface TodoFormProps {
  onSubmit: (input: TaskInput) => Promise<void>
  initialData?: TaskInput
  onCancel?: () => void
  isEditing?: boolean
}

export function TodoForm({
  onSubmit,
  initialData,
  onCancel,
  isEditing = false,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('El título de la tarea es obligatorio.')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({ title, description })
      if (!isEditing) {
        setTitle('')
        setDescription('')
      }
    } catch {
      setError('Hubo un error al guardar la tarea.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6 shadow-sm">
      <h3 className="text-base font-semibold text-white mb-3">
        {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
      </h3>

      {error && (
        <div className="mb-3 p-2.5 bg-red-950/50 border border-red-500/50 rounded-lg text-red-200 text-xs">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label htmlFor="task-title" className="block text-xs font-medium text-slate-300 mb-1">
            Título *
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="¿Qué necesitas hacer hoy?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="task-description" className="block text-xs font-medium text-slate-300 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            id="task-description"
            rows={2}
            placeholder="Detalles adicionales..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Agregar Tarea'}
          </button>

          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-200 transition cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
