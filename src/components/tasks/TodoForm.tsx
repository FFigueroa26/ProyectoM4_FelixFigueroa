import { useState, type FormEvent } from 'react'
import { PlusCircle, Edit3, X, AlertCircle } from 'lucide-react'
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
    <form
      onSubmit={handleSubmit}
      className="bg-[#242038] border border-[#393456] rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${isEditing ? 'bg-amber-500/20 text-amber-300' : 'bg-violet-500/20 text-violet-300'}`}>
          {isEditing ? <Edit3 size={15} /> : <PlusCircle size={15} />}
        </div>
        <h3 className="text-sm font-semibold text-white">
          {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>
      </div>

      {error && (
        <div className="mb-3 p-2.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0 text-red-400" />
          <span>{error}</span>
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
            placeholder="¿Qué necesitas hacer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-[#1b182b] border border-[#393456] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition"
          />
        </div>

        <div>
          <label htmlFor="task-description" className="block text-xs font-medium text-slate-300 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            id="task-description"
            rows={2}
            placeholder="Añadir una descripción más detallada..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[#1b182b] border border-[#393456] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 resize-none transition"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {submitting ? (
              'Guardando...'
            ) : isEditing ? (
              <>
                <Edit3 size={13} />
                <span>Guardar Cambios</span>
              </>
            ) : (
              <>
                <PlusCircle size={13} />
                <span>Agregar Tarea</span>
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 bg-[#1b182b] hover:bg-[#2e2947] border border-[#393456] text-slate-300 hover:text-white rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1"
            >
              <X size={13} />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
