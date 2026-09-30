import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

    const initialIsDark = document.documentElement.classList.contains('dark')

    await user.click(button)
    const toggledIsDark = document.documentElement.classList.contains('dark')
    expect(toggledIsDark).toBe(!initialIsDark)

    await user.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(initialIsDark)
  })
})
