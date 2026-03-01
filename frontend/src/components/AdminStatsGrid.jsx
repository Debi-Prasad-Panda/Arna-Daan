const STATS = [
  {
    title: 'Total Users',
    value: '12,405',
    icon: 'group',
    iconColor: 'text-primary',
    trend: '+12%',
    trendUp: true,
    trendColor: 'text-green-500',
    trendBg: 'bg-green-500/20',
    comparedTo: 'vs last month'
  },
  {
    title: 'Active Listings',
    value: '843',
    icon: 'inventory_2',
    iconColor: 'text-blue-400',
    trend: '+5%',
    trendUp: true,
    trendColor: 'text-blue-400',
    trendBg: 'bg-blue-500/20',
    comparedTo: 'vs last month'
  },
  {
    title: 'Meals Delivered',
    value: '1.2M',
    icon: 'soup_kitchen',
    iconColor: 'text-orange-400',
    trend: '+22%',
    trendUp: true,
    trendColor: 'text-orange-400',
    trendBg: 'bg-orange-500/20',
    comparedTo: 'vs last month'
  },
  {
    title: 'Pending KYC',
    value: '48',
    icon: 'pending_actions',
    iconColor: 'text-yellow-400',
    trend: '-2%',
    trendUp: false,
    trendColor: 'text-yellow-400',
    trendBg: 'bg-yellow-500/20',
    comparedTo: 'vs last week'
  }
]

export default function AdminStatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <div key={stat.title} className="bg-[#2f1d17] rounded-2xl p-5 border border-[#4a352f] shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className={`material-symbols-outlined text-6xl ${stat.iconColor}`}>{stat.icon}</span>
          </div>
          <div className="flex flex-col gap-1 z-10">
            <p className="text-[#d6c1ba] text-sm font-medium">{stat.title}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
          </div>
          <div className="flex items-center gap-2 mt-4 z-10">
            <span className={`${stat.trendBg} ${stat.trendColor} text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1`}>
              <span className="material-symbols-outlined text-sm">
                {stat.trendUp ? 'trending_up' : 'trending_down'}
              </span>
              {stat.trend}
            </span>
            <span className="text-[#d6c1ba] text-xs">{stat.comparedTo}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
