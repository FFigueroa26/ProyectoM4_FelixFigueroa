import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import {
  subscribeToUserTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} from '../services/taskService'
import type { Task, TaskInput } from '../types/task'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (updatedTasks) => {
        setTasks(updatedTasks)
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar las tareas. Inténtalo de nuevo.')
        setLoading(false)
      },
    )

    // Limpieza al desmontar para evitar fugas de memoria
    return () => unsubscribe()
  }, [user])

  const addTask = async (input: TaskInput) => {
    if (!user) throw new Error('Usuario no autenticado')
    await createTask(input, user.uid)
  }

  const editTask = async (taskId: string, input: TaskInput) => {
    await updateTask(taskId, input)
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    await toggleTaskStatus(taskId, completed)
  }

  const removeTask = async (taskId: string) => {
    await deleteTask(taskId)
  }

  return {
    tasks,
    loading: user ? loading : false,
    error,
    addTask,
    editTask,
    toggleTask,
    removeTask,
  }
}
