"use client"

import * as React from "react"
import {
  Building2,
  LogOut,
  ChevronsUpDown,
  Plus,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Button,
} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Input,
} from "@/components/ui/input"
import {
  Label,
} from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Textarea,
} from "@/components/ui/textarea"

// Get user data from localStorage
const getDefaultUserData = () => ({
  id: null as string | null,
  name: "User",
  email: "user@example.com",
})

// Interface for company
interface Company {
  id: string
  name: string
  description?: string
  isActive: boolean
  documentsCount?: number
  createdAt: string
  updatedAt: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [companies, setCompanies] = React.useState<Company[]>([])
  const [loading, setLoading] = React.useState(true)
  const [userData, setUserData] = React.useState(getDefaultUserData())
  const [isClient, setIsClient] = React.useState(false)
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = React.useState(false)
  const [newCompanyName, setNewCompanyName] = React.useState('')
  const [newCompanyDescription, setNewCompanyDescription] = React.useState('')
  const [isCreatingCompany, setIsCreatingCompany] = React.useState(false)

  // Set client environment flag and load user data
  React.useEffect(() => {
    setIsClient(true)
    const storedUserData = localStorage.getItem('user')
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  // Load companies on component mount
  const handleCompanySelect = (company: Company) => {
    // Switch company via URL parameters
    window.location.href = `/dashboard?company=${company.id}`
  }

  const handleAddCompany = () => {
    setIsAddCompanyModalOpen(true)
  }

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim() || !userData?.id) return

    setIsCreatingCompany(true)
    try {
      const response = await fetch(`http://localhost:3001/api/companies?userId=${userData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCompanyName.trim(),
          description: newCompanyDescription.trim() || undefined,
        }),
      })

      if (response.ok) {
        const newCompany = await response.json()
        setCompanies(prev => [newCompany, ...prev])
        
        // Close modal and reset form
        setIsAddCompanyModalOpen(false)
        setNewCompanyName('')
        setNewCompanyDescription('')
        
        // Navigate to the new company
        window.location.href = `/dashboard?company=${newCompany.id}`
      } else {
        console.error('Failed to create company')
      }
    } catch (error) {
      console.error('Error creating company:', error)
    } finally {
      setIsCreatingCompany(false)
    }
  }

  const handleCloseModal = () => {
    setIsAddCompanyModalOpen(false)
    setNewCompanyName('')
    setNewCompanyDescription('')
  }

  React.useEffect(() => {
    const loadCompanies = async () => {
      if (!isClient || !userData?.id) {
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`http://localhost:3001/api/companies?userId=${userData.id}`)
        if (response.ok) {
          const companiesData = await response.json()
          setCompanies(companiesData)
        } else {
          console.error('Failed to load companies')
        }
      } catch (error) {
        console.error('Error loading companies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [isClient, userData?.id])
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Building2 className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">AuditTrail</span>
            <span className="text-sm text-muted-foreground">Digitalization</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Companies</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleAddCompany} className="text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                  <span>Add Company</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {loading ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <Building2 className="h-4 w-4" />
                    <span>Loading...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                companies.map((company) => (
                  <SidebarMenuItem key={company.id}>
                    <SidebarMenuButton asChild>
                      <a href={`/dashboard?company=${company.id}`}>
                        <Building2 className="h-4 w-4" />
                        <span>{company.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                       {userData.name?.charAt(0) || 'U'}
                     </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.name}</span>
                     <span className="truncate text-xs">{userData.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                     <AvatarFallback className="rounded-lg">
                       {userData.name?.charAt(0) || 'U'}
                     </AvatarFallback>
                   </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData.name}</span>
                       <span className="truncate text-xs">{userData.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  localStorage.removeItem('user')
                  window.location.href = '/auth'
                }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      
      {/* Modal for adding new company */}
      <Dialog open={isAddCompanyModalOpen} onOpenChange={setIsAddCompanyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Create a new company to manage documents and data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Enter company name"
                disabled={isCreatingCompany}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-description">Description (Optional)</Label>
              <Textarea
                id="company-description"
                value={newCompanyDescription}
                onChange={(e) => setNewCompanyDescription(e.target.value)}
                placeholder="Enter company description"
                disabled={isCreatingCompany}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isCreatingCompany}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCompany}
              disabled={!newCompanyName.trim() || isCreatingCompany}
            >
              {isCreatingCompany ? 'Creating...' : 'Create Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
