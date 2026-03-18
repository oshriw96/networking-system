'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="military-header text-white py-4 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="logo-wrapper">
            <Image
              src="/logo.png"
              alt="לוגו גדוד צורי"
              width={70}
              height={70}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">רשת גדוד צורי</h1>
            <p className="text-sm opacity-80">מערכת נטוורקינג למילואימניקים</p>
          </div>
        </div>
        <nav className="flex gap-3">
          <Link href="/" className="btn-secondary text-sm">דף הבית</Link>
          <Link href="/edit" className="btn-secondary text-sm">עדכן פרטים</Link>
          <Link href="/register" className="btn-primary text-sm" style={{ background: 'white', color: 'var(--olive)' }}>
            הוסף את עצמך
          </Link>
        </nav>
      </div>
    </header>
  )
}
