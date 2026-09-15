import type { ReactNode } from 'react'
import { CheckSquare } from 'lucide-react'

interface AuthPageShellProps {
  title: string
  description: string
  error: string | null
  children: ReactNode
  footer: ReactNode
}

export function AuthPageShell({
  title,
  description,
  error,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
          <CheckSquare className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">MateCode</h1>
      </div>

      <div className="w-full max-w-md -translate-y-3 sm:-translate-y-5">
        <div className="bg-[#221e35] border border-[#393456] rounded-2xl p-7 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
            <p className="text-sm text-slate-400">{description}</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {children}
          {footer}
        </div>
      </div>
    </div>
  )
}
