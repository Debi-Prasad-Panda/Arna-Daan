const stats = [
  {
    label: 'Total Meals Saved',
    value: '12,450+',
    trend: '+15% this month',
    icon: 'restaurant',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    label: 'Active Donors',
    value: '850',
    trend: '+5% new partners',
    icon: 'storefront',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    label: 'Active Volunteers',
    value: '320',
    trend: '+12% joined',
    icon: 'diversity_1',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
]

export default function StatsSection() {
  return (
    <section id="impact" className="py-10 border-y border-white/5 bg-background-dark/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl bg-surface-dark p-8 border border-white/5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <h3 className="mt-2 text-4xl font-black text-white tracking-tight">{stat.value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-full ${stat.iconBg} flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-green-500">trending_up</span>
                <span className="text-sm font-medium text-green-500">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
