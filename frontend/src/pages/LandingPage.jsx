import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import HowItWorks from '../components/HowItWorks'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function LandingPage() {
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
