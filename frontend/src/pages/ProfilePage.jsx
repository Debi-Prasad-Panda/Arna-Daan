import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore, { getHomeRoute } from '../store/authStore'
import useListingStore from '../store/listingStore'
import useDeliveryStore from '../store/deliveryStore'
import useRequestStore from '../store/requestStore'
import { account } from '../lib/appwrite'
import toast from 'react-hot-toast'

function ProfileNav() {
  const { role, logout } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/login') }
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#3a2c27] bg-[#181210]/95 backdrop-blur-md px-6 py-4 lg:px-12">
      <Link to="/" className="flex items-center gap-3 text-primary">
        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">volunteer_activism</span>
        </div>
        <h2 className="text-white text-xl font-extrabold tracking-tight">Annadaan</h2>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link to={getHomeRoute(role)} className="text-sm font-medium text-[#bca39a] hover:text-white transition-colors">Dashboard</Link>
        <Link to="/community" className="text-sm font-medium text-[#bca39a] hover:text-white transition-colors">Community</Link>
        <Link to="/profile" className="text-sm font-bold text-primary">Profile</Link>
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  )
}

export default function ProfilePage() {
  const { user, role } = useAuthStore()
  const [name, setName]         = useState(user?.name || '')
  const [oldPwd, setOldPwd]     = useState('')
  const [newPwd, setNewPwd]     = useState('')
  const [saving, setSaving]     = useState(false)

  const { listings, fetchListings }     = useListingStore()
  const { deliveries, fetchDeliveries } = useDeliveryStore()
  const { requests, fetchRequests }     = useRequestStore()

  useEffect(() => { fetchListings(); fetchDeliveries(); fetchRequests() }, [fetchListings, fetchDeliveries, fetchRequests])

  // Real stats based on role
  const myListings   = listings.filter(l => l.donorId === user?.$id)
  const myDeliveries = deliveries.filter(d => d.volunteerId === user?.$id)
  const myRequests   = requests.filter(r => r.receiverId === user?.$id)
  const totalMeals   = myListings.reduce((s, l) => s + (Number(l.quantity) || 0), 0)

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    setSaving(true)
    try {
      // Update display name in Appwrite
      if (name !== user?.name) {
        await account.updateName(name)
      }
      // Update password if provided
      if (newPwd && oldPwd) {
        await account.updatePassword(newPwd, oldPwd)
        setOldPwd(''); setNewPwd('')
        toast.success('Password updated!')
      }
      // Refresh user in auth store
      await useAuthStore.getState().checkAuth()
      toast.success('Profile saved!')
    } catch (e) {
      toast.error(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const ROLE_META = {
    donor:     { icon: 'restaurant',      label: 'Food Donor',     color: 'text-primary',    bg: 'bg-primary/15' },
    ngo:       { icon: 'groups',           label: 'NGO / Receiver', color: 'text-blue-400',   bg: 'bg-blue-400/15' },
    volunteer: { icon: 'local_shipping',   label: 'Volunteer',      color: 'text-green-400',  bg: 'bg-green-400/15' },
    admin:     { icon: 'admin_panel_settings', label: 'Admin',      color: 'text-purple-400', bg: 'bg-purple-400/15' },
  }
  const meta = ROLE_META[role] || ROLE_META.donor

  return (
    <div className="min-h-screen bg-[#181210] font-display text-white">
      <ProfileNav />

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">

        {/* Profile header card */}
        <div className="relative bg-gradient-to-br from-[#23140f] to-[#181210] border border-[#3a2c27] rounded-3xl p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-6">
            <div className={`size-20 rounded-2xl ${meta.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined text-4xl ${meta.color}`}>{meta.icon}</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{user?.name || 'Your Name'}</h1>
              <p className="text-[#bca39a] text-sm mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${meta.bg} ${meta.color}`}>{meta.label}</span>
                <span className="text-xs text-[#bca39a]">Member since {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'recently'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        {(() => {
          const profileStats = role === 'donor' ? [
            { icon: 'restaurant',     label: 'Meals Donated',   val: totalMeals > 0 ? totalMeals.toLocaleString('en-IN') : '0', color: 'text-primary' },
            { icon: 'inventory_2',    label: 'Listings Posted', val: myListings.length, color: 'text-orange-400' },
            { icon: 'groups',         label: 'People Helped',   val: Math.round(totalMeals * 0.9), color: 'text-blue-400' },
          ] : role === 'volunteer' ? [
            { icon: 'local_shipping', label: 'Deliveries Done', val: myDeliveries.filter(d => d.status === 'Delivered').length, color: 'text-green-400' },
            { icon: 'radio_button_checked', label: 'Active Missions', val: myDeliveries.filter(d => d.status !== 'Delivered').length, color: 'text-primary' },
            { icon: 'groups',         label: 'Meals Delivered', val: myDeliveries.reduce((s, d) => s + (Number(d.quantity) || 0), 0), color: 'text-blue-400' },
          ] : role === 'ngo' ? [
            { icon: 'receipt_long',   label: 'Claims Made',  val: myRequests.length, color: 'text-blue-400' },
            { icon: 'check_circle',   label: 'Delivered',    val: myRequests.filter(r => r.status === 'Delivered').length, color: 'text-green-400' },
            { icon: 'hourglass_empty', label: 'Pending',     val: myRequests.filter(r => r.status === 'Pending').length, color: 'text-yellow-400' },
          ] : [
            { icon: 'restaurant',     label: 'Meals Rescued', val: listings.reduce((s, l) => s + (Number(l.quantity) || 0), 0).toLocaleString('en-IN'), color: 'text-primary' },
            { icon: 'local_shipping', label: 'Deliveries',   val: deliveries.length, color: 'text-green-400' },
            { icon: 'groups',         label: 'Users Managed', val: '—', color: 'text-blue-400' },
          ]
          return (
            <div className="grid grid-cols-3 gap-4">
              {profileStats.map(s => (
                <div key={s.label} className="bg-[#23140f] border border-[#3a2c27] rounded-2xl p-4 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                  <span className={`material-symbols-outlined text-2xl mb-1 ${s.color}`}>{s.icon}</span>
                  <p className="text-xl font-black text-white">{s.val}</p>
                  <p className="text-[10px] text-[#bca39a] font-medium mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          )
        })()}


        {/* Edit profile form */}
        <div className="bg-[#23140f] border border-[#3a2c27] rounded-3xl p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>

          <div>
            <label className="block text-sm font-bold text-[#bca39a] mb-2">Display Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#181210] border-2 border-[#3a2c27] focus:border-primary text-white rounded-xl px-4 py-3 outline-none transition-colors font-medium"
              placeholder="Your full name or organisation name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#bca39a] mb-2">Email Address</label>
            <input
              value={user?.email || ''}
              readOnly
              className="w-full bg-[#181210] border-2 border-[#3a2c27] text-[#bca39a] rounded-xl px-4 py-3 outline-none cursor-not-allowed font-medium"
            />
            <p className="text-xs text-[#bca39a] mt-1">Email cannot be changed here.</p>
          </div>

          {/* Change password */}
          <div className="border-t border-[#3a2c27] pt-5">
            <p className="text-sm font-bold text-[#bca39a] mb-3">Change Password <span className="text-[#5a433a] font-normal">(optional)</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#bca39a] mb-1.5">Current Password</label>
                <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)}
                  className="w-full bg-[#181210] border-2 border-[#3a2c27] focus:border-primary text-white rounded-xl px-4 py-3 outline-none transition-colors font-medium text-sm"
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs text-[#bca39a] mb-1.5">New Password</label>
                <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  className="w-full bg-[#181210] border-2 border-[#3a2c27] focus:border-primary text-white rounded-xl px-4 py-3 outline-none transition-colors font-medium text-sm"
                  placeholder="Min 8 characters" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#bca39a] mb-2">Role</label>
            <div className={`flex items-center gap-3 ${meta.bg} border border-[#3a2c27] rounded-xl px-4 py-3`}>
              <span className={`material-symbols-outlined ${meta.color}`}>{meta.icon}</span>
              <span className={`font-bold ${meta.color}`}>{meta.label}</span>
              <span className="ml-auto text-xs text-[#bca39a]">Contact admin to change</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            {saving ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">save</span>}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 flex flex-col gap-3">
          <h3 className="font-bold text-red-400 text-sm uppercase tracking-wider">Danger Zone</h3>
          <p className="text-[#bca39a] text-sm">Log out from all devices or request account deletion.</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={async () => { const { logout } = useAuthStore.getState(); await logout(); window.location.href = '/login' }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3a2c27] hover:bg-red-500/20 text-red-400 font-bold text-sm rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span> Log Out
            </button>
            <button
              onClick={() => toast.error('Please contact support to delete your account.')}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 font-bold text-sm rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">delete_forever</span> Delete Account
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}
