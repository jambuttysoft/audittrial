import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="border-t" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          </div>
          <div className="space-y-2">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
          </div>
          <div className="space-y-2">
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link>
          </div>
        </div>
      </div>
      <div className="border-t" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-xs text-muted-foreground">
          TRAKYTT Validation Portal / Early Access Version - Developed by 3030 Technologies © 2025 For testing and evaluation only
        </p>
      </div>
    </footer>
  )
}

