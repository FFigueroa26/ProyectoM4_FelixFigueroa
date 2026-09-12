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
}: AuthTextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          className="w-full pl-10 pr-3.5 py-2.5 bg-[#171424] border border-[#393456] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition"
        />
      </div>
    </div>
  )
}
