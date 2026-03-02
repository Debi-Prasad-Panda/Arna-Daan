import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-dark"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background-dark to-secondary/20 opacity-30"></div>
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="relative mx-auto max-w-4xl px-6 text-center lg:px-8"
      >
        <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">Ready to make a difference?</motion.h2>
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          Every plate of food saved is a step towards a hunger-free world. Whether you are a restaurant, volunteer, or NGO — we need you.
        </motion.p>
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.4 } } }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-background-dark transition-all hover:bg-slate-200 hover:scale-105"
          >
            Join as a Partner
          </Link>
          <button 
            onClick={() => {
              import('react-hot-toast').then(({ default: toast }) => {
                toast('Mobile app is currently in development. Stay tuned!', { icon: '📱' });
              });
            }}
            className="w-full sm:w-auto glass-button flex h-14 items-center justify-center gap-2 rounded-xl px-8 text-base font-bold text-white hover:scale-105 transition-transform"
          >
            Download App
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
