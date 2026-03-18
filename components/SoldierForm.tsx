'use client'
import { useState } from 'react'
import { CATEGORIES } from '@/lib/categories'
import { Soldier } from '@/lib/supabase'

type Props = {
  initial?: Soldier
  onSubmit: (data: Partial<Soldier>) => Promise<void>
  submitLabel: string
}

export default function SoldierForm({ initial, onSubmit, submitLabel }: Props) {
  const [form, setForm] = useState({
    full_name: initial?.full_name || '',
    phone: initial?.phone || '',
    profession: initial?.profession || '',
    category: initial?.category || [] as string[],
    company_name: initial?.company_name || '',
    description: initial?.description || '',
    platoon: initial?.platoon || '',
    is_available: initial?.is_available ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat],
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.category.length === 0) {
      setError('יש לבחור לפחות קטגוריה אחת')
      return
    }
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'אירעה שגיאה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="block font-semibold mb-1">שם מלא *</label>
        <input name="full_name" value={form.full_name} onChange={handle} required className="input-field" placeholder="ישראל ישראלי" />
      </div>

      <div>
        <label className="block font-semibold mb-1">מספר טלפון *</label>
        <input name="phone" value={form.phone} onChange={handle} required className="input-field" placeholder="050-0000000" />
      </div>

      <div>
        <label className="block font-semibold mb-1">מקצוע / תפקיד *</label>
        <input name="profession" value={form.profession} onChange={handle} required className="input-field" placeholder='עו"ד, רואה חשבון, מפתח תוכנה...' />
      </div>

      <div>
        <label className="block font-semibold mb-2">קטגוריה * <span className="text-gray-400 font-normal text-sm">(ניתן לבחור יותר מאחת)</span></label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              className={`category-btn ${form.category.includes(c) ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
        {form.category.length === 0 && (
          <p className="text-xs text-gray-400 mt-1">לא נבחרה קטגוריה</p>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">פלוגה (אופציונלי)</label>
        <input name="platoon" value={form.platoon} onChange={handle} className="input-field" placeholder="למשל: פלוגה א', מטה..." />
      </div>

      <div>
        <label className="block font-semibold mb-1">מקום עבודה (אופציונלי)</label>
        <input name="company_name" value={form.company_name} onChange={handle} className="input-field" placeholder="שם החברה / מקום העבודה שלך" />
      </div>

      <div>
        <label className="block font-semibold mb-1">תיאור קצר (אופציונלי)</label>
        <textarea name="description" value={form.description} onChange={handle} className="input-field" rows={3} placeholder="איך אני יכול לעזור לגדוד/לפלוגה?" />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_available"
          id="is_available"
          checked={form.is_available}
          onChange={handle}
          className="w-5 h-5 cursor-pointer"
        />
        <label htmlFor="is_available" className="font-semibold cursor-pointer">
          אני זמין לעזור לחיילים אחרים
        </label>
      </div>

      {/* Disclaimer */}
      {!initial && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
          <p className="font-bold mb-2 text-amber-800">הצהרת המשתמש</p>
          <p>
            המידע האישי המוזן במערכת זו, לרבות שם, מספר טלפון, מקצוע ופרטים נוספים, נמסר
            על ידי המשתמש מרצונו החופשי ובאחריותו הבלעדית. מפעיל המערכת אינו אחראי
            לנכונות המידע, לעדכניותו, או לכל שימוש שייעשה בו על ידי צדדים שלישיים.
            המידע מיועד לשימוש פנימי בגדוד צורי בלבד ואין להעבירו לגורמים חיצוניים.
            בלחיצה על הכפתור להלן מאשר המשתמש כי קרא והבין את האמור לעיל.
          </p>
          <div className="flex items-start gap-3 mt-3">
            <input
              type="checkbox"
              id="disclaimer"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 cursor-pointer"
            />
            <label htmlFor="disclaimer" className="cursor-pointer font-semibold text-amber-900">
              קראתי ואני מסכים לתנאים לעיל
            </label>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary text-base py-3" disabled={loading || (!initial && !agreed)}>
        {loading ? 'שולח...' : submitLabel}
      </button>
    </form>
  )
}
