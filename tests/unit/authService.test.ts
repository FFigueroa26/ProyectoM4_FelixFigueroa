import { describe, it, expect } from 'vitest'
import { getAuthErrorMessage } from '../../src/services/authService'

describe('getAuthErrorMessage', () => {
  it.each([
    ['auth/invalid-credential', 'Correo o contraseña incorrectos.'],
    ['auth/wrong-password', 'Correo o contraseña incorrectos.'],
    ['auth/user-not-found', 'No existe una cuenta con este correo.'],
    ['auth/email-already-in-use', 'Este correo ya está registrado.'],
    ['auth/invalid-email', 'El formato del correo electrónico no es válido.'],
    ['auth/weak-password', 'La contraseña debe tener al menos 6 caracteres.'],
    ['auth/too-many-requests', 'Demasiados intentos. Intenta más tarde.'],
    ['auth/user-disabled', 'Esta cuenta ha sido deshabilitada.'],
    ['auth/popup-closed-by-user', 'Inicio de sesión con Google cancelado.'],
    ['auth/missing-email', 'Ingresa tu correo electrónico para recuperar la contraseña.'],
  ])('traduce el código %s a un mensaje para el usuario', (code, expected) => {
    expect(getAuthErrorMessage(code)).toBe(expected)
  })

  it('devuelve un mensaje genérico ante un código desconocido', () => {
    expect(getAuthErrorMessage('auth/algo-inesperado')).toBe(
      'Ocurrió un error inesperado al autenticar.',
    )
  })

  it('devuelve un mensaje genérico si no llega ningún código', () => {
    expect(getAuthErrorMessage('')).toBe('Ocurrió un error inesperado al autenticar.')
  })
})
