import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { ThemeProvider } from '../../src/features/theme/ThemeProvider'
import { ThemeToggle } from '../../src/components/common/ThemeToggle'

describe('ThemeToggle y ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('permite alternar entre modo oscuro y claro', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    // El estado inicial (por defecto oscuro)
    const initialIsDark = document.documentElement.classList.contains('dark')

    // Al hacer click debe alternar
    await user.click(button)
    const toggledIsDark = document.documentElement.classList.contains('dark')
    expect(toggledIsDark).toBe(!initialIsDark)

    // Al hacer click nuevamente debe volver
    await user.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(initialIsDark)
  })
})
