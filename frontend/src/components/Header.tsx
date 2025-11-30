"use client"

import { useEffect, useState } from 'react'
import UserMenu from '@/components/UserMenu'

export default function Header() {
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null)
  useEffect(() => {
    try { const raw = localStorage.getItem('user'); if (raw) setUser(JSON.parse(raw)) } catch {}
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { try { window.location.assign('/') } catch {} }}>
          <div className="brand-logo text-xl font-bold" style={{ color: '#09090b' }}>TRAKYTT</div>
        </div>
        <UserMenu user={user || undefined} />
      </div>
    </header>
  )
}

