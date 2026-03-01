const FILTER_BTNS = ['All Food', 'Vegetarian', 'Non-Veg', 'Prepared Meals', 'Raw Ingredients', 'Baked Goods']

export default function FeedFilters() {
  return (
    <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-3 min-w-max">
        {FILTER_BTNS.map((btn, i) => (
          <button
            key={btn}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
              i === 0
                ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-transparent'
                : 'bg-[#2c1a15] text-[#bca39a] border border-[#3a2c27] hover:border-[#5a433a]'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  )
}
