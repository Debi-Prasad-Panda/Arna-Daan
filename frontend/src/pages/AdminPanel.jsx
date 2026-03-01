import AdminSidebar from '../components/AdminSidebar'
import AdminStatsGrid from '../components/AdminStatsGrid'
import KycTable from '../components/KycTable'

export default function AdminPanel() {
  return (
    <div className="bg-[#181210] text-slate-100 font-display min-h-screen flex flex-col md:flex-row overflow-hidden">
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#181210] relative">
        
        {/* Top Header Area */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#4a352f]/50 bg-[#181210]/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">KYC Verification Dashboard</h2>
            <p className="text-[#d6c1ba] text-sm mt-1">Review and approve NGO documentation to enable food distribution.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                import('react-hot-toast').then(({ default: toast }) => {
                  toast('No new notifications', { icon: '🔔' });
                });
              }}
              className="p-2 text-[#d6c1ba] hover:text-primary transition-colors relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </button>
            <div className="h-8 w-[1px] bg-[#4a352f]" />
            <div className="text-right hidden sm:block">
              <p className="text-xs text-[#d6c1ba]">Last login</p>
              <p className="text-sm font-medium text-white">Today, 09:42 AM</p>
            </div>
          </div>
        </header>
        
        <div className="p-8 flex flex-col gap-8 max-w-[1600px] w-full mx-auto">
          <AdminStatsGrid />
          <KycTable />
        </div>
      </main>
    </div>
  )
}
