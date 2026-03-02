import { Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import HowItWorks from '../components/HowItWorks'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import useAuthStore, { getHomeRoute } from '../store/authStore'

export default function LandingPage() {
  const { user, role, isLoading } = useAuthStore()

  // If a logged-in user lands on '/', bounce them to their dashboard
  if (!isLoading && user) {
    return <Navigate to={getHomeRoute(role)} replace />
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark">
      <Navbar />
      <main className="flex-grow pt-20">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
