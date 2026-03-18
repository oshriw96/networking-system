'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import SoldierForm from '@/components/SoldierForm'
import { Soldier } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const [done, setDone] = useState(false)

  const handleSubmit = async (data: Partial<Soldier>) => {
    const res = await fetch('/api/soldiers', {
      method: 'POST',
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
                נרשמת בהצלחה!
              </h2>
              <p className="text-gray-600 mb-6">הפרטים שלך נוספו לרשת הגדוד</p>
              <Link href="/" className="btn-primary inline-block">
                חזור לדף הבית
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--olive-dark)' }}>
                הצטרף לרשת הגדוד
              </h2>
              <SoldierForm onSubmit={handleSubmit} submitLabel="הצטרף לרשת" />
              <p className="text-sm text-gray-400 mt-4 text-center">
                כבר רשום?{' '}
                <Link href="/edit" className="underline" style={{ color: 'var(--olive)' }}>
                  עדכן את הפרטים שלך
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
