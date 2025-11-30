'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Plus, FileImage, FileText, FileArchive, FileCode, FileVideo, FileAudio, File } from 'lucide-react'
import Header from '@/components/Header'

type Ticket = {
  id: string
  userId: string
  type: string
  subject: string
  body: string
  status: string
  createdAt: string
  updatedAt: string
  replies?: TicketReply[]
}

type TicketReply = {
  id: string
  ticketId: string
  userId: string
  body: string
  createdAt: string
  updatedAt: string
}

export default function TicketsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [activeTab, setActiveTab] = useState<'OPEN' | 'CLOSED'>('OPEN')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createType, setCreateType] = useState<'PROBLEM' | 'ADVICE' | 'QUESTION'>('QUESTION')
  const [createSubject, setCreateSubject] = useState('')
  const [createBody, setCreateBody] = useState('')
  const [createFiles, setCreateFiles] = useState<File[]>([])
  const [replyBody, setReplyBody] = useState('')
  const [replyFiles, setReplyFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const loadTickets = async () => {
    setIsLoading(true)
    try {
      const r = await fetch('/api/tickets', { credentials: 'include' })
      const payload = await r.json()
      const list: Ticket[] = payload?.data?.tickets || payload?.tickets || []
      const filtered = user ? list.filter(t => t.userId === user.id) : list
      setTickets(filtered)
    } catch {
      toast({ title: 'Error', description: 'Failed to load tickets', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [user?.id])

  useEffect(() => {
    if (!selectedTicketId) return
    ;(async () => {
      try {
        const r = await fetch(`/api/tickets/${selectedTicketId}`, { credentials: 'include' })
        const payload = await r.json()
        const t: Ticket | undefined = payload?.data?.ticket || payload?.ticket
        setSelectedTicket(t || null)
      } catch {}
    })()
  }, [selectedTicketId])

  const visibleTickets = useMemo(() => tickets.filter(t => t.status.toUpperCase() === activeTab), [tickets, activeTab])

  const computedStatusLabel = (t: Ticket) => {
    const s = t.status.toUpperCase()
    if (s === 'CLOSED') return 'Closed'
    const last = t.replies && t.replies.length ? t.replies[t.replies.length - 1] : null
    if (last) {
      if (user && last.userId !== user.id) return 'Awaiting User Reply'
      return 'In Progress'
    }
    return 'Open'
  }

  const iconForAttachment = (mime?: string, name?: string) => {
    const m = (mime || '').toLowerCase()
    const ext = (name || '').toLowerCase()
    if (m.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|bmp)$/.test(ext)) return FileImage
    if (m === 'application/pdf' || /\.pdf$/.test(ext)) return FileText
    if (/\.(zip|rar|7z|tar|gz)$/.test(ext)) return FileArchive
    if (/\.(mp4|mov|avi|mkv|webm)$/.test(ext)) return FileVideo
    if (/\.(mp3|wav|aac|flac|ogg)$/.test(ext)) return FileAudio
    if (/\.(js|ts|tsx|json|md|py|rb|java|c|cpp|go)$/.test(ext)) return FileCode
    return File
  }

  const downloadUrl = (id: string) => `/api/tickets/attachments/${id}/download`

  const statusBadgeVariant = (label: string) => {
    const map: Record<string, any> = {
      'Open': 'default',
      'In Progress': 'secondary',
      'Awaiting User Reply': 'outline',
      'Closed': 'destructive'
    }
    return map[label] || 'secondary'
  }

  const onCreateFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setCreateFiles(prev => [...prev, ...files])
  }

  const removeCreateFile = (idx: number) => {
    setCreateFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const onReplyFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setReplyFiles(prev => [...prev, ...files])
  }

  const removeReplyFile = (idx: number) => {
    setReplyFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const submitCreate = async () => {
    if (isBusy) return
    setIsBusy(true)
    if (!user?.id || !createSubject.trim() || !createBody.trim()) {
      toast({ title: 'Check fields', description: 'Type, subject and description are required', variant: 'destructive' })
      setIsBusy(false)
      return
    }
    try {
      const r = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user.id, type: createType, subject: createSubject, body: createBody })
      })
      const payload = await r.json()
      if (!r.ok) throw new Error(payload?.message || 'Failed to create ticket')
      setIsCreateOpen(false)
      setCreateSubject('')
      setCreateBody('')
      const newTicket: Ticket | undefined = payload?.data?.ticket || payload?.ticket
      if (newTicket?.id && createFiles.length) {
        const fd = new FormData()
        fd.append('userId', user.id)
        for (const f of createFiles) fd.append('files', f)
        const up = await fetch(`/api/tickets/${newTicket.id}/attachments`, { method: 'POST', credentials: 'include', body: fd })
        if (!up.ok) {
          const pl = await up.json()
          throw new Error(pl?.message || 'Failed to upload files')
        }
      }
      setCreateFiles([])
      await loadTickets()
      if (newTicket?.id) setSelectedTicketId(newTicket.id)
      toast({ title: 'Created', description: 'Ticket created successfully' })
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to create ticket', variant: 'destructive' })
    } finally { setIsBusy(false) }
  }

  const submitReply = async () => {
    if (isBusy) return
    setIsBusy(true)
    if (!user?.id || !selectedTicketId || !replyBody.trim()) return
    try {
      const fd = new FormData()
      fd.append('userId', user.id)
      fd.append('body', replyBody)
      for (const f of replyFiles) fd.append('files', f)
      const r = await fetch(`/api/tickets/${selectedTicketId}/replies`, { method: 'POST', credentials: 'include', body: fd })
      const payload = await r.json()
      if (!r.ok) throw new Error(payload?.message || 'Failed to send reply')
      setReplyBody('')
      setReplyFiles([])
      const rt = await fetch(`/api/tickets/${selectedTicketId}`, { credentials: 'include' })
      const pl = await rt.json()
      const t: Ticket | undefined = pl?.data?.ticket || pl?.ticket
      setSelectedTicket(t || null)
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to send reply', variant: 'destructive' })
    } finally { setIsBusy(false) }
  }

  const closeTicket = async () => {
    if (isBusy) return
    setIsBusy(true)
    if (!selectedTicketId) return
    try {
      const r = await fetch(`/api/tickets/${selectedTicketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'CLOSED' })
      })
      const payload = await r.json()
      if (!r.ok) throw new Error(payload?.message || 'Failed to update status')
      await loadTickets()
      const rt = await fetch(`/api/tickets/${selectedTicketId}`, { credentials: 'include' })
      const pl = await rt.json()
      const t: Ticket | undefined = pl?.data?.ticket || pl?.ticket
      setSelectedTicket(t || null)
      toast({ title: 'Status updated', description: 'Ticket closed' })
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to update status', variant: 'destructive' })
    } finally { setIsBusy(false) }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Tickets</h1>
            <p className="text-sm text-muted-foreground">Manage tickets and communicate with support</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} disabled={isBusy}><Plus className="h-4 w-4 mr-2" />Create New Ticket</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[calc(100vh-140px)]">
          <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
              <CardDescription>Open and archived tickets</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[60vh] flex flex-col">
              <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                <TabsList className="w-full">
                  <TabsTrigger value="OPEN" className="flex-1">Open</TabsTrigger>
                  <TabsTrigger value="CLOSED" className="flex-1">Archived</TabsTrigger>
                </TabsList>
                <TabsContent value="OPEN">
                  <div className="space-y-2 mt-4 flex-1">
                    {visibleTickets.map(t => {
                      const label = computedStatusLabel(t)
                      return (
                        <Card key={t.id} className="cursor-pointer" onClick={() => setSelectedTicketId(t.id)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">{t.subject}</div>
                              <Badge variant={statusBadgeVariant(label)}>{label}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Type: {t.type} · Updated: {new Date(t.updatedAt).toLocaleString()}</div>
                          </CardContent>
                        </Card>
                      )
                    })}
                    {!visibleTickets.length && (
                      <div className="text-sm text-muted-foreground h-full flex items-center">No open tickets</div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="CLOSED">
                  <div className="space-y-2 mt-4 flex-1">
                    {visibleTickets.map(t => (
                      <Card key={t.id} className="cursor-pointer" onClick={() => setSelectedTicketId(t.id)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{t.subject}</div>
                            <Badge variant={statusBadgeVariant('Closed')}>Closed</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Type: {t.type} · Updated: {new Date(t.updatedAt).toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    ))}
                    {!visibleTickets.length && (
                      <div className="text-sm text-muted-foreground h-full flex items-center">Archive is empty</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          </div>

          <div className="md:col-span-2">
          {!selectedTicketId ? (
            <Card>
              <CardHeader className="min-h-[60vh] flex items-center">
                <CardTitle>Select a ticket</CardTitle>
                <CardDescription>Select a ticket from the list to view details</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedTicket?.subject || '...'}</CardTitle>
                    <CardDescription>
                      Status: <Badge className="ml-1" variant={statusBadgeVariant(selectedTicket ? computedStatusLabel(selectedTicket) : 'Open')}>{selectedTicket ? computedStatusLabel(selectedTicket) : 'Open'}</Badge>
                    </CardDescription>
                    <div className="text-xs text-muted-foreground mt-1">Created: {selectedTicket?.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : ''} · Type: {selectedTicket?.type}</div>
                  </div>
                  {selectedTicket?.status?.toUpperCase() !== 'CLOSED' && (
                    <Button variant="outline" onClick={closeTicket}>Close Ticket</Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray((selectedTicket as any)?.attachments) && (selectedTicket as any).attachments.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Ticket attachments</div>
                      <div className="flex flex-wrap gap-3">
                        {((selectedTicket as any).attachments as any[]).map((a) => {
                          const Icon = iconForAttachment(a.mimeType, a.fileName)
                          const url = downloadUrl(a.id)
                          const isImage = (a.mimeType || '').toLowerCase().startsWith('image/')
                          return (
                            <div key={a.id} className="w-[96px]">
                              <a href={url} target="_blank" rel="noreferrer" className="block">
                                <div className="border rounded-md p-2 flex items-center justify-center h-[72px] bg-muted">
                                  {isImage ? (
                                    <img src={url} alt={a.fileName} className="max-h-[64px] max-w-[80px] object-contain" />
                                  ) : (
                                    <Icon className="h-8 w-8" />
                                  )}
                                </div>
                                <div className="mt-1 text-[10px] truncate" title={a.fileName}>{a.fileName}</div>
                              </a>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Conversation</div>
                    <div className="space-y-3">
                      {selectedTicket?.replies?.length ? selectedTicket.replies.map(rep => (
                        <Card key={rep.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{user && rep.userId === user.id ? 'You' : 'Support Agent'}</div>
                              <div className="text-xs text-muted-foreground">{new Date(rep.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="mt-2 text-sm whitespace-pre-wrap">{rep.body}</div>
                            {Array.isArray((rep as any).attachments) && (rep as any).attachments.length > 0 && (
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-3">
                                  {((rep as any).attachments as any[]).map((a) => {
                                    const Icon = iconForAttachment(a.mimeType, a.fileName)
                                    const url = downloadUrl(a.id)
                                    const isImage = (a.mimeType || '').toLowerCase().startsWith('image/')
                                    return (
                                      <div key={a.id} className="w-[96px]">
                                        <a href={url} target="_blank" rel="noreferrer" className="block">
                                          <div className="border rounded-md p-2 flex items-center justify-center h-[72px] bg-muted">
                                            {isImage ? (
                                              <img src={url} alt={a.fileName} className="max-h-[64px] max-w-[80px] object-contain" />
                                            ) : (
                                              <Icon className="h-8 w-8" />
                                            )}
                                          </div>
                                          <div className="mt-1 text-[10px] truncate" title={a.fileName}>{a.fileName}</div>
                                        </a>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )) : (
                        <div className="text-sm text-muted-foreground">No messages</div>
                      )}
                    </div>
                  </div>

                  {selectedTicket?.status?.toUpperCase() === 'CLOSED' ? (
                    <div className="p-4 rounded-md border text-sm text-muted-foreground">This ticket is closed and archived.</div>
                  ) : (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Your reply</div>
                      <Textarea value={replyBody} onChange={(e) => setReplyBody(e.target.value)} placeholder="Type your message" />
                      <div className="mt-3">
                        <input type="file" multiple onChange={onReplyFilesChange} />
                        {replyFiles.length > 0 && (
                          <div className="mt-2 text-xs">
                            {replyFiles.map((f, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span>{f.name}</span>
                                <Button variant="ghost" size="sm" onClick={() => removeReplyFile(i)} disabled={isBusy}>Remove</Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <Button onClick={submitReply} disabled={!replyBody.trim() || isBusy}>Send Reply</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create a new ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="text-sm mb-1">Ticket type</div>
              <Select value={createType} onValueChange={(v: any) => setCreateType(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROBLEM">Problem</SelectItem>
                  <SelectItem value="ADVICE">Advice</SelectItem>
                  <SelectItem value="QUESTION">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-sm mb-1">Subject</div>
              <Input value={createSubject} onChange={(e) => setCreateSubject(e.target.value)} placeholder="Short description" />
            </div>
            <div>
              <div className="text-sm mb-1">Ticket body</div>
              <Textarea value={createBody} onChange={(e) => setCreateBody(e.target.value)} placeholder="Detailed description" />
            </div>
            <div>
              <div className="text-sm mb-1">Attachments</div>
              <input type="file" multiple onChange={onCreateFilesChange} />
              {createFiles.length > 0 && (
                <div className="mt-2 text-xs">
                  {createFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{f.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeCreateFile(i)} disabled={isBusy}>Remove</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={submitCreate} disabled={!createSubject.trim() || !createBody.trim() || isBusy}>Submit Ticket</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
