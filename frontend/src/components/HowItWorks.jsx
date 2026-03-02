// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const steps = [
  {
    step: '1',
    title: 'Quick Listing',
    desc: 'Donors list surplus food in under 2 minutes. Specify food type, quantity, and a pickup window — all with a photo.',
    icon: 'schedule',
    hoverColor: 'hover:border-primary/50',
    glowColor: 'from-primary/10',
  },
  {
    step: '2',
    title: 'Verified Match',
    desc: 'Our system instantly notifies nearby verified NGOs and shelters based on food type and quantity needed.',
    icon: 'verified_user',
    hoverColor: 'hover:border-blue-500/50',
    glowColor: 'from-blue-500/10',
  },
  {
    step: '3',
    title: 'Instant Logistics',
    desc: 'Volunteers are dispatched for pickup and tracked in real-time until a safe, QR-verified delivery is complete.',
    icon: 'local_shipping',
    hoverColor: 'hover:border-secondary/50',
    glowColor: 'from-secondary/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 15 }
  }
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background-dark relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:flex md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">How Annadaan Works</h2>
            <p className="text-lg text-slate-400">Our platform streamlines food recovery — ensuring safety, speed, and dignity every step of the way.</p>
          </div>
        </motion.div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((s) => (
            <motion.div variants={cardVariants} key={s.step} className="relative group h-full">
              <div className={`absolute inset-0 bg-gradient-to-b ${s.glowColor} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className={`relative h-full rounded-2xl border border-white/5 bg-surface-dark p-8 ${s.hoverColor} transition-colors`}>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.step}. {s.title}</h3>
                <p className="text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
