import { useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import toast from 'react-hot-toast'

const INPUT_CLS = "w-full bg-[#181210] border border-[#4a352f] rounded-lg px-4 py-3 text-white placeholder-[#7a5a50] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
const LABEL_CLS = "block text-sm font-medium text-[#d6c1ba] mb-1.5"

function Section({ title, icon, children }) {
  return (
    <div className="bg-[#2f1d17] border border-[#4a352f] rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3 pb-3 border-b border-[#4a352f]">
        <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        <h3 className="text-white font-bold text-base">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Toggle({ label, desc, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked ?? false)
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-[#bca39a] text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none
          ${on ? 'bg-primary' : 'bg-[#4a352f]'}`}
      >
        <span className={`inline-block size-5 rounded-full bg-white shadow transform transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

export default function AdminSettings() {
  const [appName, setAppName]         = useState('Annadaan')
  const [supportEmail, setSupportEmail] = useState('support@annadaan.org')
  const [claimExpiry, setClaimExpiry] = useState('24')
  const [maxServings, setMaxServings] = useState('500')
  const [saved, setSaved]             = useState(false)

  const handleSave = () => {
    setSaved(true)
    toast.success('Settings saved successfully!')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[#181210] text-slate-100 font-display min-h-screen flex flex-col md:flex-row overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#181210]">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#4a352f]/50 bg-[#181210]/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h2>
            <p className="text-[#d6c1ba] text-sm mt-1">Configure Annadaan platform behaviour and policies</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
              ${saved ? 'bg-green-600 text-white' : 'bg-primary hover:bg-orange-700 text-white shadow-lg shadow-primary/20'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{saved ? 'check_circle' : 'save'}</span>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </header>

        <div className="p-6 md:p-8 flex flex-col gap-6 max-w-[900px] w-full mx-auto">

          {/* General */}
          <Section title="General" icon="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={LABEL_CLS}>Platform Name</label>
                <input type="text" className={INPUT_CLS} value={appName} onChange={e => setAppName(e.target.value)} />
              </div>
              <div>
                <label className={LABEL_CLS}>Support Email</label>
                <input type="email" className={INPUT_CLS} value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Platform Tagline</label>
              <input type="text" className={INPUT_CLS} defaultValue="Bridge the Gap — Connect Surplus to Need" />
            </div>
          </Section>

          {/* Listing Policies */}
          <Section title="Listing Policies" icon="policy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={LABEL_CLS}>Claim Expiry Window (hours)</label>
                <input type="number" className={INPUT_CLS} value={claimExpiry} onChange={e => setClaimExpiry(e.target.value)} min="1" max="168" />
                <p className="text-[#bca39a] text-xs mt-1.5">How long a claim stays open before auto-expiring</p>
              </div>
              <div>
                <label className={LABEL_CLS}>Max Servings Per Listing</label>
                <input type="number" className={INPUT_CLS} value={maxServings} onChange={e => setMaxServings(e.target.value)} min="1" max="10000" />
                <p className="text-[#bca39a] text-xs mt-1.5">Upper limit on servings a donor can post at once</p>
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Notifications" icon="notifications">
            <div className="flex flex-col divide-y divide-[#4a352f]">
              <Toggle label="New listing alerts"       desc="Notify NGOs when a new food listing is posted"         defaultChecked={true}  />
              <Toggle label="Claim approval alerts"    desc="Notify donors when their listing is claimed"            defaultChecked={true}  />
              <Toggle label="Delivery updates"         desc="Notify all parties when delivery status changes"        defaultChecked={true}  />
              <Toggle label="KYC review reminders"     desc="Remind admin weekly of pending KYC verifications"       defaultChecked={false} />
              <Toggle label="Expiry warnings"          desc="Alert donors when listing expires in under 6 hours"     defaultChecked={true}  />
            </div>
          </Section>

          {/* KYC */}
          <Section title="KYC & Verification" icon="verified_user">
            <div className="flex flex-col divide-y divide-[#4a352f]">
              <Toggle label="Require KYC for NGOs"           desc="NGOs must pass KYC before they can claim listings"  defaultChecked={true}  />
              <Toggle label="Auto-approve verified NGOs"      desc="Skip manual review for NGOs with valid government ID" defaultChecked={false} />
              <Toggle label="Allow listing without KYC"       desc="Temporarily allow listing during KYC review period"  defaultChecked={true}  />
            </div>
          </Section>

          {/* Danger zone */}
          <Section title="Danger Zone" icon="warning">
            <p className="text-[#bca39a] text-sm">These actions are irreversible. Proceed with extreme caution.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => toast.error('Reset blocked — this would clear all listings!')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-bold transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Clear all expired listings
              </button>
              <button
                onClick={() => toast.error('Export blocked — contact your Appwrite project admin.')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#4a352f] text-[#d6c1ba] hover:bg-[#4a352f] text-sm font-bold transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export database backup
              </button>
            </div>
          </Section>
        </div>
      </main>
    </div>
  )
}
