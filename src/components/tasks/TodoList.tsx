import { Inbox, Loader2, AlertCircle } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task } from '../../types/task'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  onToggle: (id: string, completed: boolean) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
  onSelect?: (task: Task) => void
  emptyMessage?: string
  listId?: 'pending' | 'completed'
}

export function TodoList({
  tasks,
  loading,
  error,
  onToggle,
  onEdit,
  onDelete,
  onSelect,
  emptyMessage = 'No hay tareas en esta columna.',
  listId = 'pending',
}: TodoListProps) {
  const { setNodeRef, isOver } = useDroppable({ id: listId })

  if (loading) {
    return (
      <div ref={setNodeRef} className={`bg-[#1e1b2e]/60 border rounded-xl p-8 text-center flex flex-col items-center justify-center transition ${isOver ? 'border-violet-400 bg-violet-500/10' : 'border-[#393456]'}`}>
        <Loader2 className="w-5 h-5 text-violet-400 animate-spin mb-2" />
        <p className="text-xs text-slate-300">Cargando tareas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div ref={setNodeRef} className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 text-center text-red-200 text-xs flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        <span>{error}</span>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div ref={setNodeRef} className={`bg-[#1b182b]/40 border border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition ${isOver ? 'border-violet-400 bg-violet-500/10' : 'border-[#393456]'}`}>
        <Inbox size={20} className="text-slate-500 mb-2" />
        <p className="text-xs text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} className={`min-h-16 rounded-xl transition ${isOver ? 'bg-violet-500/10 ring-1 ring-violet-400/50' : ''}`}>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
