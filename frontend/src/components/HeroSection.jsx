import { Link } from 'react-router-dom'

const AVATAR_URLS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAEgICIvlAIG2fQslNw49sEKEeFKTmnX1KpumGHggCGccPTw52A-UsqbP8ZCAjyEdxqtipj0TKTRagD4sI2l_omxkQmSgbiDX6JMvZGSb-4uxO0z_jgepKmvynDF2hC76i-REnYbAH0ISOEbSph4oeyza6dQYV9gBNu0CEBNnYuTcVUIBGK6jOe05irdyb_BilsviLK6krfHnWXzhZAfiY5ROTmgOnw8G5Sii4hYoTMuuIcHKf5DEBZ2abW8fxqCXwpnG0FxrWl2w',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCPrT003E6w_T1MbD0pvQl5icRMiTspE6zyynAhB4zk7_El21j5CVcIj3HCPs92o_UEmNNlm_zS_kAaQDeb-7DwVSs6OmBbggn_td_EXb2P4x2uTUER25R68fWz_uhbwhBw1kyH3LpgL4Ny6eYKMLxsJw96PwPNxjJ0Kdqb8VU8XR0kg1VCvGpp1DMHXgkIeTYXV4cxpnMiBT7SKvTOeAb7jJKybIf2Ke4QTORnxbzf35lTP0BkdIJJfUGvGTCMCBB7ldT4YP_h3g',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAxBGGotviOf0Ut5pzqeZGgO6eyND-KU6OlTFlXrdrqWzQ9v0vfjtb4bIeEK95v2mZvkKbotD_ogCleiKxwqF--HQQOjjkMPT4oQsvGtZpHB8YT8Ue1qZXZzY65PrxNYpzpO8dgdcM1I72wKc9Jo9pCDbrnHfKkzskGNX31oTrLGkliyHVvBaVFgvV1UI1cl61JetHXHa9eJSUdZk_er14eit3lk457cbenOCPOiTtbqA1-It-3QLaFBAL5nIa5swCMR6U3d9iyAQ',
]

const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAxz70BvNEHdKk3FpGdjTtC_1DzPU2tJDrgEw1rVvtIrAmh3ahYifQhqrfxejP_-1_s91KVp3XfZfSUATVTedf1Feyb8Wp5akApzNwTvoLK-55frztEkmXqAAnk-HuCz28rFdPz2UZR-HxgzNKgs7AMqnmb97oPapBJsftS6f0O9By_g-XUPixz84oKLKfYkYTZhoq7df_tnh9lF_7cyqRvTkWV3FqQMCHi_7DYxGK5_63_RGrEwE9snExFQdOgj_1BDKjPoZWsQ'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 -right-40 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left: Text */}
          <div className="flex flex-col gap-8 max-w-2xl">
            {/* Live badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Live Food Rescue Network</span>
            </div>

            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="text-gradient">Bridge the Gap</span>{' '}
              Between Surplus and Scarcity
            </h1>

            <p className="text-lg leading-relaxed text-slate-400 max-w-lg">
              Connect surplus food from events and restaurants directly to communities in need. Join our mission to end hunger and reduce waste through technology.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/signup"
                className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[#ff8c33] px-8 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40"
              >
                <span>Start Donating</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
              <Link
                to="/signup?role=volunteer"
                className="glass-button flex h-14 items-center justify-center gap-3 rounded-xl px-8 text-base font-bold text-white"
              >
                <span className="material-symbols-outlined">volunteer_activism</span>
                <span>Volunteer Now</span>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-3">
                {AVATAR_URLS.map((url, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-background-dark bg-slate-800 bg-cover bg-center"
                    style={{ backgroundImage: `url('${url}')` }}
                  />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background-dark bg-surface-dark text-xs font-medium text-white">
                  +2k
                </div>
              </div>
              <p>Joined by 2,000+ changemakers</p>
            </div>
          </div>

          {/* Right: Hero image card */}
          <div className="relative lg:h-[600px] w-full flex items-center justify-center">
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface-dark/50">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10" />
              <img
                src={HERO_IMG}
                alt="Hands sharing food"
                className="w-full h-full object-cover opacity-80"
              />

              {/* Floating card */}
              <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col gap-4">
                <div className="glass-panel rounded-xl p-4 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <span className="material-symbols-outlined">soup_kitchen</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Recent Rescue</p>
                      <p className="text-white font-bold">50kg Rice &amp; Lentils</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">Just now</span>
                </div>
              </div>
            </div>

            {/* Floating eco badge */}
            <div className="absolute -right-4 top-1/4 z-30 glass-panel rounded-xl p-4 animate-bounce shadow-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">eco</span>
                <div>
                  <p className="text-xs text-slate-400">CO₂ Saved</p>
                  <p className="text-sm font-bold text-white">124kg today</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
