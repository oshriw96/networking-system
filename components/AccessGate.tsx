'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const ACCESS_CODE = '1822'
const SESSION_KEY = 'gidud_access'

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const [granted, setGranted] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setGranted(true)
    }
    setChecked(true)
  }, [])

  const submit = () => {
    if (code === ACCESS_CODE) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setGranted(true)
    } else {
      setError(true)
      setCode('')
    }
  }

  if (!checked) return null

  if (granted) return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--cream)' }}>
      <div className="card w-full max-w-sm text-center">
        <div className="logo-wrapper mx-auto mb-4" style={{ width: 'fit-content' }}>
          <Image src="/logo.png" alt="לוגו גדוד צורי" width={80} height={80} style={{ objectFit: 'contain' }} />
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--olive-dark)' }}>רשת גדוד צורי</h1>
        <p className="text-gray-500 text-sm mb-6">מערכת נטוורקינג לחיילי המילואים</p>

        <label className="block font-semibold mb-2 text-right">קוד גישה</label>
        <input
          type="password"
          value={code}
          onChange={e => { setCode(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="הזן קוד גישה"
          className="input-field mb-3 text-center text-xl tracking-widest"
          autoFocus
        />
        {error && (
          <p className="text-red-600 text-sm mb-3">קוד שגוי, נסה שנית</p>
        )}
        <button onClick={submit} className="btn-primary w-full text-base py-3">
          כניסה
        </button>
        <p className="text-xs text-gray-400 mt-4">
          לקבלת קוד הגישה פנה למ"פ או קצין הגדוד
        </p>
      </div>
    </div>
  )
}
