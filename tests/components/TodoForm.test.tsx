import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoForm } from '../../src/components/tasks/TodoForm'

describe('TodoForm - Pruebas de componente', () => {
  it('debe permitir escribir datos y llamar a onSubmit con los valores ingresados', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TodoForm onSubmit={mockOnSubmit} />)

    const titleInput = screen.getByLabelText(/Título/i)
    const descInput = screen.getByLabelText(/Descripción/i)
    const submitButton = screen.getByRole('button', { name: /Agregar Tarea/i })

    await user.type(titleInput, 'Comprar café')
    await user.type(descInput, 'Grano entero tostado medio')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Comprar café',
      description: 'Grano entero tostado medio',
      dueDate: '',
      priority: 'medium',
    })
  })

  it('caso borde: no debe llamar a onSubmit si el título está vacío y debe mostrar error', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<TodoForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /Agregar Tarea/i })

    await user.click(submitButton)

    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(
      screen.getByText(/El título de la tarea es obligatorio/i),
    ).toBeInTheDocument()
  })

  it('modo edición: debe precargar valores iniciales y llamar a onCancel al pulsar Cancelar', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    const initialData = { title: 'Tarea existente', description: 'Nota previa' }

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        initialData={initialData}
        isEditing={true}
        onCancel={mockOnCancel}
      />,
    )

    expect(screen.getByDisplayValue('Tarea existente')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Nota previa')).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })
})
