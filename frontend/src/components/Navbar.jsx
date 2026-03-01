import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <span className="material-symbols-outlined text-lg">volunteer_activism</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Annadaan</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">How it works</a>
          <a href="#impact" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Impact</a>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Partners</a>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">About</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:flex h-10 items-center justify-center rounded-lg px-6 text-sm font-bold text-white transition-colors hover:bg-white/5">
            Login
          </Link>
          <Link to="/signup" className="flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/40">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
