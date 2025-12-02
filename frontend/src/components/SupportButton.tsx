"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

type User = { id: string }

export default function SupportButton() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      setUser(raw ? JSON.parse(raw) : null)
    } catch {
      setUser(null)
    }
    const handler = () => {
      try {
        const raw = localStorage.getItem('user')
        setUser(raw ? JSON.parse(raw) : null)
      } catch {
        setUser(null)
      }
    }
    window.addEventListener('user-updated', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('user-updated', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  if (pathname === '/') return null
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/login' || pathname === '/register'
  const shouldShow = !!user && !isAuthPage
  if (!shouldShow) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button className="rounded-full px-4 py-3 shadow-lg" variant="default" onClick={() => { try { window.location.assign('/tickets') } catch {} }}>
        <div className="text-sm leading-tight text-left">
          <div>Need Help ?</div>
          <div>Have suggestion ?</div>
        </div>
      </Button>
    </div>
  )
}
