const NGOs = [
  {
    id: 1,
    name: 'Hope Foundation',
    location: 'Mumbai, MH',
    initial: 'H',
    avatarBg: 'bg-indigo-500/20 text-indigo-400',
    regId: 'NGO-8821',
    date: 'Oct 24, 2023',
    docs: ['description', 'badge'],
    status: 'Pending Review',
    statusBg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    flagged: false,
  },
  {
    id: 2,
    name: 'Food For All',
    location: 'Delhi, DL',
    initial: 'F',
    avatarBg: 'bg-green-500/20 text-green-400',
    regId: 'NGO-9932',
    date: 'Oct 23, 2023',
    docs: ['description'],
    status: 'Pending Review',
    statusBg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    flagged: false,
  },
  {
    id: 3,
    name: 'City Shelter',
    location: 'Bangalore, KA',
    initial: 'C',
    avatarBg: 'bg-orange-500/20 text-orange-400',
    regId: 'NGO-1120',
    date: 'Oct 23, 2023',
    docs: ['description', 'badge', 'folder'],
    status: 'Under Review',
    statusBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    flagged: false,
  },
  {
    id: 4,
    name: 'Hunger Free',
    location: 'Pune, MH',
    initial: 'H',
    avatarBg: 'bg-red-500/20 text-red-400',
    regId: 'NGO-7729',
    date: 'Oct 21, 2023',
    docs: ['warning'],
    status: 'Flagged',
    statusBg: 'bg-red-500/10 text-red-500 border-red-500/20',
    flagged: true,
  },
]

export default function KycTable() {
  return (
    <div className="flex flex-col bg-[#2f1d17] border border-[#4a352f] rounded-2xl shadow-xl overflow-hidden">
      
      {/* Table Controls */}
      <div className="p-4 border-b border-[#4a352f] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d6c1ba] text-lg">search</span>
            <input 
              type="text" 
              placeholder="Search NGO or Reg. ID..." 
              className="bg-[#23140f] border border-[#4a352f] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 placeholder-[#d6c1ba]/50" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#4a352f] text-[#d6c1ba] text-sm font-medium hover:bg-[#4a352f] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filter
          </button>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              import('react-hot-toast').then(({ default: toast }) => {
                toast.success('Approved selected NGOs. Notification emails sent.');
              });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600/10 border border-green-600/20 text-green-500 text-sm font-bold hover:bg-green-600 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-lg">check</span>
            Approve Selected
          </button>
          <button 
            onClick={() => {
              import('react-hot-toast').then(({ default: toast }) => {
                toast.error('Rejected selected NGOs. They have been notified.');
              });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 text-sm font-bold hover:bg-red-600 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
            Reject Selected
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4a352f]/30 text-[#d6c1ba] text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 w-12 text-center">
                <input type="checkbox" className="rounded border-[#4a352f] bg-[#23140f] text-primary focus:ring-primary focus:ring-offset-[#2f1d17]" />
              </th>
              <th className="p-4 min-w-[200px]">NGO Name</th>
              <th className="p-4">Reg. Number</th>
              <th className="p-4">Submission Date</th>
              <th className="p-4">Documents</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4a352f] text-sm">
            {NGOs.map((ngo) => (
              <tr key={ngo.id} className={`group hover:bg-[#4a352f]/20 transition-colors ${ngo.flagged ? 'bg-red-900/10' : ''}`}>
                <td className="p-4 text-center">
                  <input type="checkbox" className="rounded border-[#4a352f] bg-[#23140f] text-primary focus:ring-primary focus:ring-offset-[#2f1d17]" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${ngo.avatarBg} flex items-center justify-center font-bold`}>
                      {ngo.initial}
                    </div>
                    <div>
                      <p className="font-medium text-white">{ngo.name}</p>
                      <p className="text-xs text-[#d6c1ba]">{ngo.location}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[#d6c1ba] font-mono">{ngo.regId}</td>
                <td className="p-4 text-[#d6c1ba]">{ngo.date}</td>
                <td className="p-4">
                  <div className="flex -space-x-2">
                    {ngo.docs.map((doc, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-[#4a352f] border-2 border-[#2f1d17] flex items-center justify-center text-xs text-[#d6c1ba] cursor-pointer hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[16px]">{doc}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${ngo.statusBg}`}>
                    {ngo.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className={`flex items-center justify-end gap-2 transition-opacity ${ngo.flagged ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button className={`p-1.5 rounded-lg transition-colors title="Approve" ${ngo.flagged ? 'bg-green-600/10 hover:bg-green-600/20 text-green-500' : 'hover:bg-green-600/20 text-[#d6c1ba] hover:text-green-500'}`}>
                      <span className="material-symbols-outlined">check_circle</span>
                    </button>
                    <button className={`p-1.5 rounded-lg transition-colors title="Reject" ${ngo.flagged ? 'bg-red-600/10 hover:bg-red-600/20 text-red-500' : 'hover:bg-red-600/20 text-[#d6c1ba] hover:text-red-500'}`}>
                      <span className="material-symbols-outlined">cancel</span>
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[#4a352f] text-[#d6c1ba] hover:text-white transition-colors" title="View Details">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-[#4a352f] flex items-center justify-between text-sm text-[#d6c1ba]">
        <p>Showing <span className="text-white font-medium">1-4</span> of <span className="text-white font-medium">48</span> results</p>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1.5 rounded-lg border border-[#4a352f] hover:bg-[#4a352f] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
          <button className="px-3 py-1.5 rounded-lg border border-[#4a352f] hover:bg-[#4a352f] hover:text-white transition-colors">Next</button>
        </div>
      </div>

    </div>
  )
}
