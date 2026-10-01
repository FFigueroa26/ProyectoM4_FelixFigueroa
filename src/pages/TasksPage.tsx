import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DndContext, DragOverlay, PointerSensor, closestCorners, pointerWithin, useSensor, useSensors, type CollisionDetection, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { AlertTriangle, CheckSquare, LogOut, Plus, Clock, CheckCircle2, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { TodoForm } from '../components/tasks/TodoForm'
import { TodoList } from '../components/tasks/TodoList'
import { SendTaskSummaryButton } from '../components/tasks/SendTaskSummaryButton'
import { TaskProgressSummary } from '../components/tasks/TaskProgressSummary'
import { TaskModal } from '../components/tasks/TaskModal'
import { TaskFilters, type FilterType } from '../components/tasks/TaskFilters'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { updateTaskPlacement } from '../services/taskService'
import { DEFAULT_PRIORITY, TASK_PRIORITIES, getPriorityLabel } from '../utils/priority'
import type { Task, TaskInput, TaskPriority } from '../types/task'
import type { AppLocationState } from '../types/navigation'

const priorityRank = { high: 0, medium: 1, low: 2 } as const

const collisionDetectionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args)
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number' && a.order !== b.order) {
      return a.order - b.order
    }
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate)
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1
    const priorityDifference = priorityRank[a.priority || DEFAULT_PRIORITY] - priorityRank[b.priority || DEFAULT_PRIORITY]
    if (priorityDifference !== 0) return priorityDifference
    return (b.createdAt || 0) - (a.createdAt || 0)
  })
}

