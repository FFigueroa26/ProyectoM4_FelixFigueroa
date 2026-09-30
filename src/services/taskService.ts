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
import { DEFAULT_PRIORITY } from '../utils/priority'
import type { Task, TaskInput } from '../types/task'

const TASKS_COLLECTION = 'tasks'

function toTaskFields(input: TaskInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    dueDate: input.dueDate || '',
    priority: input.priority || DEFAULT_PRIORITY,
  }
}

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
          order: typeof data.order === 'number' ? data.order : undefined,
          dueDate: data.dueDate || '',
          priority: data.priority || DEFAULT_PRIORITY,
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

export async function createTask(input: TaskInput, userId: string, order: number): Promise<string> {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    ...toTaskFields(input),
    completed: false,
    userId,
    createdAt: Date.now(),
    order,
  })
  return docRef.id
}

export async function updateTask(taskId: string, input: TaskInput): Promise<void> {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), toTaskFields(input))
}

export async function toggleTaskStatus(taskId: string, completed: boolean): Promise<void> {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), { completed })
}

export async function updateTaskPlacement(
  taskId: string,
  order: number,
  completed?: boolean,
): Promise<void> {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
    order,
    ...(completed === undefined ? {} : { completed }),
  })
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, TASKS_COLLECTION, taskId))
}
