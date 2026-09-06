import type { Task } from '../../types/task'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
}

export function TodoList({
  tasks,
  loading,
  error,
  onToggle,
  onEdit,
  onDelete,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-8 text-center">
        <p className="text-sm text-slate-400">Cargando tareas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-center text-red-200 text-sm">
        {error}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-8 text-center">
        <p className="text-sm text-slate-400">No hay tareas para mostrar en este filtro.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