export function TasksPage() {
  const { user, logout } = useAuth()
  const { tasks, loading, error, addTask, editTask, toggleTask, removeTask } = useTasks()
  const location = useLocation()
  const navigate = useNavigate()

  const [isAdding, setIsAdding] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all')
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [warning, setWarning] = useState<string | null>(
    (location.state as AppLocationState | null)?.warning ?? null,
  )
  const editFormRef = useRef<HTMLDivElement>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  useEffect(() => {
    if (!warning) return
    navigate(location.pathname, { replace: true, state: null })
  }, [warning, location.pathname, navigate])

  const sortedTasks = sortTasks(tasks)
  const filteredTasks = currentFilter === 'pending'
    ? sortedTasks.filter((task) => !task.completed)
    : currentFilter === 'completed'
      ? sortedTasks.filter((task) => task.completed)
      : currentFilter === 'all'
        ? sortedTasks
        : sortedTasks.filter((task) => (task.priority || DEFAULT_PRIORITY) === currentFilter)
  const allPendingTasks = sortedTasks.filter((t) => !t.completed)
  const allCompletedTasks = sortedTasks.filter((t) => t.completed)
  const visiblePendingTasks = filteredTasks.filter((t) => !t.completed)
  const visibleCompletedTasks = filteredTasks.filter((t) => t.completed)
  const showPending = currentFilter !== 'completed'
  const showCompleted = currentFilter !== 'pending'
  const showsBothStatuses = currentFilter === 'all' || TASK_PRIORITIES.includes(currentFilter as TaskPriority)

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

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) {
      setDraggedTask(null)
      return
    }

    const activeId = String(active.id)
    const activeTask = tasks.find((task) => task.id === activeId)
    if (!activeTask) {
      setDraggedTask(null)
      return
    }

    const overTask = tasks.find((task) => task.id === String(over.id))
    const targetCompleted = overTask ? overTask.completed : over.id === 'completed'
    const sourceTasks = activeTask.completed ? allCompletedTasks : allPendingTasks
    const targetTasks = targetCompleted ? allCompletedTasks : allPendingTasks
    const sourceIndex = sourceTasks.findIndex((task) => task.id === activeId)
    if (sourceIndex === -1) {
      setDraggedTask(null)
      return
    }

    if (activeTask.completed === targetCompleted) {
      const targetIndex = targetTasks.findIndex((task) => task.id === String(over.id))
      if (targetIndex === -1 || targetIndex === sourceIndex) {
        setDraggedTask(null)
        return
      }

      const reordered = arrayMove(sourceTasks, sourceIndex, targetIndex)
      await Promise.all(reordered.map((task, index) => updateTaskPlacement(task.id, index)))
      setDraggedTask(null)
      return
    }

    const nextSource = sourceTasks.filter((task) => task.id !== activeId)
    const targetIndex = overTask ? targetTasks.findIndex((task) => task.id === overTask.id) : targetTasks.length
    const nextTarget = [...targetTasks]
    nextTarget.splice(Math.max(targetIndex, 0), 0, { ...activeTask, completed: targetCompleted })

    await Promise.all([
      ...nextSource.map((task, index) => updateTaskPlacement(task.id, index)),
      ...nextTarget.map((task, index) => updateTaskPlacement(task.id, index, task.id === activeId ? targetCompleted : undefined)),
    ])
    setDraggedTask(null)
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setDraggedTask(tasks.find((task) => task.id === String(active.id)) || null)
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U'

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 pb-16">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#140d26]/70 border-b border-slate-200/80 dark:border-[#362459] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-xl tracking-tight flex items-center gap-2">
              MateCode
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30">
                Tablero
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#20153d] border border-slate-200 dark:border-[#3b276b] text-xs">
              <div className="w-5 h-5 rounded-full bg-violet-500 text-[10px] font-bold text-white flex items-center justify-center">
                {userInitial}
              </div>
              <span className="text-slate-700 dark:text-slate-300 max-w-[160px] truncate">{user?.email}</span>
            </div>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => logout()}
              title="Cerrar sesión"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#20153d] dark:hover:bg-[#2b1c52] border border-slate-200 dark:border-[#3b276b] rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {warning && (
          <div
            role="status"
            className="mb-4 flex items-start gap-3 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p className="flex-1">{warning}</p>
            <button
              type="button"
              onClick={() => setWarning(null)}
              aria-label="Descartar aviso"
              className="shrink-0 cursor-pointer rounded p-0.5 transition hover:bg-amber-200/60 dark:hover:bg-amber-900/50"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="mb-6">
          <TaskProgressSummary
            completedTasks={allCompletedTasks.length}
            pendingTasks={allPendingTasks.length}
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

        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragCancel={() => setDraggedTask(null)}
          onDragEnd={handleDragEnd}
        >
          <TaskFilters value={currentFilter} onChange={setCurrentFilter} />

          <div
            className={`grid grid-cols-1 gap-5 items-start ${
              showsBothStatuses ? 'md:grid-cols-2' : ''
            }`}
          >
          {showPending && <div className="h-full bg-white/80 dark:bg-[#1c1338]/70 border border-slate-200 dark:border-[#3b2769] rounded-2xl p-4 shadow-lg dark:shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200 dark:border-[#362459]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-violet-600 dark:text-violet-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Pendientes</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-[#2e1d57] text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20">
                {visiblePendingTasks.length}
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
                className="w-full py-2 mb-3 px-3 rounded-xl border border-dashed border-slate-300 hover:border-violet-500 dark:border-[#4d3285] dark:hover:border-violet-400 bg-slate-50/80 hover:bg-violet-50/60 dark:bg-[#251847]/40 dark:hover:bg-[#2a1b52] text-slate-600 hover:text-violet-700 dark:text-slate-300 dark:hover:text-white text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Añadir una tarea</span>
              </button>
            )}

            <TodoList
              tasks={visiblePendingTasks}
              loading={loading}
              error={error}
              onToggle={handleToggleTask}
              onEdit={(task) => setEditingTask(task)}
              onDelete={removeTask}
              onSelect={(task) => setSelectedTask(task)}
              emptyMessage="No tienes tareas pendientes."
              listId="pending"
            />
          </div>}

          {showCompleted && <div className="h-full bg-white/80 dark:bg-[#1c1338]/70 border border-slate-200 dark:border-[#3b2769] rounded-2xl p-4 shadow-lg dark:shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200 dark:border-[#362459]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Completadas</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                {visibleCompletedTasks.length}
              </span>
            </div>

            <TodoList
              tasks={visibleCompletedTasks}
              loading={loading}
              error={error}
              onToggle={handleToggleTask}
              onEdit={(task) => setEditingTask(task)}
              onDelete={removeTask}
              onSelect={(task) => setSelectedTask(task)}
              emptyMessage="Aún no has completado tareas."
              listId="completed"
            />
          </div>}
          </div>
          <DragOverlay dropAnimation={null}>
            {draggedTask ? (
              <div className="w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-violet-300/70 bg-[#302852] p-3.5 shadow-2xl shadow-black/40 ring-2 ring-violet-400/30 rotate-1">
                <p className="text-[15px] font-semibold text-white">{draggedTask.title}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                  <span className="rounded-md bg-violet-500/20 px-2 py-1">
                    {getPriorityLabel(draggedTask.priority)}
                  </span>
                  {draggedTask.dueDate && <span>{draggedTask.dueDate}</span>}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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
