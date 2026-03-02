import { useState, useRef } from 'react'
import useListingStore from '../store/listingStore'
import useAuthStore from '../store/authStore'
import { storage, APPWRITE_CONFIG } from '../lib/appwrite'
import { ID } from 'appwrite'

const dietOptions = [
  { value: 'VEG', label: 'Vegetarian', dot: 'bg-green-500', checked: 'peer-checked:bg-green-900/30 peer-checked:border-green-500 peer-checked:text-green-400' },
  { value: 'NON-VEG', label: 'Non-Veg', dot: 'bg-red-500', checked: 'peer-checked:bg-red-900/30 peer-checked:border-red-500 peer-checked:text-red-400' },
  { value: 'VEGAN', label: 'Vegan', dot: 'bg-yellow-500', checked: 'peer-checked:bg-yellow-900/30 peer-checked:border-yellow-500 peer-checked:text-yellow-400' },
]

export default function CreateListingForm() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Cooked Meals')
  const [quantity, setQuantity] = useState('')
  const [bestBefore, setBestBefore] = useState('')
  const [diet, setDiet] = useState('VEG')
  const [safety, setSafety] = useState(false)
  
  const [formError, setFormError] = useState('')

  const createListing = useListingStore(state => state.createListing)
  const isCreating = useListingStore(state => state.isLoading)
  const user = useAuthStore(state => state.user)

  // Image upload state
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading]       = useState(false)
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !quantity || !bestBefore || !safety) {
      setFormError('Please fill in all required fields and confirm safety guidelines.')
      return
    }
    setFormError('')

    try {
      // 1. Upload image if one was selected
      let imageUrl = null
      if (imageFile && APPWRITE_CONFIG.bucketId && APPWRITE_CONFIG.bucketId !== 'YOUR_BUCKET_ID_HERE') {
        try {
          setUploading(true)
          const uploaded = await storage.createFile(APPWRITE_CONFIG.bucketId, ID.unique(), imageFile)
          imageUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/${uploaded.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
        } catch (uploadErr) {
          console.warn('Image upload failed:', uploadErr.message)
          // If bucket doesn't exist or upload fails, continue without image
          const msg = uploadErr.message || ''
          if (msg.includes('not found') || msg.includes('storage')) {
            setFormError('Image upload failed — storage bucket may not be set up. Posting without photo.')
          } else {
            setFormError(`Image upload failed: ${msg}. Posting without photo.`)
          }
        } finally {
          setUploading(false)
        }
      }
      // 2. Create listing document
      await createListing({
        title,
        category,
        quantity: parseInt(quantity, 10),
        bestBefore,
        diet,
        status: 'Active',
        donorId: user.$id,
        donorName: user.name,
        ...(imageUrl ? { imageUrl } : {}),
      })
      // Reset form
      setTitle('')
      setQuantity('')
      setBestBefore('')
      setSafety(false)
      setImageFile(null)
      setImagePreview(null)
    } catch (err) {
      setFormError(err.message || 'Failed to create listing.')
    }
  }

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

        {formError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-sm font-medium">
            {formError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#bca39a]">Food Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Mixed Vegetable Curry"
                className="w-full bg-[#181210] border border-[#3a2c27] rounded-lg px-4 py-3 text-white placeholder-[#bca39a]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#bca39a]">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[#181210] border border-[#3a2c27] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Raw Ingredients">Raw Ingredients</option>
                  <option value="Packaged Food">Packaged Food</option>
                  <option value="Baked Goods">Baked Goods</option>
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
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="20"
                  className="w-full bg-[#181210] border border-[#3a2c27] rounded-lg px-4 py-3 text-white placeholder-[#bca39a]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bca39a] text-sm pointer-events-none">Servings</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#bca39a]">Best Before</label>
              <input
                type="datetime-local"
                value={bestBefore}
                onChange={e => setBestBefore(e.target.value)}
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
            <label className="text-sm font-medium text-[#bca39a]">Food Photo <span className="text-[#5a433a]">(optional)</span></label>

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                if (f.size > 3 * 1024 * 1024) { setFormError('Image must be under 3 MB.'); return }
                setImageFile(f)
                setImagePreview(URL.createObjectURL(f))
                setFormError('')
              }}
            />

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-[#3a2c27] group">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null) }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
                <div className="absolute bottom-2 left-2 text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                  {(imageFile.size / 1024).toFixed(0)} KB
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#3a2c27] rounded-xl bg-[#181210]/50 hover:bg-[#181210] hover:border-primary/50 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="bg-[#23140f] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                </div>
                <p className="text-white font-medium">Click to upload a food photo</p>
                <p className="text-[#bca39a] text-sm mt-1">JPG, PNG, WebP or GIF · max 3 MB</p>
              </div>
            )}
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
                <div className="flex size-5 border-2 border-[#3a2c27] rounded bg-[#181210] peer-checked:bg-primary peer-checked:border-primary transition-all items-center justify-center">
                  {safety && <span className="material-symbols-outlined text-white text-xs font-bold leading-none">check</span>}
                </div>
              </div>
              <span className="text-sm text-[#bca39a] group-hover:text-white transition-colors">
                I certify that this food is safe for consumption and has been handled according to hygiene standards.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isCreating || uploading}
            className={`w-full bg-primary hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
              isCreating || uploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <><span className="material-symbols-outlined animate-spin text-[20px]">cloud_upload</span>Uploading photo…</>
            ) : isCreating ? (
              <><span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>Posting...</>
            ) : (
              <>Post Donation<span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
