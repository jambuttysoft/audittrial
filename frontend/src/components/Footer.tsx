"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname === '/') return null
  return (
    <footer className="mt-12">
      <div className="border-t" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-xs ">
          TRAKYTT Validation Portal / Early Access Version / Developed by 3030 Technologies © 2025 For testing and evaluation only
        </p>
      </div>
    </footer>
  )
}
