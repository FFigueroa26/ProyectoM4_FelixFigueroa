import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task, TaskInput } from '../types/task'

const TASKS_COLLECTION = 'tasks'

// 1. Suscribirse en tiempo real a las tareas de un usuario específico
export function subscribeToUserTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void,
) {
  // Consultar solo las tareas que pertenecen al usuario autenticado
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
  )

  // onSnapshot escucha cambios y devuelve una función de cancelación (unsubscribe)
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          completed: Boolean(data.completed),
          userId: data.userId,
          createdAt: data.createdAt || 0,
        }
      })

      // Ordenar en memoria por fecha más reciente
      tasks.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

      onUpdate(tasks)
    },
    (err) => {
      console.error('Error al escuchar tareas:', err)
      onError(err)
    },
  )
}

// 2. Crear una nueva tarea
export async function createTask(input: TaskInput, userId: string): Promise<string> {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    title: input.title.trim(),
    description: input.description.trim(),
    completed: false,
    userId,
    createdAt: Date.now(),
  })
  return docRef.id
}

// 3. Modificar título o descripción de una tarea existente
export async function updateTask(taskId: string, input: TaskInput): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)
  await updateDoc(taskRef, {
    title: input.title.trim(),
    description: input.description.trim(),
  })
}

// 4. Marcar tarea como completada o pendiente
export async function toggleTaskStatus(taskId: string, completed: boolean): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)
  await updateDoc(taskRef, {
    completed,
  })
}

// 5. Eliminar una tarea
export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)
  await deleteDoc(taskRef)
}
