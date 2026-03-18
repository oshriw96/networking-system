'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import SoldierForm from '@/components/SoldierForm'
import { Soldier } from '@/lib/supabase'
import Link from 'next/link'

export default function EditPage() {
  const [phone, setPhone] = useState('')
  const [soldier, setSoldier] = useState<Soldier | null>(null)
  const [verifyError, setVerifyError] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [done, setDone] = useState(false)

  const verify = async () => {
    setVerifyError('')
    setVerifyLoading(true)
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const json = await res.json()
    setVerifyLoading(false)
    if (!res.ok) {
      setVerifyError(json.error || 'שגיאה')
    } else {
      setSoldier(json)
    }
  }

  const handleSubmit = async (data: Partial<Soldier>) => {
    const res = await fetch(`/api/soldiers/${soldier!.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'שגיאה')
    setDone(true)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="card">
          {done ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--olive-dark)' }}>
                הפרטים עודכנו!
              </h2>
              <Link href="/" className="btn-primary inline-block mt-4">
                חזור לדף הבית
              </Link>
            </div>
          ) : !soldier ? (
            <>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--olive-dark)' }}>
                עדכון פרטים
              </h2>
              <p className="text-gray-500 mb-6">הזן את מספר הטלפון שרשמת כדי למצוא את הפרטים שלך</p>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="050-0000000"
                className="input-field mb-3"
              />
              {verifyError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-3">
                  {verifyError}
                </div>
              )}
              <button onClick={verify} className="btn-primary w-full" disabled={verifyLoading}>
                {verifyLoading ? 'מחפש...' : 'המשך'}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--olive-dark)' }}>
                עדכן את הפרטים שלך
              </h2>
              <SoldierForm initial={soldier} onSubmit={handleSubmit} submitLabel="שמור שינויים" />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
