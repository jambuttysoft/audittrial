"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Header from '@/components/Header'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export default function ProfilePage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3645'
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name?: string;
    userType?: 'INDIVIDUAL' | 'BUSINESS';
    phone?: string;
    address?: string;
    website?: string;
    avatar?: string;
    company?: string;
    services?: string;
    isVisibleToClients?: boolean;
    acceptsJobOffers?: boolean;
    autoChargeEnabled?: boolean;
    abn?: string;
  } | null>(null);
  const [saving, setSaving] = useState(false)
  const [abnError, setAbnError] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const u = JSON.parse(raw)
        setUser(u)
      }
    } catch { }
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
            try { localStorage.setItem('user', JSON.stringify(merged)) } catch { }
            return merged
          })
        }
      } catch { }
    }
    run()
  }, [user?.id, API_BASE])

  const normalizeAbn = (input: string): string | null => {
    const digits = String(input).replace(/\D+/g, '')
    return digits.length === 11 ? digits : null
  }

  const isValidAbn = (abn: string): boolean => {
    const normalized = normalizeAbn(abn)
    if (!normalized) return false
    const nums = normalized.split('').map((n) => Number(n))
    nums[0] = nums[0] - 1
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    const sum = nums.reduce((acc, n, i) => acc + n * weights[i], 0)
    return sum % 89 === 0
  }

  const formatAuPhone = (input: string) => {
    const raw = String(input)
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    let nsn = digits
    if (nsn.startsWith('61')) nsn = nsn.slice(2)
    else if (nsn.startsWith('0')) nsn = nsn.slice(1)
    if (!nsn) return '+61'
    if (nsn.startsWith('4')) {
      const part1 = nsn.slice(0, 3) // 4xx
      const part2 = nsn.slice(3, 6) // xxx
      const part3 = nsn.slice(6, 9) // xxx
      return `+61 ${part1}${part2 ? ' ' + part2 : ''}${part3 ? ' ' + part3 : ''}`.trim()
    }
    const area = nsn.slice(0, 1) // 2,3,7,8
    const p1 = nsn.slice(1, 5)
    const p2 = nsn.slice(5, 9)
    return `+61 ${area}${p1 ? ' ' + p1 : ''}${p2 ? ' ' + p2 : ''}`.trim()
  }

  const sanitizeDomain = (s: string) => {
    const v = String(s || '').trim().toLowerCase()
    const noProto = v.replace(/^https?:\/\//, '')
    const noWww = noProto.replace(/^www\./, '')
    return noWww.replace(/\s+/g, '')
  }

  const updateField = (field: string, value: any) => {
    if (field === 'phone') {
      const f = formatAuPhone(String(value))
      setUser((prev) => ({ ...(prev as any), [field]: f }))
      return
    }
    if (field === 'abn') {
      // Mask ABN: NN NNN NNN NNN
      const d = String(value).replace(/\D/g, '')
      let f = d
      if (d.length > 11) {
        f = d.slice(0, 11)
      }
      // Apply spacing
      if (f.length > 2) {
        f = `${f.slice(0, 2)} ${f.slice(2)}`
      }
      if (f.length > 6) { // 2 + 1 + 3 = 6
        f = `${f.slice(0, 6)} ${f.slice(6)}`
      }
      if (f.length > 10) { // 6 + 1 + 3 = 10
        f = `${f.slice(0, 10)} ${f.slice(10)}`
      }
      setUser((prev) => ({ ...(prev as any), [field]: f }))
      setAbnError('')
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
      const webInput = (user.website || '').trim()
      const domain = sanitizeDomain(webInput)
      const web = domain ? `https://${domain}` : ''
      if (web) {
        const ok = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!$&'()*+,;=.]*$/.test(web)
        if (!ok) {
          toast({ title: 'Validation error', description: 'Website must be a valid domain', variant: 'destructive' })
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
        website: web,
        avatar: user.avatar,
        company: user.company,
        services: user.services,
        isVisibleToClients: !!user.isVisibleToClients,
        acceptsJobOffers: !!user.acceptsJobOffers,
        autoChargeEnabled: !!user.autoChargeEnabled,
        abn: user.abn,
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

  const handleAvatarFileChange = (file?: File) => {
    if (!file || !user?.id) return
    const allowed = new Set(['image/png','image/jpeg','image/jpg','image/webp'])
    if (!allowed.has(file.type)) {
      setUploadError('Unsupported file type')
      toast({ title: 'Avatar upload error', description: 'Unsupported file type', variant: 'destructive' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large (max 5MB)')
      toast({ title: 'Avatar upload error', description: 'File too large (max 5MB)', variant: 'destructive' })
      return
    }
    setUploadError('')
    setIsUploading(true)
    setUploadProgress(0)
    const fd = new FormData()
    fd.append('userId', user.id)
    fd.append('file', file)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE}/api/profile/avatar`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      setIsUploading(false)
      try {
        const data = JSON.parse(xhr.responseText || '{}')
        if (data?.success && data.avatarUrl) {
          const versioned = `${data.avatarUrl}${data.avatarUrl.includes('?') ? '&' : '?' }v=${Date.now()}`
          setUser(prev => ({ ...(prev as any), avatar: versioned }))
          try { localStorage.setItem('user', JSON.stringify({ ...(user as any), avatar: versioned })) } catch {}
          try { window.dispatchEvent(new Event('user-updated')) } catch {}
          toast({ title: 'Avatar updated', description: 'Profile photo uploaded successfully' })
        } else {
          setUploadError(data?.error || 'Unable to upload avatar')
          toast({ title: 'Avatar upload failed', description: data?.error || 'Unable to upload avatar', variant: 'destructive' })
        }
      } catch {
        setUploadError('Upload response parsing failed')
        toast({ title: 'Avatar upload error', description: 'Upload response parsing failed', variant: 'destructive' })
      }
    }
    xhr.onerror = () => {
      setIsUploading(false)
      setUploadError('Network error while uploading avatar')
      toast({ title: 'Avatar upload error', description: 'Network error while uploading avatar', variant: 'destructive' })
    }
    xhr.send(fd)
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal and business information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row 1: Email | Name | User Type */}
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
              {/* Row 2: ABN | Company Name | Address */}
              <div>
                <Label className="mb-1 block">ABN</Label>
                <Input
                  value={user?.abn || ''}
                  onChange={(e) => updateField('abn', e.target.value)}
                  className={abnError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  onBlur={async () => {
                    const raw = (user?.abn || '')
                    const normalized = raw.replace(/\s+/g, '')
                    if (!normalized) return
                    const localNormalized = normalizeAbn(normalized)
                    if (!localNormalized) {
                      setAbnError('ABN must contain exactly 11 digits')
                      toast({ title: 'ABN validation error', description: 'ABN must contain exactly 11 digits', variant: 'destructive' })
                      return
                    }
                    if (!isValidAbn(localNormalized)) {
                      setAbnError('Invalid ABN number')
                      toast({ title: 'ABN validation error', description: 'Invalid ABN number', variant: 'destructive' })
                      return
                    }
                    try {
                      const res = await fetch(`${API_BASE}/api/abn/validate?abn=${localNormalized}`)
                      const data = await res.json()
                      if (data?.valid) {
                        setAbnError('')
                        if (data.entityName) {
                          updateField('company', data.entityName)
                          toast({ title: 'ABN Verified', description: `Company found: ${data.entityName}` })
                        }
                      } else {
                        setAbnError('Invalid ABN provided')
                        toast({ title: 'ABN validation error', description: 'Invalid ABN provided', variant: 'destructive' })
                      }
                    } catch (e) {
                      setAbnError('Could not validate ABN')
                      toast({ title: 'ABN validation error', description: 'Could not validate ABN', variant: 'destructive' })
                    }
                  }}
                  placeholder="e.g., 12 345 678 901"
                />
                {abnError && (<p className="text-red-600 text-sm mt-1">{abnError}</p>)}
              </div>
              <div>
                <Label className="mb-1 block">Company Name</Label>
                <Input value={user?.company || ''} onChange={(e) => updateField('company', e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block">Address</Label>
                <Input value={user?.address || ''} onChange={(e) => updateField('address', e.target.value)} />
              </div>
              {/* Row 3: Phone | Website | Service */}
              <div>
                <Label className="mb-1 block">Website</Label>
                <div className="flex items-stretch rounded-md border border-input overflow-hidden">
                  <div className="px-2 bg-muted text-muted-foreground flex items-center text-sm">https://</div>
                  <Input
                    value={(user?.website || '').replace(/^https?:\/\//, '').replace(/^www\./, '')}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="example.com"
                    className="border-0 rounded-none !pl-1 flex-1"
                  />
                  <div className="px-2 flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full h-6 w-6 p-0">
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Enter site URL without WWW or http:// just example.com</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Phone</Label>
                <Input value={user?.phone || ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="+61 4xx xxx xxx" />
              </div>
              <div>
                <Label className="mb-1 block">Services</Label>
                <Input value={user?.services || ''} onChange={(e) => updateField('services', e.target.value)} />
              </div>
              {/* Row 4: Avatar | checkbox1 | checkbox2 */}
              <div>
                <Label className="mb-1 block">Avatar</Label>
                <div className="flex items-center gap-4">
                  <Image src={user?.avatar || '/trlogo.png'} alt="Avatar" width={64} height={64} className="h-16 w-16 rounded-full object-cover border" />
                  <div>
                    <input type="file" accept="image/png,image/jpeg,image/webp" disabled={isUploading} onChange={(e) => handleAvatarFileChange(e.target.files?.[0])} />
                    {isUploading && (
                      <div className="mt-2 w-48 h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-blue-600 rounded" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                    {uploadError && (<p className="text-red-600 text-sm mt-1">{uploadError}</p>)}
                  </div>
                </div>
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
      </>
  )
}
