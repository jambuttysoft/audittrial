"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  user?: { name?: string; email?: string; avatar?: string }
  onLogout?: () => void
}

export default function UserMenu({ user, onLogout }: Props) {
  const [mounted, setMounted] = useState(false)
  const [initial, setInitial] = useState('U')

  useEffect(() => {
    setMounted(true)
    const i = (user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U')
    setInitial(i)
  }, [user])
  const handleLogout = () => {
    if (onLogout) return onLogout()
    try { localStorage.removeItem('user') } catch {}
    window.location.href = '/'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-left">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || '/trlogo.png'} alt="avatar" />
            <AvatarFallback>
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{mounted ? (user?.name || (user?.email ? user.email.split('@')[0] : '')) : ''}</div>
            <div className="text-xs text-muted-foreground">{mounted ? (user?.email || '') : ''}</div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { try { window.location.href = '/profile' } catch {} }}>
          <User className="h-4 w-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { try { window.location.href = '/billing' } catch {} }}>
          <User className="h-4 w-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
