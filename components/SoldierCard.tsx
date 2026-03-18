import { Soldier } from '@/lib/supabase'

export default function SoldierCard({ soldier }: { soldier: Soldier }) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold" style={{ color: 'var(--olive-dark)' }}>
          {soldier.full_name}
        </h3>
        <span className="category-badge">{soldier.category}</span>
      </div>

      <p className="font-semibold text-gray-700 mb-1">{soldier.profession}</p>

      {soldier.platoon && (
        <p className="text-sm text-gray-500 mb-1">🪖 {soldier.platoon}</p>
      )}

      {soldier.company_name && (
        <p className="text-sm text-gray-500 mb-2">🏢 {soldier.company_name}</p>
      )}

      {soldier.description && (
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{soldier.description}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <a
          href={`tel:${soldier.phone}`}
          className="flex items-center gap-2 font-bold text-sm"
          style={{ color: 'var(--olive)' }}
        >
          📞 {soldier.phone}
        </a>
        {!soldier.is_available && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            לא זמין כרגע
          </span>
        )}
      </div>
    </div>
  )
}
