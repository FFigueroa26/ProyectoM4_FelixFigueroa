export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  userId: string
  createdAt?: number
  dueDate?: string
  priority?: TaskPriority
}

export type TaskInput = {
  title: string
  description: string
  dueDate?: string
  priority?: TaskPriority
}

export type TaskPriority = 'low' | 'medium' | 'high'
