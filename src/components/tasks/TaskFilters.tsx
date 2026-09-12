import { useState } from 'react'
import { ChevronDown, ListFilter } from 'lucide-react'

export type FilterType = 'all' | 'pending' | 'completed' | 'high' | 'medium' | 'low'

interface TaskFiltersProps {
  value: FilterType
  onChange: (value: FilterType) => void
}

const statusFilters: Array<{ value: FilterType; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

const priorityFilters: Array<{ value: FilterType; label: string }> = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
]

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)
  const selectedPriority = priorityFilters.find((filter) => filter.value === value)

  return (
    <div className="relative z-30 flex items-center gap-2 mb-5 flex-wrap">
      <ListFilter size={15} className="text-slate-400 shrink-0" />
      <div className="flex items-center gap-1 p-1 bg-[#1c1338]/70 border border-[#3b2769] rounded-xl">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => {
              onChange(filter.value)
              setIsPriorityOpen(false)
            }}
            aria-pressed={value === filter.value}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              value === filter.value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#2a1b52]'
            }`}
          >
            {filter.label}
          </button>
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPriorityOpen((open) => !open)}
            aria-expanded={isPriorityOpen}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedPriority
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#2a1b52]'
            }`}
          >
            <span>{selectedPriority?.label || 'Prioridad'}</span>
            <ChevronDown size={13} className={`transition-transform ${isPriorityOpen ? 'rotate-180' : ''}`} />
          </button>

          {isPriorityOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-full rounded-lg border border-[#3b2769] bg-[#1c1338] p-1 shadow-xl">
              {priorityFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    onChange(filter.value)
                    setIsPriorityOpen(false)
                  }}
                  aria-pressed={value === filter.value}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    value === filter.value
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:bg-[#2a1b52] hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}