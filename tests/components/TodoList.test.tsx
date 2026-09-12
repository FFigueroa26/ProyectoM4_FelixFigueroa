import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { TodoList } from '../../src/components/tasks/TodoList'
import type { Task } from '../../src/types/task'

const taskCallbacks = {
  onToggle: vi.fn().mockResolvedValue(undefined),
  onEdit: vi.fn(),
  onDelete: vi.fn().mockResolvedValue(undefined),
}

const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Preparar presentación',
    description: 'Revisar las diapositivas',
    completed: false,
    userId: 'user-1',
    createdAt: 1,
  },
]

describe('TodoList - Pruebas de componente', () => {
  it('debe mostrar el estado de carga', () => {
    render(<TodoList tasks={[]} loading={true} error={null} {...taskCallbacks} />)

    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument()
  })

  it('debe mostrar el mensaje de error', () => {
    render(
      <TodoList
        tasks={[]}
        loading={false}
        error="No se pudieron cargar las tareas."
        {...taskCallbacks}
      />,
    )

    expect(screen.getByText('No se pudieron cargar las tareas.')).toBeInTheDocument()
  })

  it('debe mostrar el mensaje configurado cuando no hay tareas', () => {
    render(
      <TodoList
        tasks={[]}
        loading={false}
        error={null}
        emptyMessage="No tienes tareas pendientes."
        {...taskCallbacks}
      />,
    )

    expect(screen.getByText('No tienes tareas pendientes.')).toBeInTheDocument()
  })

  it('debe renderizar las tareas recibidas', () => {
    render(<TodoList tasks={tasks} loading={false} error={null} {...taskCallbacks} />)

    expect(screen.getByText('Preparar presentación')).toBeInTheDocument()
    expect(screen.getByText('Revisar las diapositivas')).toBeInTheDocument()
  })
})
