"use client"

import { useCallback, useEffect, useState } from 'react'

type UserProfile = {
  id: string
  email: string
  name?: string
  userType?: 'INDIVIDUAL' | 'BUSINESS'
  phone?: string
  address?: string
  website?: string
  avatar?: string
  company?: string
  services?: string
  isVisibleToClients?: boolean
  acceptsJobOffers?: boolean
  autoChargeEnabled?: boolean
  abn?: string
}

const readUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(() => readUser())

  useEffect(() => {
    setUser(readUser())
    const handler = () => {
      setUser(readUser())
    }
    window.addEventListener('user-updated', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('user-updated', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const updateLocalUser = useCallback((patch: Partial<UserProfile>) => {
    const current = readUser() || ({} as UserProfile)
    const next = { ...current, ...patch }
    try { localStorage.setItem('user', JSON.stringify(next)) } catch {}
    try { window.dispatchEvent(new Event('user-updated')) } catch {}
    setUser(next)
  }, [])

  return { user, updateLocalUser }
}
