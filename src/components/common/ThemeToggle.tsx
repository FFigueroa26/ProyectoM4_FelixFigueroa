import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
        isDark
          ? 'bg-[#20153d] hover:bg-[#2b1c52] border-[#3b276b] text-amber-300 hover:text-amber-200'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-violet-600 hover:text-violet-700 shadow-sm'
      }`}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
