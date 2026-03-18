'use client'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import SoldierCard from '@/components/SoldierCard'
import AccessGate from '@/components/AccessGate'
import { CATEGORIES } from '@/lib/categories'
import { Soldier } from '@/lib/supabase'
import Link from 'next/link'

export default function HomePage() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('הכל')
  const [loading, setLoading] = useState(true)

  const fetchSoldiers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'הכל') params.set('category', category)
    if (search) params.set('search', search)

    const res = await fetch(`/api/soldiers?${params}`)
    const data = await res.json()
    setSoldiers(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [category, search])

  useEffect(() => {
    const timeout = setTimeout(fetchSoldiers, 300)
    return () => clearTimeout(timeout)
  }, [fetchSoldiers])

  return (
    <AccessGate>
      <div className="min-h-screen">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Hero */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--olive-dark)' }}>
              מצא את הקשרים שלך בגדוד
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              חיילי גדוד צורי שמוכנים לעזור — בעסקים, בקריירה, ובכל תחום
            </p>
            <Link href="/register" className="btn-secondary inline-block">
              הוסף את עצמך לרשת ←
            </Link>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חפש לפי שם, מקצוע, חברה..."
              className="input-field text-lg py-3"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`category-btn ${category === 'הכל' ? 'active' : ''}`}
              onClick={() => setCategory('הכל')}
            >
              הכל
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`category-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">טוען...</div>
          ) : soldiers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">לא נמצאו תוצאות</p>
              <Link href="/register" className="btn-primary inline-block">
                הצטרף לרשת
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{soldiers.length} חיילים נמצאו</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {soldiers.map(s => <SoldierCard key={s.id} soldier={s} />)}
              </div>
            </>
          )}

          {/* Footer links */}
          <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center text-sm text-gray-400">
            <Link href="/edit" className="hover:text-gray-600">עדכן את הפרטים שלך</Link>
            <Link href="/admin" className="hover:text-gray-600">כניסת אדמין</Link>
          </div>
        </main>
      </div>
    </AccessGate>
  )
}
