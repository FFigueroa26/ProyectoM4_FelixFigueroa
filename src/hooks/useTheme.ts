import { useContext } from 'react'
import { ThemeContext } from '../features/theme/themeContext'
import type { ThemeContextType } from '../types/theme'

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return context
}
