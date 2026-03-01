// FeedFilters — stateless; receives activeFilter + onFilter from parent
const FILTERS = [
  { label: 'All Food',        value: 'all',         icon: 'restaurant_menu' },
  { label: 'Vegetarian',      value: 'Veg',          icon: 'eco' },
  { label: 'Non-Veg',         value: 'Non-Veg',      icon: 'kebab_dining' },
  { label: 'Prepared Meals',  value: 'Ready to eat', icon: 'dinner_dining' },
  { label: 'Raw Ingredients', value: 'Raw Ingredients', icon: 'grocery' },
  { label: 'Baked Goods',     value: 'Baked Goods',  icon: 'bakery_dining' },
  { label: 'Frozen',          value: 'Frozen',       icon: 'ac_unit' },
]

export { FILTERS }

export default function FeedFilters({ activeFilter, onFilter }) {
  return (
    <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-3 min-w-max">
        {FILTERS.map(({ label, value, icon }) => {
          const isActive = activeFilter === value
          return (
            <button
              key={value}
              onClick={() => onFilter(value)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-transparent'
                  : 'bg-[#2c1a15] text-[#bca39a] border border-[#3a2c27] hover:border-primary/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
