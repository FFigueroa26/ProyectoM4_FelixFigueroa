import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import { auth } from './firebase'

export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'El formato del correo electrónico no es válido.'
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.'
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado.'
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    case 'auth/popup-closed-by-user':
      return 'Inicio de sesión con Google cancelado.'
    case 'auth/cancelled-popup-request':
      return 'La solicitud de inicio de sesión con Google fue cancelada.'
    case 'auth/popup-blocked':
      return 'El navegador bloqueó la ventana emergente. Permitela para iniciar sesión con Google.'
    case 'auth/unauthorized-domain':
      return 'Este dominio no está autorizado para iniciar sesión con Google. Agrégalo en Firebase (Authentication > Authorized domains).'
    case 'auth/operation-not-allowed':
      return 'El inicio de sesión con Google no está habilitado. Actívalo en Firebase (Authentication > Sign-in method).'
    case 'auth/network-request-failed':
      return 'Hubo un problema de conexión. Inténtalo de nuevo.'
    default:
      return `Ocurrió un error inesperado al autenticar. (${code})`
  }
}

export async function loginWithEmail(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass)
}

export async function registerWithEmail(email: string, pass: string) {
  return createUserWithEmailAndPassword(auth, email, pass)
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export async function logoutUser() {
  return signOut(auth)
}
