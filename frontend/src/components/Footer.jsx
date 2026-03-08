export default function Footer() {
  return (
    <footer className="bg-background-dark border-t border-white/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">volunteer_activism</span>
              <span className="text-2xl font-bold text-white">Annadaan</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs mb-6">
              Bridging the gap between abundance and need through technology, community, and compassion.
            </p>
          </div>
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Donate Food</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Find Food</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Volunteer</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Mobile App</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">About Us</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Impact Report</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Careers</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Terms of Service</a></li>
              <li><a className="text-sm text-slate-400 hover:text-white transition-colors" href="#">Food Safety Guidelines</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-xs text-slate-500">© 2025 Annadaan Foundation. All rights reserved. Built by Lipsa Mohanty.</p>
        </div>
      </div>
    </footer>
  )
}
