import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useAuthStore from './store/authStore'

import LandingPage from './pages/LandingPage'
import DonorDashboard from './pages/DonorDashboard'
import ReceiverFeed from './pages/ReceiverFeed'
import VolunteerLogistics from './pages/VolunteerLogistics'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DonorDashboard />} />
          <Route path="/feed" element={<ReceiverFeed />} />
          <Route path="/logistics" element={<VolunteerLogistics />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
