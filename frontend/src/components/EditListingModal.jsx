import { useState, useEffect } from 'react';
import useListingStore from '../store/listingStore';

const dietOptions = [
  { value: 'VEG', label: 'Vegetarian', dot: 'bg-green-500', checked: 'peer-checked:bg-green-900/30 peer-checked:border-green-500 peer-checked:text-green-400' },
  { value: 'NON-VEG', label: 'Non-Veg', dot: 'bg-red-500', checked: 'peer-checked:bg-red-900/30 peer-checked:border-red-500 peer-checked:text-red-400' },
  { value: 'VEGAN', label: 'Vegan', dot: 'bg-yellow-500', checked: 'peer-checked:bg-yellow-900/30 peer-checked:border-yellow-500 peer-checked:text-yellow-400' },
];

export default function EditListingModal({ listing, onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bestBefore, setBestBefore] = useState('');
  const [diet, setDiet] = useState('');
  const [ingredients, setIngredients] = useState('');

  const updateListing = useListingStore((state) => state.updateListing);
  const isUpdating = useListingStore((state) => state.isLoading);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (listing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(listing.title || '');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(listing.category || 'Cooked Meals');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(listing.address || '');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuantity(listing.quantity?.toString() || '');
      
      // format bestBefore specifically for datetime-local input
      if (listing.bestBefore) {
        try {
            const dt = new Date(listing.bestBefore);
            // Needs format: YYYY-MM-DDThh:mm
            const iso = dt.toISOString().slice(0, 16);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBestBefore(iso);
        } catch {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBestBefore(listing.bestBefore);
        }
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBestBefore('');
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiet(listing.diet || 'VEG');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIngredients(listing.ingredients || '');
    }
  }, [listing]);

  if (!listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !quantity || !bestBefore) {
      setFormError('Please fill in required fields: Title, Quantity, Best Before.');
      return;
    }
    setFormError('');

    try {
      await updateListing(listing.$id, {
        title,
        category,
        quantity: parseInt(quantity, 10),
        bestBefore,
        diet,
        address: address.trim() || null,
        ingredients: ingredients.trim() || null
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Failed to update listing.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#181210] border border-[#3a2c27] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit_square</span> Edit Listing
          </h2>
          <button onClick={onClose} className="text-[#bca39a] hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {formError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-sm font-medium">
            {formError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#bca39a]">Food Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#23140f] border border-[#3a2c27] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#bca39a]">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#23140f] border border-[#3a2c27] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none"
              >
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Raw Ingredients">Raw Ingredients</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Baked Goods">Baked Goods</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#bca39a]">Pickup Address (optional)</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-[#23140f] border border-[#3a2c27] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#bca39a]">Quantity (approx. servings)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-[#23140f] border border-[#3a2c27] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#bca39a]">Best Before</label>
              <input
                type="datetime-local"
                value={bestBefore}
                onChange={e => setBestBefore(e.target.value)}
                className="w-full bg-[#23140f] border border-[#3a2c27] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#bca39a]">Dietary Type</label>
            <div className="flex flex-wrap gap-2">
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
                  <div className={`px-3 py-1.5 rounded-lg border border-[#3a2c27] bg-[#23140f] text-[#bca39a] text-sm transition-all flex items-center gap-2 ${opt.checked} peer-checked:cursor-default`}>
                    <span className={`size-1.5 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#bca39a]">Ingredients (optional)</label>
            <textarea
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              rows="2"
              className="w-full bg-[#23140f] border border-[#3a2c27] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#3a2c27]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-[#3a2c27] text-white hover:bg-[#3a2c27] transition-colors text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className={`flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-orange-700 text-white transition-colors text-sm font-bold flex items-center justify-center gap-2 ${isUpdating ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isUpdating ? <span className="material-symbols-outlined font-sm animate-spin">refresh</span> : null}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
