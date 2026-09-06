export type FilterType = 'all' | 'pending' | 'completed'

interface TaskFiltersProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: {
    all: number
    pending: number
    completed: number
  }
}

export function TaskFilters({ currentFilter, onFilterChange, counts }: TaskFiltersProps) {
  const filterOptions: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'Todas', count: counts.all },
    { id: 'pending', label: 'Pendientes', count: counts.pending },
    { id: 'completed', label: 'Completadas', count: counts.completed },
  ]

  return (
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
      {filterOptions.map((opt) => {
        const isActive = currentFilter === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onFilterChange(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {opt.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
