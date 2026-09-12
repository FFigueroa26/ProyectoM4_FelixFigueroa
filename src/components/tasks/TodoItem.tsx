import { Edit3, Trash2, Check, AlignLeft } from 'lucide-react'
import type { Task } from '../../types/task'

interface TodoItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
  onSelect?: (task: Task) => void
}

export function TodoItem({ task, onToggle, onEdit, onDelete, onSelect }: TodoItemProps) {
  const handleToggle = (e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation()
    onToggle(task.id, !task.completed)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
      onDelete(task.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(task)
  }

  return (
    <div
      onClick={() => onSelect?.(task)}
      className={`group border rounded-xl p-3.5 flex items-start justify-between gap-3 transition cursor-pointer ${
        task.completed
          ? 'bg-[#1e1b2e]/60 border-[#2f2b47] opacity-75'
          : 'bg-[#26223b] hover:bg-[#2c2844] border-[#393456] hover:border-[#4c4672] shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <label
          onClick={(e) => e.stopPropagation()}
          className="relative flex items-center justify-center mt-0.5 cursor-pointer select-none shrink-0"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="peer sr-only"
          />
          <div className="w-4.5 h-4.5 rounded-md border-2 border-slate-500 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition flex items-center justify-center bg-[#191627]">
            <Check size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </label>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium leading-snug break-words transition ${
              task.completed ? 'line-through text-slate-400' : 'text-slate-100'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
              <AlignLeft size={12} className="shrink-0" />
              <span className="truncate max-w-[200px]">{task.description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
        <button
          type="button"
          onClick={handleEdit}
          title="Editar tarea"
          className="p-1 text-slate-400 hover:text-white hover:bg-[#383256] rounded-lg transition cursor-pointer"
        >
          <Edit3 size={13} />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          title="Eliminar tarea"
          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
