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

export function subscribeToUserTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
  )

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
          dueDate: data.dueDate || '',
          priority: data.priority || 'medium',
        }
      })

      tasks.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

      onUpdate(tasks)
    },
    (err) => {
      console.error('Error al escuchar tareas:', err)
      onError(err)
    },
  )
}

export async function createTask(input: TaskInput, userId: string): Promise<string> {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    title: input.title.trim(),
    description: input.description.trim(),
    completed: false,
    userId,
    createdAt: Date.now(),
    dueDate: input.dueDate || '',
    priority: input.priority || 'medium',
  })
  return docRef.id
}

export async function updateTask(taskId: string, input: TaskInput): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)
  await updateDoc(taskRef, {
    title: input.title.trim(),
    description: input.description.trim(),
    dueDate: input.dueDate || '',
    priority: input.priority || 'medium',
  })
}

export async function toggleTaskStatus(taskId: string, completed: boolean): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)
  await updateDoc(taskRef, {
    completed,
  })
}

export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)
  await deleteDoc(taskRef)
}
