import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
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
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2c1a15',
            color: '#fff',
            border: '1px solid #3a2c27',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#2c1a15',
            },
          },
        }}
      />
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
