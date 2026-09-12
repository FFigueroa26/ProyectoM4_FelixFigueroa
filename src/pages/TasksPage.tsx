import { useEffect, useRef, useState } from 'react'
import { CheckSquare, LogOut, Plus, Clock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { TodoForm } from '../components/tasks/TodoForm'
import { TodoList } from '../components/tasks/TodoList'
import { SendTaskSummaryButton } from '../components/tasks/SendTaskSummaryButton'
import { TaskProgressSummary } from '../components/tasks/TaskProgressSummary'
import { TaskModal } from '../components/tasks/TaskModal'
import { TaskFilters, type FilterType } from '../components/tasks/TaskFilters'
import type { Task, TaskInput } from '../types/task'

const priorityRank = { high: 0, medium: 1, low: 2 } as const

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate)
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1
    const priorityDifference = (priorityRank[a.priority || 'medium'] ?? 1) - (priorityRank[b.priority || 'medium'] ?? 1)
    if (priorityDifference !== 0) return priorityDifference
    return (b.createdAt || 0) - (a.createdAt || 0)
  })
}

export function TasksPage() {
  const { user, logout } = useAuth()
  const { tasks, loading, error, addTask, editTask, toggleTask, removeTask } = useTasks()

  const [isAdding, setIsAdding] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all')
  const editFormRef = useRef<HTMLDivElement>(null)

  const filteredTasks = currentFilter === 'pending'
    ? tasks.filter((task) => !task.completed)
    : currentFilter === 'completed'
      ? tasks.filter((task) => task.completed)
      : currentFilter === 'all'
        ? tasks
        : tasks.filter((task) => (task.priority || 'medium') === currentFilter)
  const pendingTasks = sortTasks(filteredTasks.filter((t) => !t.completed))
  const completedTasks = sortTasks(filteredTasks.filter((t) => t.completed))
  const showPending = currentFilter !== 'completed'
  const showCompleted = currentFilter !== 'pending'
  const showsBothStatuses = currentFilter === 'all' || ['high', 'medium', 'low'].includes(currentFilter)

  useEffect(() => {
    if (editingTask) {
      editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingTask])

  const handleCreateTask = async (input: TaskInput) => {
    await addTask(input)
    setIsAdding(false)
  }

  const handleEditTask = async (id: string, input: TaskInput) => {
    await editTask(id, input)
    setEditingTask(null)
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({ ...selectedTask, ...input })
    }
  }

  const handleToggleTask = async (id: string, completed: boolean) => {
    const previousTask = selectedTask
    if (selectedTask?.id === id) {
      setSelectedTask({ ...selectedTask, completed })
    }

    try {
      await toggleTask(id, completed)
    } catch (error) {
      if (previousTask?.id === id) setSelectedTask(previousTask)
      throw error
    }
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U'

  return (
    <div className="min-h-screen text-slate-100 pb-16">
      <header className="sticky top-0 z-30 bg-[#140d26]/70 border-b border-[#362459] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/30">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight flex items-center gap-2">
              MateCode
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Tablero
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#20153d] border border-[#3b276b] text-xs">
              <div className="w-5 h-5 rounded-full bg-violet-500 text-[10px] font-bold text-white flex items-center justify-center">
                {userInitial}
              </div>
              <span className="text-slate-300 max-w-[160px] truncate">{user?.email}</span>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              title="Cerrar sesión"
              className="px-3 py-1.5 bg-[#20153d] hover:bg-[#2b1c52] border border-[#3b276b] rounded-xl text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <TaskProgressSummary
            completedTasks={completedTasks.length}
            pendingTasks={pendingTasks.length}
            emailAction={<SendTaskSummaryButton tasks={tasks} />}
          />
        </div>

        {editingTask && (
          <div ref={editFormRef} className="mb-6 scroll-mt-20">
            <TodoForm
              key={editingTask.id}
              onSubmit={(input) => handleEditTask(editingTask.id, input)}
              initialData={{
                title: editingTask.title,
                description: editingTask.description,
                dueDate: editingTask.dueDate,
                priority: editingTask.priority,
              }}
              isEditing={true}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        <TaskFilters value={currentFilter} onChange={setCurrentFilter} />

        <div
          className={`grid grid-cols-1 gap-5 items-start ${
            showsBothStatuses ? 'md:grid-cols-2' : ''
          }`}
        >
          {showPending && <div className="h-full bg-[#1c1338]/70 border border-[#3b2769] rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#362459]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-violet-400" />
                <h3 className="font-semibold text-sm text-white">Pendientes</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#2e1d57] text-violet-300 border border-violet-500/20">
                {pendingTasks.length}
              </span>
            </div>

            {isAdding ? (
              <div className="mb-3">
                <TodoForm
                  onSubmit={handleCreateTask}
                  onCancel={() => setIsAdding(false)}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="w-full py-2 mb-3 px-3 rounded-xl border border-dashed border-[#4d3285] hover:border-violet-400 bg-[#251847]/40 hover:bg-[#2a1b52] text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Añadir una tarea</span>
              </button>
            )}

            <TodoList
              tasks={pendingTasks}
              loading={loading}
              error={error}
              onToggle={handleToggleTask}
              onEdit={(task) => setEditingTask(task)}
              onDelete={removeTask}
              onSelect={(task) => setSelectedTask(task)}
              emptyMessage="No tienes tareas pendientes."
            />
          </div>}

          {showCompleted && <div className="h-full bg-[#1c1338]/70 border border-[#3b2769] rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#362459]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">Completadas</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                {completedTasks.length}
              </span>
            </div>

            <TodoList
              tasks={completedTasks}
              loading={loading}
              error={error}
              onToggle={handleToggleTask}
              onEdit={(task) => setEditingTask(task)}
              onDelete={removeTask}
              onSelect={(task) => setSelectedTask(task)}
              emptyMessage="Aún no has completado tareas."
            />
          </div>}
        </div>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onToggle={handleToggleTask}
            onEdit={handleEditTask}
            onDelete={removeTask}
          />
        )}
      </main>
    </div>
  )
}
