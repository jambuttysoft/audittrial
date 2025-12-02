import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, type InputProps } from "@/components/ui/input"
import { Button, type ButtonProps } from "@/components/ui/button"

type Align = 'inline-start' | 'inline-end'

export const InputGroup = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={cn("relative w-full", className)}>
      {children}
    </div>
  )
}

export const InputGroupInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <Input ref={ref} className={cn(className)} {...props} />
))
InputGroupInput.displayName = "InputGroupInput"

export const InputGroupAddon = ({ align = 'inline-start', className, children }: { align?: Align; className?: string; children: React.ReactNode }) => {
  const pos = align === 'inline-end' ? 'right-2' : 'left-2'
  return (
    <div className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 flex items-center", pos, className)}>
      {children}
    </div>
  )
}

export const InputGroupText = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={cn("text-muted-foreground text-sm", className)}>{children}</span>
)

export const InputGroupButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, size = 'icon', ...props }, ref) => (
  <Button ref={ref} className={cn("h-6 w-6", className)} size={size} {...props} />
))
InputGroupButton.displayName = "InputGroupButton"
