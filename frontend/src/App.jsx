import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

// Placeholder pages (to be built out)
const ComingSoon = ({ title }) => (
  <div className="min-h-screen bg-background-dark flex items-center justify-center">
    <div className="text-center">
      <span className="material-symbols-outlined text-primary text-6xl mb-4 block">construction</span>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400">This page is coming soon.</p>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<ComingSoon title="Login" />} />
        <Route path="/signup" element={<ComingSoon title="Sign Up" />} />
        <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
        <Route path="/admin" element={<ComingSoon title="Admin Panel" />} />
      </Routes>
    </BrowserRouter>
  )
}
