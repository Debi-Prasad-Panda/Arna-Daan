import { useEffect, useState, useCallback } from 'react'
import useUserProfileStore from '../store/userProfileStore'
import { useRealtime } from '../hooks/useRealtime'
import toast from 'react-hot-toast'

// Placeholder colours for avatars
const AVATAR_COLORS = [
  'bg-indigo-500/20 text-indigo-400',
  'bg-green-500/20 text-green-400',
  'bg-orange-500/20 text-orange-400',
  'bg-red-500/20 text-red-400',
  'bg-purple-500/20 text-purple-400',
  'bg-blue-500/20 text-blue-400',
]

// Per-profile KYC status — we derive this from the role for now
function getKycStatus(role) {
  if (role === 'admin') return { label: 'Admin',          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
  if (role === 'ngo')   return { label: 'Pending Review', bg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' }
  if (role === 'volunteer') return { label: 'Active',     bg: 'bg-green-500/10 text-green-400 border-green-500/20' }
  return                       { label: 'Verified',       bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
}

const ROLE_ICON = {
  donor:    'restaurant',
  ngo:      'groups',
  volunteer:'local_shipping',
  admin:    'admin_panel_settings',
}

export default function KycTable() {
  const { profiles, isLoading, fetchProfiles } = useUserProfileStore()
  const [search, setSearch] = useState('')

  useEffect(() => { fetchProfiles() }, [])

  // Refresh when a new user registers (Realtime on users collection)
  const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
  const handleNewUser = useCallback(() => fetchProfiles(), [])
  useRealtime(usersCollectionId, handleNewUser)

  const filtered = profiles.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.role?.toLowerCase().includes(search.toLowerCase())
  )

  const approveUser = async (profile) => {
    toast.success(`${profile.name} approved! (Would set status in Appwrite.)`)
  }

  const rejectUser = async (profile) => {
    toast.error(`${profile.name} rejected. (Would update status in Appwrite.)`)
  }

  return (
    <div className="flex flex-col bg-[#2f1d17] border border-[#4a352f] rounded-2xl shadow-xl overflow-hidden">

      {/* Controls */}
      <div className="p-4 border-b border-[#4a352f] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d6c1ba] text-lg">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email or role..."
              className="bg-[#23140f] border border-[#4a352f] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 placeholder-[#d6c1ba]/50"
            />
          </div>
          <button onClick={fetchProfiles} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#4a352f] text-[#d6c1ba] text-sm font-medium hover:bg-[#4a352f] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4a352f]/30 text-[#d6c1ba] text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 min-w-[220px]">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">KYC Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4a352f] text-sm">
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#bca39a]">
                  <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
                </td>
              </tr>
            )}

            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#bca39a]">
                    <span className="material-symbols-outlined text-4xl">person_off</span>
                    <p className="text-sm">
                      {profiles.length === 0
                        ? 'No registered users yet. Users who sign up will appear here automatically.'
                        : 'No users match your search.'}
                    </p>
                    {profiles.length === 0 && (
                      <p className="text-xs text-[#bca39a]/60 mt-1">
                        Note: Ensure <code className="bg-[#3a2c27] px-1 rounded">VITE_APPWRITE_USERS_COLLECTION_ID</code> is set in .env.local
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && filtered.map((profile, i) => {
              const kycStatus = getKycStatus(profile.role)
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
              const icon = ROLE_ICON[profile.role] || 'person'
              const joined = profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—'

              return (
                <tr key={profile.$id} className="group hover:bg-[#4a352f]/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center font-bold`}>
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{profile.name}</p>
                        <p className="text-xs text-[#d6c1ba]">{profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[#d6c1ba] capitalize">{profile.role}</span>
                  </td>
                  <td className="p-4 text-[#d6c1ba] text-xs">{joined}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${kycStatus.bg}`}>
                      {kycStatus.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => approveUser(profile)}
                        className="p-1.5 rounded-lg hover:bg-green-600/20 text-[#d6c1ba] hover:text-green-500 transition-colors"
                        title="Approve"
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                      </button>
                      <button
                        onClick={() => rejectUser(profile)}
                        className="p-1.5 rounded-lg hover:bg-red-600/20 text-[#d6c1ba] hover:text-red-500 transition-colors"
                        title="Reject"
                      >
                        <span className="material-symbols-outlined">cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#4a352f] flex items-center justify-between text-sm text-[#d6c1ba]">
        <p>
          Showing <span className="text-white font-medium">{filtered.length}</span>{' '}
          of <span className="text-white font-medium">{profiles.length}</span> registered users
        </p>
        <div className="flex items-center gap-2 text-xs text-[#bca39a]">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          Live via Appwrite Realtime
        </div>
      </div>
    </div>
  )
}
