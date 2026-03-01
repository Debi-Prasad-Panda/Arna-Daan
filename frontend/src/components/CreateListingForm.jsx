import { useState } from 'react'

const dietOptions = [
  { value: 'veg', label: 'Vegetarian', dot: 'bg-green-500', checked: 'peer-checked:bg-green-900/30 peer-checked:border-green-500 peer-checked:text-green-400' },
  { value: 'nonveg', label: 'Non-Veg', dot: 'bg-red-500', checked: 'peer-checked:bg-red-900/30 peer-checked:border-red-500 peer-checked:text-red-400' },
  { value: 'vegan', label: 'Vegan', dot: 'bg-yellow-500', checked: 'peer-checked:bg-yellow-900/30 peer-checked:border-yellow-500 peer-checked:text-yellow-400' },
]

export default function CreateListingForm() {
  const [diet, setDiet] = useState('veg')
  const [safety, setSafety] = useState(false)

  return (
    <div className="xl:col-span-7 flex flex-col gap-6">
      <div className="bg-[#23140f] border border-[#3a2c27] rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Listing</h2>
            <p className="text-[#bca39a] text-sm mt-1">Share surplus food details to find a recipient nearby.</p>
          </div>
          <div className="hidden sm:flex items-center justify-center size-10 rounded-full bg-[#3a2c27] text-[#bca39a]">
            <span className="material-symbols-outlined">edit_note</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#bca39a]">Food Title</label>
              <input
                type="text"
                placeholder="e.g., Mixed Vegetable Curry"
                className="w-full bg-[#181210] border border-[#3a2c27] rounded-lg px-4 py-3 text-white placeholder-[#bca39a]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#bca39a]">Category</label>
              <div className="relative">
                <select className="w-full bg-[#181210] border border-[#3a2c27] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer">
                  <option>Cooked Meals</option>
                  <option>Raw Ingredients</option>
                  <option>Packaged Food</option>
                  <option>Baked Goods</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#bca39a] pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          {/* Quantity + Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#bca39a]">Quantity (approx. servings)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="20"
                  className="w-full bg-[#181210] border border-[#3a2c27] rounded-lg px-4 py-3 text-white placeholder-[#bca39a]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bca39a] text-sm pointer-events-none">Servings</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#bca39a]">Best Before</label>
              <input
                type="datetime-local"
                className="w-full bg-[#181210] border border-[#3a2c27] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          {/* Diet type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#bca39a]">Dietary Type</label>
            <div className="flex flex-wrap gap-3">
              {dietOptions.map((opt) => (
                <label key={opt.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="diet"
                    value={opt.value}
                    checked={diet === opt.value}
                    onChange={() => setDiet(opt.value)}
                    className="sr-only peer"
                  />
                  <div className={`px-4 py-2 rounded-lg border border-[#3a2c27] bg-[#181210] text-[#bca39a] transition-all flex items-center gap-2 ${opt.checked} peer-checked:cursor-default`}>
                    <span className={`size-2 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#bca39a]">Upload Photos</label>
            <div className="w-full border-2 border-dashed border-[#3a2c27] rounded-xl bg-[#181210]/50 hover:bg-[#181210] hover:border-primary/50 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer group">
              <div className="bg-[#23140f] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
              </div>
              <p className="text-white font-medium">Click to upload or drag and drop</p>
              <p className="text-[#bca39a] text-sm mt-1">PNG, JPG or GIF (max. 3MB — will be compressed)</p>
            </div>
          </div>

          {/* Safety checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={safety}
                  onChange={(e) => setSafety(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="size-5 border-2 border-[#3a2c27] rounded bg-[#181210] peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center" onClick={() => setSafety(!safety)}>
                  {safety && <span className="material-symbols-outlined text-white text-xs">check</span>}
                </div>
              </div>
              <span className="text-sm text-[#bca39a] group-hover:text-white transition-colors">
                I certify that this food is safe for consumption and has been handled according to hygiene standards.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            Post Donation
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  )
}
