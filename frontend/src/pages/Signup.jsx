import { useState } from 'react'
import { Link } from 'react-router-dom'

const ROLES = [
  { id: 'donor', label: 'Donor', icon: 'restaurant', desc: 'I want to donate food' },
  { id: 'ngo', label: 'NGO / Receiver', icon: 'groups', desc: 'I distribute to people' },
  { id: 'volunteer', label: 'Volunteer', icon: 'local_shipping', desc: 'I help transport food' },
]

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState('donor')

  return (
    <div className="min-h-screen flex font-display text-white bg-[#181210]">
      {/* Right Side - Image & Branding (Flipped for Signup to add variety) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#281e1b] order-2">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#181210] via-black/40 to-transparent" />
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop" 
          alt="Community sharing food" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-12 left-12 right-12 z-20">
          <Link to="/" className="flex items-center gap-3 text-primary mb-6">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
            </div>
            <h2 className="text-white text-2xl font-extrabold tracking-tight">Annadaan</h2>
          </Link>
        </div>
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <h1 className="text-4xl font-black leading-tight mb-4">
            Join the Annadaan Network.
          </h1>
          <p className="text-[#d6c1ba] text-lg max-w-md">
            Whether you have surplus food, time to transport it, or a community to feed—there is a place for you here.
          </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative order-1 py-12 lg:py-0 overflow-y-auto custom-scrollbar">
        <Link to="/" className="lg:hidden flex items-center gap-3 text-primary mb-12">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
          </div>
          <h2 className="text-white text-xl font-extrabold tracking-tight">Annadaan</h2>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-bold mb-2">Create an account</h2>
            <p className="text-[#bca39a]">Sign up to start making an impact</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-[#d6c1ba] mb-3">
                How do you want to participate?
              </label>
              <div className="flex flex-col gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedRole === role.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-[#3a2c27] bg-[#281e1b] hover:border-[#5a433a]'
                    }`}
                  >
                    <div className={`size-10 rounded-full flex items-center justify-center ${
                      selectedRole === role.id ? 'bg-primary text-white' : 'bg-[#181210] text-[#bca39a]'
                    }`}>
                      <span className="material-symbols-outlined">{role.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold ${selectedRole === role.id ? 'text-white' : 'text-[#d6c1ba]'}`}>
                        {role.label}
                      </h4>
                      <p className="text-xs text-[#bca39a] mt-0.5">{role.desc}</p>
                    </div>
                    {selectedRole === role.id && (
                      <span className="material-symbols-outlined text-primary ml-auto">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-bold text-[#d6c1ba] mb-2" htmlFor="name">
                {selectedRole === 'ngo' ? 'Organization Name' : 'Full Name'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bca39a]">
                  {selectedRole === 'ngo' ? 'domain' : 'person'}
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder={selectedRole === 'ngo' ? 'Hope Foundation' : 'John Doe'}
                  className="w-full bg-[#281e1b] border-2 border-[#3a2c27] text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[#5a433a] font-medium"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-[#d6c1ba] mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bca39a]">mail</span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-[#281e1b] border-2 border-[#3a2c27] text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[#5a433a] font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-[#d6c1ba] mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bca39a]">lock</span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#281e1b] border-2 border-[#3a2c27] text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[#5a433a] font-medium"
                />
              </div>
              <p className="text-xs text-[#bca39a] mt-2">Must be at least 8 characters.</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-[#e65020] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-4"
            >
              Start {selectedRole === 'donor' ? 'Donating' : selectedRole === 'ngo' ? 'Receiving' : 'Volunteering'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-[#bca39a] mt-8 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-white transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
