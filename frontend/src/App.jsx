import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DonorDashboard from './pages/DonorDashboard'
import ReceiverFeed from './pages/ReceiverFeed'
import VolunteerLogistics from './pages/VolunteerLogistics'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Placeholder pages (to be built out)
const ComingSoon = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#121212' }}>
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
        <Route path="/dashboard" element={<DonorDashboard />} />
        <Route path="/feed" element={<ReceiverFeed />} />
        <Route path="/logistics" element={<VolunteerLogistics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}
