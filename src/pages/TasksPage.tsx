import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { TodoForm } from '../components/tasks/TodoForm'
import { TodoList } from '../components/tasks/TodoList'
import { TaskFilters, type FilterType } from '../components/tasks/TaskFilters'
import type { Task, TaskInput } from '../types/task'

export function TasksPage() {
  const { user, logout } = useAuth()
  const { tasks, loading, error, addTask, editTask, toggleTask, removeTask } = useTasks()

  const [currentFilter, setCurrentFilter] = useState<FilterType>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Filtrado de tareas
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'pending') return !task.completed
    if (currentFilter === 'completed') return task.completed
    return true
  })

  // Contadores para las pestañas
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }

  // Guardar tarea (crear o editar)
  const handleSaveTask = async (input: TaskInput) => {
    if (editingTask) {
      await editTask(editingTask.id, input)
      setEditingTask(null)
    } else {
      await addTask(input)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Encabezado */}
        <header className="flex justify-between items-center pb-6 mb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              MateCode - Tareas
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Sesión iniciada como:{' '}
              <span className="text-blue-400 font-medium">{user?.email}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </header>

        {/* Formulario para agregar / editar tarea */}
        <TodoForm
          key={editingTask ? editingTask.id : 'new-task'}
          onSubmit={handleSaveTask}
          initialData={
            editingTask
              ? { title: editingTask.title, description: editingTask.description }
              : undefined
          }
          isEditing={Boolean(editingTask)}
          onCancel={() => setEditingTask(null)}
        />

        {/* Pestañas de filtro con contadores */}
        <TaskFilters
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          counts={counts}
        />

        {/* Lista de tareas en tiempo real */}
        <TodoList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onToggle={toggleTask}
          onEdit={(task) => setEditingTask(task)}
          onDelete={removeTask}
        />
      </div>
    </div>
  )
}
