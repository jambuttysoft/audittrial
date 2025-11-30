"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Header from '@/components/Header'

type Invoice = {
  id: string
  generatedAt: string
  periodStart: string
  periodEnd: string
  activeCompanies: number
  amount: number
  status: 'PAID' | 'UNPAID'
  pdfUrl?: string | null
}

type Profile = {
  id: string
  email?: string
  name?: string
  autoChargeEnabled?: boolean
  stripeCustomerId?: string | null
  defaultPaymentMethodId?: string | null
}

export default function BillingPage() {
  const { toast } = useToast()
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3645'
  const [user, setUser] = useState<{ id: string; email?: string; name?: string; avatar?: string } | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPaying, setIsPaying] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const loadInvoices = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const r = await fetch(`/api/billing/invoices?userId=${user.id}`, { credentials: 'include' })
      const data = await r.json()
      const list: Invoice[] = data?.invoices || []
      setInvoices(list)
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load invoices', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, toast, API_BASE])

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    try {
      const r = await fetch(`/api/profile?userId=${user.id}`, { credentials: 'include' })
      const data = await r.json()
      if (data?.profile) setProfile(data.profile as Profile)
    } catch {}
  }, [user?.id, API_BASE])

  useEffect(() => { loadInvoices(); loadProfile() }, [loadInvoices, loadProfile])

  const unpaid = useMemo(() => invoices.filter(i => i.status === 'UNPAID'), [invoices])
  const paid = useMemo(() => invoices.filter(i => i.status === 'PAID'), [invoices])

  const handlePay = async (inv: Invoice) => {
    if (!user?.id) return
    setIsPaying(inv.id)
    try {
      const r = await fetch(`/api/billing/pay`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ invoiceId: inv.id, userId: user.id })
      })
      const data = await r.json()
      if (!r.ok || !data?.success) throw new Error('Payment failed')
      if (data.url) {
        window.location.href = data.url as string
        return
      }
      toast({ title: 'Payment initialized', description: `Redirecting to payment for ${inv.id}` })
      loadInvoices()
    } catch (e) {
      toast({ title: 'Payment error', description: 'Unable to process payment', variant: 'destructive' })
    } finally {
      setIsPaying(null)
    }
  }

  const toggleAutoCharge = async (checked: boolean) => {
    if (!user?.id) return
    try {
      const r = await fetch(`/api/profile/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user.id, autoChargeEnabled: checked }),
      })
      const data = await r.json()
      if (!r.ok || !data?.success) throw new Error('Update failed')
      setProfile((p) => (p ? { ...p, autoChargeEnabled: checked } : p))
      toast({ title: 'Saved', description: checked ? 'Auto-charge enabled' : 'Auto-charge disabled' })
    } catch {
      toast({ title: 'Error', description: 'Failed to update auto-charge setting', variant: 'destructive' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Billing</CardTitle>
          <CardDescription>Pending invoices and payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Checkbox id="auto-charge" checked={!!profile?.autoChargeEnabled} onCheckedChange={(v) => toggleAutoCharge(!!v)} />
            <label htmlFor="auto-charge" className="text-sm">
              Enable auto-charge for future invoices
            </label>
            <div className="ml-auto text-xs text-muted-foreground">
              {profile?.defaultPaymentMethodId ? 'Card on file' : 'No saved card'}
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <Input placeholder="Search invoices" className="max-w-xs" />
            <div className="ml-auto text-sm text-muted-foreground">
              Total unpaid: {unpaid.reduce((s, i) => s + i.amount, 0).toFixed(2)} USD
            </div>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Active Companies</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpaid.length ? unpaid.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell>{inv.periodStart} → {inv.periodEnd}</TableCell>
                    <TableCell>{inv.activeCompanies}</TableCell>
                    <TableCell>${inv.amount.toFixed(2)}</TableCell>
                    <TableCell><Badge variant="destructive">UNPAID</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" disabled={isPaying === inv.id || isLoading || inv.amount <= 0} onClick={() => handlePay(inv)}>
                        {inv.amount <= 0 ? 'No Charge' : (isPaying === inv.id ? 'Processing…' : 'Pay Now')}
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No unpaid invoices</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>All generated invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Companies</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length ? invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell>{inv.generatedAt}</TableCell>
                    <TableCell>{inv.periodStart} → {inv.periodEnd}</TableCell>
                    <TableCell>{inv.activeCompanies}</TableCell>
                    <TableCell>${inv.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={inv.status === 'PAID' ? 'default' : 'destructive'}>{inv.status}</Badge>
                        {inv.status === 'PAID' && inv.pdfUrl ? (
                          <Button size="sm" variant="outline" onClick={() => { try { const href = new URL(inv.pdfUrl!, window.location.origin).toString(); window.open(href, '_blank') } catch {} }}>
                            Download PDF
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No invoices</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Activity</CardTitle>
          <CardDescription>Breakdown per company</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Coming soon: detailed charts of digitization activity and per-company usage.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved cards</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Stripe integration pending. You’ll be able to add and manage cards here.</p>
        </CardContent>
      </Card>
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="rounded-full px-4 py-3 shadow-lg" variant="default" onClick={() => { try { window.location.assign('/tickets') } catch {} }}>
          <div className="text-sm leading-tight text-left">
            <div>Need Halp ?</div>
            <div>Have sugession ?</div>
          </div>
        </Button>
      </div>
      </div>
    </>
  )
}
