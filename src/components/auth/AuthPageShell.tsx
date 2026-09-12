import type { ReactNode } from 'react'
import { CheckSquare } from 'lucide-react'

interface AuthPageShellProps {
  brandSubtitle: string
  title: string
  description: string
  error: string | null
  children: ReactNode
  footer: ReactNode
}

export function AuthPageShell({
  brandSubtitle,
  title,
  description,
  error,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 text-white mb-3 shadow-md shadow-violet-600/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">MateCode</h1>
          <p className="text-xs text-slate-400 mt-1">{brandSubtitle}</p>
        </div>

        <div className="bg-[#221e35] border border-[#393456] rounded-2xl p-7 sm:p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
          <p className="text-xs text-slate-400 mb-6">{description}</p>

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
