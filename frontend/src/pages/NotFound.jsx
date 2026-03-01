import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#181210] font-display text-white flex flex-col items-center justify-center text-center px-6">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="text-[120px] font-black text-[#3a2c27] leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-20 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">sentiment_dissatisfied</span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-black mb-3">Page Not Found</h1>
      <p className="text-[#bca39a] text-lg max-w-md mb-8">
        The page you're looking for doesn't exist, or you may not have access to it yet.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 bg-primary hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 border border-[#3a2c27] hover:border-primary/50 text-[#bca39a] hover:text-white font-bold px-6 py-3 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Go Back
        </button>
      </div>
    </div>
  )
}
