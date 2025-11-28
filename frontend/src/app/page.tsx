"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, MapPin, GalleryVerticalEnd } from 'lucide-react'

interface RegisterData {
  email: string
  password: string
  name: string
  userType: 'INDIVIDUAL' | 'BUSINESS'
  phone?: string
  address?: string
  company?: string
  services?: string
  isVisibleToClients: boolean
  acceptsJobOffers: boolean
}

interface LoginData {
  email: string
  password: string
}

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' })
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '', password: '', name: '', userType: 'INDIVIDUAL', phone: '', address: '', company: '', services: '', isVisibleToClients: true, acceptsJobOffers: true
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(loginData)
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess('Successful login! Redirecting...')
        localStorage.setItem('user', JSON.stringify(data.user))
        setTimeout(() => { router.push('/dashboard') }, 1000)
      } else {
        setError(data.error || 'Login error')
      }
    } catch {
      setError('Server connection error')
    } finally { setIsLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(registerData)
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess('Registration successful!')
        try {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email: registerData.email, password: registerData.password })
          })
          const loginData = await loginResponse.json()
          if (loginResponse.ok) {
            localStorage.setItem('user', JSON.stringify(loginData.user))
            setTimeout(() => { router.push('/dashboard') }, 1000)
          } else {
            setError('Registration successful, but auto-login failed. Please log in manually.')
          }
        } catch {
          setError('Registration successful, but auto-login failed. Please log in manually.')
        }
        setRegisterData({ email: '', password: '', name: '', userType: 'INDIVIDUAL', phone: '', address: '', company: '', services: '', isVisibleToClients: true, acceptsJobOffers: true })
      } else { setError(data.error || 'Registration error') }
    } catch { setError('Server connection error') } finally { setIsLoading(false) }
  }

  const labels = ['+1200.00', 'INV-2024-007', 'CR', 'EQ-15', 'TRIAL BALANCE', '999.99', 'BAL', 'DR', '353.53']
  const items = Array.from({ length: 14 }).map((_, i) => ({ text: labels[i % labels.length], left: `${5 + (i * 6.5) % 90}%`, delay: `${(i % 5) * 0.8}s`, size: `${0.85 + (i % 4) * 0.15}rem` }))

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            TRAKYTT
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-red-600 text-sm">{error}</p></div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md"><p className="text-green-600 text-sm">{success}</p></div>
            )}
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Sign in to TRAKYTT</CardTitle>
                    <CardDescription>Access your document workspace and continue processing.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="login-email" type="email" placeholder="your@email.com" className="pl-10" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" className="pl-10 pr-10" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                          <button type="button" className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600" onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword) }}>{showPassword ? <EyeOff /> : <Eye />}</button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Sign In Securely'}</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Fill in the information to create a new account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="register-name" type="text" placeholder="John Doe" className="pl-10" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="register-email" type="email" placeholder="your@email.com" className="pl-10" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="register-password" type={showPassword ? 'text' : 'password'} placeholder="Create password" className="pl-10 pr-10" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                          <button type="button" className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600" onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword) }}>{showPassword ? <EyeOff /> : <Eye />}</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-type">Account Type</Label>
                        <Select value={registerData.userType} onValueChange={(value: 'INDIVIDUAL' | 'BUSINESS') => setRegisterData({ ...registerData, userType: value })}>
                          <SelectTrigger><SelectValue placeholder="Select account type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-phone">Phone (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="register-phone" type="tel" placeholder="+1 (555) 123-4567" className="pl-10" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} />
                        </div>
                      </div>
                      {registerData.userType === 'BUSINESS' && (
                        <div className="space-y-2">
                          <Label htmlFor="register-company">Company Name</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="register-company" type="text" placeholder="Company Name" className="pl-10" value={registerData.company} onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })} />
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="register-address">Address (Optional)</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Textarea id="register-address" placeholder="Your address" className="pl-10 min-h-[80px]" value={registerData.address} onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="visible-to-clients" checked={registerData.isVisibleToClients} onCheckedChange={(checked: boolean) => setRegisterData({ ...registerData, isVisibleToClients: checked })} />
                          <Label htmlFor="visible-to-clients" className="text-sm">Make my profile visible to clients</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="accepts-job-offers" checked={registerData.acceptsJobOffers} onCheckedChange={(checked: boolean) => setRegisterData({ ...registerData, acceptsJobOffers: checked })} />
                          <Label htmlFor="accepts-job-offers" className="text-sm">Accept job offers from clients</Label>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Create Account'}</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0">
          <div className="hero-animated h-full">
            {items.map((it, idx) => (
              <span key={idx} className="falling-number" style={{ left: it.left, top: '-10%', animationDelay: it.delay, fontSize: it.size }}>{it.text}</span>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <div className="bg-white/80 backdrop-blur rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Compliance-First Platform</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Document Verification</h3>
                <p className="text-xs text-gray-600">Automated GST logic and validation.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Multi-Entity Management</h3>
                <p className="text-xs text-gray-600">Centralised access for firms.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Analytics & Reports</h3>
                <p className="text-xs text-gray-600">Audit-ready summaries and exports.</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Powered by 3030 Technologies • Early Access Version</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
