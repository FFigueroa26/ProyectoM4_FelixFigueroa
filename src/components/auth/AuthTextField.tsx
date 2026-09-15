import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface AuthTextFieldProps {
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  autoComplete: string
  icon: LucideIcon
  onChange: (value: string) => void
  autoFocus?: boolean
}

export function AuthTextField({
  id,
  label,
  type,
  placeholder,
  value,
  autoComplete,
  icon: Icon,
  onChange,
  autoFocus = false,
}: AuthTextFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const inputType = type === 'password' && isVisible ? 'text' : type

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={`w-full pl-10 ${type === 'password' ? 'pr-10' : 'pr-3.5'} py-2.5 bg-[#171424] border border-[#393456] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
