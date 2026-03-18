'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="military-header text-white py-4 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="logo-wrapper">
            <Image
              src="/logo.png"
              alt="לוגו גדוד צורי"
              width={55}
              height={55}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">רשת גדוד צורי</h1>
            <p className="text-xs opacity-80 hidden sm:block">מערכת נטוורקינג למילואימניקים</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-2">
          <Link href="/" className="btn-secondary text-sm">דף הבית</Link>
          <Link href="/board" className="btn-secondary text-sm">לוח מודעות</Link>
          <Link href="/edit" className="btn-secondary text-sm">עדכן פרטים</Link>
          <Link href="/register" className="text-sm font-bold px-4 py-2 rounded-lg" style={{ background: 'white', color: 'var(--olive)' }}>
            הוסף את עצמך
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-white text-2xl p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 flex flex-col gap-2 px-4 pb-3">
          <Link href="/" className="btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>דף הבית</Link>
          <Link href="/board" className="btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>לוח מודעות</Link>
          <Link href="/edit" className="btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>עדכן פרטים</Link>
          <Link href="/register" className="text-sm font-bold px-4 py-2 rounded-lg text-center" style={{ background: 'white', color: 'var(--olive)' }} onClick={() => setMenuOpen(false)}>
            הוסף את עצמך
          </Link>
        </div>
      )}
    </header>
  )
}
