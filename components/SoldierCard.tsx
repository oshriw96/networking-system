import { Soldier } from '@/lib/supabase'

function formatWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const international = digits.startsWith('0') ? '972' + digits.slice(1) : digits
  return `https://wa.me/${international}`
}

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

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">{soldier.phone}</p>
        <div className="flex gap-2">
          <a
            href={`tel:${soldier.phone}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-bold text-white"
            style={{ background: 'var(--olive)' }}
          >
            📞 חיוג
          </a>
          <a
            href={formatWhatsApp(soldier.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-bold text-white"
            style={{ background: '#25D366' }}
          >
            💬 וואטסאפ
          </a>
        </div>
        {!soldier.is_available && (
          <p className="text-xs text-gray-400 text-center mt-2">לא זמין כרגע</p>
        )}
      </div>
    </div>
  )
}
