import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-dark"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background-dark to-secondary/20 opacity-30"></div>
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">Ready to make a difference?</h2>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          Every plate of food saved is a step towards a hunger-free world. Whether you are a restaurant, volunteer, or NGO — we need you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-background-dark transition-all hover:bg-slate-200"
          >
            Join as a Partner
          </Link>
          <button 
            onClick={() => {
              import('react-hot-toast').then(({ default: toast }) => {
                toast('Mobile app is currently in development. Stay tuned!', { icon: '📱' });
              });
            }}
            className="w-full sm:w-auto glass-button flex h-14 items-center justify-center gap-2 rounded-xl px-8 text-base font-bold text-white"
          >
            Download App
          </button>
        </div>
      </div>
    </section>
  )
}
