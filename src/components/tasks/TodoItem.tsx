import type { Task } from '../../types/task'

interface TodoItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ task, onToggle, onEdit, onDelete }: TodoItemProps) {
  const handleToggle = () => {
    onToggle(task.id, !task.completed)
  }

  const handleDelete = () => {
    if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
      onDelete(task.id)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start justify-between gap-3 hover:border-slate-600 transition">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium break-words ${
              task.completed ? 'line-through text-slate-500' : 'text-white'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              className={`text-xs mt-1 break-words ${
                task.completed ? 'line-through text-slate-600' : 'text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded transition cursor-pointer"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 rounded transition cursor-pointer"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
