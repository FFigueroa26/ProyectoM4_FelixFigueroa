import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTask, updateTask, deleteTask } from '../../src/services/taskService'
import * as firestore from 'firebase/firestore'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
}))

vi.mock('../../src/services/firebase', () => ({
  db: {},
}))

describe('taskService - Pruebas unitarias con mocks de Firestore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createTask: debe guardar una tarea con datos limpios y retornar su ID', async () => {
    const mockInput = { title: '  Aprender Vitest  ', description: '  Practicar mocks  ' }
    const userId = 'user-123'
    const mockDocRef = { id: 'tarea-abc-1' }

    vi.mocked(firestore.addDoc).mockResolvedValueOnce(mockDocRef as never)

    const newId = await createTask(mockInput, userId)

    expect(newId).toBe('tarea-abc-1')
    expect(firestore.addDoc).toHaveBeenCalledTimes(1)
    expect(firestore.addDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        title: 'Aprender Vitest',
        description: 'Practicar mocks',
        completed: false,
        userId: 'user-123',
      }),
    )
  })

  it('updateTask: debe llamar a updateDoc con los campos actualizados', async () => {
    const taskId = 'task-456'
    const updateInput = { title: 'Nuevo título', description: 'Nueva descripción' }
    vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined as never)

    await updateTask(taskId, updateInput)

    expect(firestore.updateDoc).toHaveBeenCalledTimes(1)
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        title: 'Nuevo título',
        description: 'Nueva descripción',
      }),
    )
  })

  it('createTask (caso de error): debe propagar el error si Firestore falla', async () => {
    const mockInput = { title: 'Tarea con error', description: 'Falla simulada' }
    vi.mocked(firestore.addDoc).mockRejectedValueOnce(new Error('Fallo de conexión en Firestore'))

    await expect(createTask(mockInput, 'user-123')).rejects.toThrow('Fallo de conexión en Firestore')
  })

  it('deleteTask: debe llamar a deleteDoc con la referencia de la tarea', async () => {
    const taskId = 'task-to-delete'
    vi.mocked(firestore.deleteDoc).mockResolvedValueOnce(undefined as never)

    await deleteTask(taskId)

    expect(firestore.deleteDoc).toHaveBeenCalledTimes(1)
  })
})
