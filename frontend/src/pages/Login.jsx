import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import useAuthStore, { getHomeRoute } from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = useAuthStore(state => state.login)
  const isLoading = useAuthStore(state => state.isLoading)
  const user = useAuthStore(state => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    try {
      await login(email, password)
      // Navigate based on the role that was saved at signup
      const role = useAuthStore.getState().role
      navigate(getHomeRoute(role))
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }

  // Redirect if already logged in — go to their home page by role
  if (user && !isLoading) {
    return <Navigate to={getHomeRoute(user.prefs?.role)} replace />
  }

  return (
    <div className="min-h-screen flex font-display text-white bg-[#181210]">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#281e1b]">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#181210] via-black/40 to-transparent" />
        <img 
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2670&auto=format&fit=crop" 
          alt="Volunteers organizing food" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <Link to="/" className="flex items-center gap-3 text-primary mb-6">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
            </div>
            <h2 className="text-white text-2xl font-extrabold tracking-tight">Annadaan</h2>
          </Link>
          <h1 className="text-4xl font-black leading-tight mb-4">
            Welcome back to the movement.
          </h1>
          <p className="text-[#d6c1ba] text-lg max-w-md">
            Every meal you share makes a difference. Log in to continue your journey of giving.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative">
        <Link to="/" className="lg:hidden flex items-center gap-3 text-primary absolute top-8 left-8 sm:left-16">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
          </div>
          <h2 className="text-white text-xl font-extrabold tracking-tight">Annadaan</h2>
        </Link>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left mt-16 lg:mt-0">
            <h2 className="text-3xl font-bold mb-2">Sign in</h2>
            <p className="text-[#bca39a]">Log in to access your dashboard</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-sm font-medium">
                {error}
              </div>
            )}
            
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#281e1b] border-2 border-[#3a2c27] text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[#5a433a] font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-[#d6c1ba]" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:text-white transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bca39a]">lock</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#281e1b] border-2 border-[#3a2c27] text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[#5a433a] font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary hover:bg-[#e65020] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-2 flex justify-center items-center gap-2 group ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-[#bca39a] mt-10 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-white transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
