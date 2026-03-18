'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async () => {
    if (!password) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      localStorage.setItem('admin_password', password)
      router.push('/admin/dashboard')
    } else {
      setError('סיסמה שגויה')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-sm mx-auto px-4 py-16">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--olive-dark)' }}>
            כניסת אדמין
          </h2>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="סיסמה"
            className="input-field mb-4"
            autoFocus
          />
          {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
          <button onClick={login} className="btn-primary w-full" disabled={loading}>
            {loading ? 'בודק...' : 'כניסה'}
          </button>
        </div>
      </main>
    </div>
  )
}
