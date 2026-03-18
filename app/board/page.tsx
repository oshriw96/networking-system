'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import AccessGate from '@/components/AccessGate'
import { Announcement } from '@/lib/supabase'

function formatWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const international = digits.startsWith('0') ? '972' + digits.slice(1) : digits
  return `https://wa.me/${international}`
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: '2-digit' })
}

const NOTE_COLORS = [
  '#fef08a', // צהוב
  '#fde68a', // צהוב-כתום
  '#fef9c3', // צהוב בהיר
  '#fef3c7', // אמבר בהיר
  '#fde047', // צהוב עז
]

function getNoteColor(id: string) {
  const index = id.charCodeAt(0) % NOTE_COLORS.length
  return NOTE_COLORS[index]
}

function getRotation(id: string) {
  const chars = id.slice(0, 4)
  const num = chars.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rotations = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]
  return rotations[num % rotations.length]
}

export default function BoardPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/announcements')
    const data = await res.json()
    setAnnouncements(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchAnnouncements() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim()) { setError('יש לכתוב תוכן להודעה'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'אירעה שגיאה')
        return
      }
      setForm({ title: '', content: '', phone: '' })
      setShowForm(false)
      fetchAnnouncements()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AccessGate>
      <div className="min-h-screen">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* כותרת */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--olive-dark)' }}>
                📋 לוח מודעות
              </h2>
              <p className="text-gray-500 mt-1">משרות, הצעות, הודעות מהגדוד</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-base px-5 py-3"
            >
              + הוסף מודעה
            </button>
          </div>

          {/* לוח פקק */}
          <div
            className="rounded-2xl p-6 min-h-64"
            style={{
              background: 'linear-gradient(135deg, #8B6914 0%, #A0793A 40%, #8B6914 100%)',
              boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.3)',
              border: '6px solid #6B4F0F',
            }}
          >
            {/* טקסטורת פקק */}
            <div
              className="rounded-xl p-4 min-h-48"
              style={{
                background: `
                  radial-gradient(ellipse at 20% 30%, rgba(180,120,40,0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 60%, rgba(140,90,20,0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 80%, rgba(160,110,35,0.2) 0%, transparent 40%),
                  #B8822A
                `,
              }}
            >
              {loading ? (
                <div className="text-center py-12 text-amber-100 text-lg">טוען...</div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-16 text-amber-200">
                  <p className="text-xl mb-2">הלוח ריק</p>
                  <p className="text-sm opacity-75">לחץ על "הוסף מודעה" כדי להיות הראשון</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
                  {announcements.map(a => (
                    <div
                      key={a.id}
                      style={{
                        background: getNoteColor(a.id),
                        transform: `rotate(${getRotation(a.id)}deg)`,
                        boxShadow: '3px 4px 10px rgba(0,0,0,0.35)',
                        padding: '1.2rem 1.1rem 1rem',
                        borderRadius: '3px',
                        position: 'relative',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.04)'
                        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '6px 8px 18px rgba(0,0,0,0.4)'
                        ;(e.currentTarget as HTMLDivElement).style.zIndex = '10'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = `rotate(${getRotation(a.id)}deg) scale(1)`
                        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '3px 4px 10px rgba(0,0,0,0.35)'
                        ;(e.currentTarget as HTMLDivElement).style.zIndex = '1'
                      }}
                    >
                      {/* פין */}
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 40% 35%, #ff6b6b, #cc0000)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        zIndex: 2,
                      }} />

                      {a.title && (
                        <p className="font-bold text-base mb-2 leading-snug" style={{ color: '#2a1a00', fontFamily: 'Arial Hebrew, Arial, sans-serif' }}>
                          {a.title}
                        </p>
                      )}

                      <p className="text-sm leading-relaxed mb-3" style={{ color: '#3a2a00', whiteSpace: 'pre-wrap' }}>
                        {a.content}
                      </p>

                      {a.phone && (
                        <div className="flex gap-2 mt-2">
                          <a
                            href={`tel:${a.phone}`}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold text-white"
                            style={{ background: 'var(--olive)', opacity: 0.9 }}
                          >
                            📞 חיוג
                          </a>
                          <a
                            href={formatWhatsApp(a.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold text-white"
                            style={{ background: '#25D366', opacity: 0.9 }}
                          >
                            💬 וואטסאפ
                          </a>
                        </div>
                      )}

                      <p className="text-xs mt-2" style={{ color: '#7a6a40' }}>{formatDate(a.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* מודל הוספת מודעה */}
        {showForm && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold" style={{ color: 'var(--olive-dark)' }}>הוסף מודעה</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block font-semibold mb-1">כותרת (אופציונלי)</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="input-field"
                    placeholder='למשל: "דרוש מפתח", "הכרזה חשובה"...'
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">תוכן המודעה *</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                    className="input-field"
                    rows={4}
                    placeholder="כתוב כאן את ההודעה שלך..."
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">טלפון ליצירת קשר (אופציונלי)</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="input-field"
                    placeholder="050-0000000"
                    type="tel"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-1">
                  <button type="submit" className="btn-primary flex-1 py-3" disabled={submitting}>
                    {submitting ? 'שולח...' : 'פרסם מודעה'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-3">
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccessGate>
  )
}
