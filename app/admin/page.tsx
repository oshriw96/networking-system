'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const login = () => {
    if (!password) return
    localStorage.setItem('admin_password', password)
    router.push('/admin/dashboard')
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
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="סיסמה"
            className="input-field mb-4"
          />
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <button onClick={login} className="btn-primary w-full">כניסה</button>
        </div>
      </main>
    </div>
  )
}
