export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  userId: string
  createdAt?: number
}

export type TaskInput = {
  title: string
  description: string
}
