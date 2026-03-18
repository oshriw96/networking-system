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
    category: initial?.category || '',
    company_name: initial?.company_name || '',
    description: initial?.description || '',
    platoon: initial?.platoon || '',
    is_available: initial?.is_available ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
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
        <input name="profession" value={form.profession} onChange={handle} required className="input-field" placeholder="עו&quot;ד, רואה חשבון, מפתח תוכנה..." />
      </div>

      <div>
        <label className="block font-semibold mb-1">קטגוריה *</label>
        <select name="category" value={form.category} onChange={handle} required className="input-field">
          <option value="">בחר קטגוריה...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">פלוגה (אופציונלי)</label>
        <input name="platoon" value={form.platoon} onChange={handle} className="input-field" placeholder="למשל: פלוגה א', מטה..." />
      </div>

      <div>
        <label className="block font-semibold mb-1">שם חברה (אופציונלי)</label>
        <input name="company_name" value={form.company_name} onChange={handle} className="input-field" placeholder="שם החברה שאתה עובד בה" />
      </div>

      <div>
        <label className="block font-semibold mb-1">תיאור קצר (אופציונלי)</label>
        <textarea name="description" value={form.description} onChange={handle} className="input-field" rows={3} placeholder="במה אתה יכול לעזור לחיילים אחרים?" />
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary text-base py-3" disabled={loading}>
        {loading ? 'שולח...' : submitLabel}
      </button>
    </form>
  )
}
