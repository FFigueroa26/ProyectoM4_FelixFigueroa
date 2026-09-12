import { ListFilter } from 'lucide-react'

export type FilterType = 'all' | 'pending' | 'completed'

interface TaskFiltersProps {
  value: FilterType
  onChange: (value: FilterType) => void
}

const filters: Array<{ value: FilterType; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-2 mb-5 overflow-x-auto">
      <ListFilter size={15} className="text-slate-400 shrink-0" />
      <div className="flex items-center gap-1 p-1 bg-[#1c1338]/70 border border-[#3b2769] rounded-xl">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
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
      </div>
    </div>
  )
}