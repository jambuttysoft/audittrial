"use client"

import { useEffect, useState } from 'react'
import UserMenu from '@/components/UserMenu'
import Image from 'next/image'
import { useUserProfile } from '@/hooks/use-user-profile'

export default function Header() {
  const { user } = useUserProfile()

  return (
<header className="sticky top-0 z-30 border-b bg-background">
  <div className="mx-auto max-w-7xl py-3 flex items-center justify-between">
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => {
        try {
          window.location.assign('/dashboard')
        } catch {}
      }}
    >
      <Image src="/trlogo.png" alt="TRAKYTT Logo" width={40} height={40} className="h-10 w-10" />

      <div className="brand-logo text-xl font-bold" style={{ color: '#09090b' }}>
        TRAKYTT
      </div>
    </div>

    <UserMenu user={user || undefined} />
  </div>
</header>

  )
}
