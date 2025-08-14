'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, MapPin } from 'lucide-react'

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

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    userType: 'INDIVIDUAL',
    phone: '',
    address: '',
    company: '',
    services: '',
    isVisibleToClients: true,
    acceptsJobOffers: true
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Successful login! Redirecting...')
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(data.error || 'Login error')
      }
    } catch (error) {
      setError('Server connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:3110/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Registration successful!')
        
        // Автоматический логин после успешной регистрации
        try {
          const loginResponse = await fetch('http://localhost:3110/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: registerData.email,
              password: registerData.password
            }),
          })
          
          const loginData = await loginResponse.json()
          
          if (loginResponse.ok) {
            // Сохранить данные пользователя в localStorage
            localStorage.setItem('user', JSON.stringify(loginData.user))
            
            // Перенаправить на дашборд
            setTimeout(() => {
              router.push('/dashboard')
            }, 1000)
          } else {
            setError('Registration successful, but auto-login failed. Please log in manually.')
          }
        } catch (loginError) {
          setError('Registration successful, but auto-login failed. Please log in manually.')
        }
        
        // Clear form
        setRegisterData({
          email: '',
          password: '',
          name: '',
          userType: 'INDIVIDUAL',
          phone: '',
          address: '',
          company: '',
          services: '',
          isVisibleToClients: true,
          acceptsJobOffers: true
        })
      } else {
        setError(data.error || 'Registration error')
      }
    } catch (error) {
      setError('Server connection error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Digitization
          </h1>
          <p className="text-gray-600">
            Document Digitization System
          </p>
        </div>
          
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}
        
        <Tabs defaultValue="login" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to System</CardTitle>
                <CardDescription>
                  Enter your login credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginData({...loginData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault()
                          setShowPassword(!showPassword)
                        }}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Fill in the information to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="pl-10 pr-10"
                        value={registerData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault()
                          setShowPassword(!showPassword)
                        }}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-type">Account Type</Label>
                    <Select value={registerData.userType} onValueChange={(value: 'INDIVIDUAL' | 'BUSINESS') => setRegisterData({...registerData, userType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
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
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                        value={registerData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  {registerData.userType === 'BUSINESS' && (
                    <div className="space-y-2">
                      <Label htmlFor="register-company">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-company"
                          type="text"
                          placeholder="Company Name"
                          className="pl-10"
                          value={registerData.company}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, company: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-address">Address (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="register-address"
                        placeholder="Your address"
                        className="pl-10 min-h-[80px]"
                        value={registerData.address}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRegisterData({...registerData, address: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visible-to-clients"
                        checked={registerData.isVisibleToClients}
                        onCheckedChange={(checked: boolean) => setRegisterData({...registerData, isVisibleToClients: checked})}
                      />
                      <Label htmlFor="visible-to-clients" className="text-sm">
                        Make my profile visible to clients
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accepts-job-offers"
                        checked={registerData.acceptsJobOffers}
                        onCheckedChange={(checked: boolean) => setRegisterData({...registerData, acceptsJobOffers: checked})}
                      />
                      <Label htmlFor="accepts-job-offers" className="text-sm">
                        Accept job offers from clients
                      </Label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}