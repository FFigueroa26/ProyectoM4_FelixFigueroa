import type { TaskPriority } from '../types/task'

export const DEFAULT_PRIORITY: TaskPriority = 'medium'

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

export const TASK_PRIORITIES: TaskPriority[] = ['high', 'medium', 'low']

export function getPriorityLabel(priority?: TaskPriority): string {
  return PRIORITY_LABELS[priority ?? DEFAULT_PRIORITY]
}
