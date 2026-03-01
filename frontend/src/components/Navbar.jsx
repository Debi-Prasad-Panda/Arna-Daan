import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <span className="material-symbols-outlined text-lg">volunteer_activism</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Annadaan</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">How it works</a>
          <a href="#impact"       className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Impact</a>
          <a href="#"             className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Partners</a>
          <a href="#"             className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">About</a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login"  className="h-10 flex items-center justify-center rounded-lg px-6 text-sm font-bold text-white transition-colors hover:bg-white/5">Login</Link>
          <Link to="/signup" className="h-10 flex items-center justify-center rounded-lg bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">Sign Up</Link>
        </div>

        {/* Mobile: Sign Up + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/signup" className="h-9 flex items-center justify-center rounded-lg bg-primary px-4 text-xs font-bold text-white">Sign Up</Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-background-dark/95 backdrop-blur-md px-4 py-4 flex flex-col gap-1">
          <a href="#how-it-works" onClick={() => setOpen(false)} className="py-3 px-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-lg transition-colors">How it works</a>
          <a href="#impact"       onClick={() => setOpen(false)} className="py-3 px-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-lg transition-colors">Impact</a>
          <a href="#"             className="py-3 px-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-lg transition-colors">Partners</a>
          <a href="#"             className="py-3 px-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-lg transition-colors">About</a>
          <div className="border-t border-white/5 mt-2 pt-2">
            <Link to="/login" onClick={() => setOpen(false)} className="block py-3 px-3 text-sm font-bold text-white hover:bg-white/5 rounded-lg transition-colors">Login</Link>
          </div>
        </div>
      )}
    </header>
  )
}
