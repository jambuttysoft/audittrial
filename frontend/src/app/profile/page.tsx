"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import UserMenu from '@/components/UserMenu'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3645'
  const [user, setUser] = useState<{ id: string; email: string; name?: string; userType?: 'INDIVIDUAL' | 'BUSINESS'; phone?: string; address?: string; website?: string; avatar?: string; company?: string; services?: string; isVisibleToClients?: boolean; acceptsJobOffers?: boolean } | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const u = JSON.parse(raw)
        setUser(u)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        if (!user?.id) return
        const r = await fetch(`${API_BASE}/api/profile?userId=${user.id}`)
        const data = await r.json()
        if (data?.success && data.profile) {
          setUser((prev) => {
            const merged: any = { ...(prev as any), ...data.profile }
            try { localStorage.setItem('user', JSON.stringify(merged)) } catch {}
            return merged
          })
        }
      } catch {}
    }
    run()
  }, [user?.id, API_BASE])

  const updateField = (field: string, value: any) => {
    if (field === 'phone') {
      const d = String(value).replace(/\D/g, '')
      let f = d
      if (d.startsWith('0') && d.length > 10) {
        f = `+${d}`
      } else if (d.length <= 3) {
        f = d
      } else if (d.length <= 6) {
        f = `(${d.slice(0,3)}) ${d.slice(3)}`
      } else if (d.length <= 10) {
        f = `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
      } else {
        f = `+${d}`
      }
      setUser((prev) => ({ ...(prev as any), [field]: f }))
      return
    }
    setUser((prev) => ({ ...(prev as any), [field]: value }))
  }

  const save = async () => {
    if (!user?.id) return
    setSaving(true)
    try {
      const nm = (user.name || '').trim()
      if (nm && nm.length < 2) {
        toast({ title: 'Validation error', description: 'Name must be at least 2 characters', variant: 'destructive' })
        setSaving(false)
        return
      }
      const web = (user.website || '').trim()
      if (web) {
        const ok = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!$&'()*+,;=.]*$/.test(web)
        if (!ok) {
          toast({ title: 'Validation error', description: 'Website must start with http(s) and be valid', variant: 'destructive' })
          setSaving(false)
          return
        }
      }
      const ph = (user.phone || '').replace(/\D/g, '')
      if (ph && ph.length < 10) {
        toast({ title: 'Validation error', description: 'Phone must contain at least 10 digits', variant: 'destructive' })
        setSaving(false)
        return
      }
      const payload = {
        userId: user.id,
        name: user.name,
        userType: user.userType,
        phone: user.phone,
        address: user.address,
        website: user.website,
        avatar: user.avatar,
        company: user.company,
        services: user.services,
        isVisibleToClients: !!user.isVisibleToClients,
        acceptsJobOffers: !!user.acceptsJobOffers,
      }
      const r = await fetch(`${API_BASE}/api/profile/update`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await r.json()
      if (data?.success && data.profile) {
        setUser((prev) => ({ ...(prev as any), ...data.profile }))
        localStorage.setItem('user', JSON.stringify({ ...(user as any), ...data.profile }))
        toast({ title: 'Profile updated', description: 'Your changes have been saved' })
      } else {
        toast({ title: 'Update failed', description: 'Unable to save changes', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Update error', description: 'An error occurred while saving', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xl font-semibold tracking-wide cursor-pointer" onClick={() => { try { window.location.href = '/dashboard' } catch {} }}>
          TRAKYYT
        </div>
        <div className="flex items-center space-x-4">
          <UserMenu user={{ name: user?.name, email: user?.email }} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal and business information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div>
              <Label className="mb-1 block">Name</Label>
              <Input value={user?.name || ''} onChange={(e) => updateField('name', e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block">User Type</Label>
              <select className="border rounded h-10 px-3 w-full" value={user?.userType || 'INDIVIDUAL'} onChange={(e) => updateField('userType', e.target.value)}>
                <option value="INDIVIDUAL">INDIVIDUAL</option>
                <option value="BUSINESS">BUSINESS</option>
              </select>
            </div>
            <div>
              <Label className="mb-1 block">Phone</Label>
              <Input value={user?.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-1 block">Address</Label>
              <Input value={user?.address || ''} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block">Website</Label>
              <Input value={user?.website || ''} onChange={(e) => updateField('website', e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block">Avatar URL</Label>
              <Input value={user?.avatar || ''} onChange={(e) => updateField('avatar', e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block">Company</Label>
              <Input value={user?.company || ''} onChange={(e) => updateField('company', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-1 block">Services</Label>
              <Input value={user?.services || ''} onChange={(e) => updateField('services', e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={!!user?.isVisibleToClients} onChange={(e) => updateField('isVisibleToClients', e.target.checked)} />
              <Label>Visible to clients</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={!!user?.acceptsJobOffers} onChange={(e) => updateField('acceptsJobOffers', e.target.checked)} />
              <Label>Accepts job offers</Label>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={save}>{saving ? 'Saving…' : 'Save Changes'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
