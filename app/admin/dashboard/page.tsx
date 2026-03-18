'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { Soldier, Announcement } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'soldiers' | 'announcements'>('soldiers')
  const [soldiers, setSoldiers] = useState<Soldier[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const p = localStorage.getItem('admin_password') || ''
    setPassword(p)
    fetchSoldiers()
    fetchAnnouncements()
  }, [])

  const fetchSoldiers = async () => {
    setLoading(true)
    const res = await fetch('/api/soldiers')
    const data = await res.json()
    setSoldiers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/announcements')
    const data = await res.json()
    setAnnouncements(Array.isArray(data) ? data : [])
  }

  const deleteSoldier = async (id: string, name: string) => {
    if (!confirm(`האם למחוק את ${name}?`)) return
    const res = await fetch(`/api/soldiers/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      setSoldiers(prev => prev.filter(s => s.id !== id))
    } else {
      alert('שגיאה במחיקה — בדוק את הסיסמה')
    }
  }

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('האם למחוק מודעה זו?')) return
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      setAnnouncements(prev => prev.filter(a => a.id !== id))
    } else {
      alert('שגיאה במחיקה')
    }
  }

  const exportExcel = async () => {
    const res = await fetch('/api/export', {
      headers: { 'x-admin-password': password },
    })
    if (!res.ok) { alert('שגיאה בייצוא'); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gidud-tzuri-network.csv'
    a.click()
  }

  const filtered = soldiers.filter(s =>
    s.full_name.includes(search) ||
    s.profession.includes(search) ||
    (s.company_name || '').includes(search) ||
    s.phone.includes(search)
  )

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--olive-dark)' }}>פאנל אדמין</h2>
            <p className="text-gray-500">{soldiers.length} חיילים במערכת</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportExcel} className="btn-secondary">ייצוא לאקסל</button>
            <Link href="/" className="btn-primary">חזור לאתר</Link>
          </div>
        </div>

        {/* טאבים */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('soldiers')}
            className={`category-btn ${tab === 'soldiers' ? 'active' : ''}`}
          >
            חיילים ({soldiers.length})
          </button>
          <button
            onClick={() => setTab('announcements')}
            className={`category-btn ${tab === 'announcements' ? 'active' : ''}`}
          >
            מודעות ({announcements.length})
          </button>
        </div>

        {/* טאב חיילים */}
        {tab === 'soldiers' && (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="חפש לפי שם, טלפון, מקצוע..."
                className="input-field"
              />
            </div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">טוען...</div>
            ) : (
              <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--olive)', color: 'white' }}>
                      <th className="p-3 text-right">שם מלא</th>
                      <th className="p-3 text-right">טלפון</th>
                      <th className="p-3 text-right">מקצוע</th>
                      <th className="p-3 text-right">קטגוריה</th>
                      <th className="p-3 text-right">מקום עבודה</th>
                      <th className="p-3 text-right">זמין</th>
                      <th className="p-3 text-right">תאריך</th>
                      <th className="p-3 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 font-semibold">{s.full_name}</td>
                        <td className="p-3">{s.phone}</td>
                        <td className="p-3">{s.profession}</td>
                        <td className="p-3">
                          <span className="category-badge text-xs">{s.category}</span>
                        </td>
                        <td className="p-3">{s.company_name || '—'}</td>
                        <td className="p-3">{s.is_available ? '✅' : '❌'}</td>
                        <td className="p-3 text-gray-400">
                          {new Date(s.created_at).toLocaleDateString('he-IL')}
                        </td>
                        <td className="p-3">
                          <button onClick={() => deleteSoldier(s.id, s.full_name)} className="btn-danger text-xs">
                            מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="text-center py-8 text-gray-400">לא נמצאו תוצאות</p>
                )}
              </div>
            )}
          </>
        )}

        {/* טאב מודעות */}
        {tab === 'announcements' && (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--olive)', color: 'white' }}>
                  <th className="p-3 text-right">כותרת</th>
                  <th className="p-3 text-right">תוכן</th>
                  <th className="p-3 text-right">טלפון</th>
                  <th className="p-3 text-right">תאריך</th>
                  <th className="p-3 text-right">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((a, i) => (
                  <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-semibold">{a.title || '—'}</td>
                    <td className="p-3 max-w-xs">
                      <p className="truncate" title={a.content}>{a.content}</p>
                    </td>
                    <td className="p-3">{a.phone || '—'}</td>
                    <td className="p-3 text-gray-400">
                      {new Date(a.created_at).toLocaleDateString('he-IL')}
                    </td>
                    <td className="p-3">
                      <button onClick={() => deleteAnnouncement(a.id)} className="btn-danger text-xs">
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {announcements.length === 0 && (
              <p className="text-center py-8 text-gray-400">אין מודעות</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
