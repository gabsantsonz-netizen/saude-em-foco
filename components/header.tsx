'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-foreground hover:text-primary transition-colors">
          Saúde em Foco
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Produtos
          </Link>
          {user && (
            <>
              <Link href="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Calculadora
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </>
          )}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button size="sm" variant="ghost" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button size="sm" variant="ghost">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm">
                    Cadastro
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-muted rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-4 space-y-4">
            <Link 
              href="/products" 
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Produtos
            </Link>
            {user && (
              <>
                <Link 
                  href="/calculator" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calculadora
                </Link>
                <Link 
                  href="/dashboard" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="w-full gap-2 justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" variant="ghost" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Cadastro
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
