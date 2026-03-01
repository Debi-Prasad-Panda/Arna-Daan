const CARDS = [
  {
    id: 1,
    title: '50 Vegetarian Meals',
    donor: 'Green Leaf Bistro',
    distance: '2.5 km',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxIT36yDx143kNTXmSITHBt-ZqHSHEVOI_MZ1h9RDpm15y6rlHeReuvoulJeYFAkRsBv-vrzom66foOtb96HpCRldwXGsC9C3d23QR5mg0aFxJK1CpZ5kL_6C_-io7KVZN0f-PKfmgPmlibdMGGU9G-a1NIhSO3shumEYNE2bviyiHr3fKI_iXPY-iKec1HpSknXmCMwcWEsThZ-4nvgzjL7BDAWrsY8_JQz1xHQcCefKYEqbozg17GdR6togmTVcoWnCKADe9pA',
    urgent: true,
    urgentLabel: 'Expiring Soon',
    urgentIcon: 'timer',
    typeIcon: 'restaurant',
    typeLabel: 'Ready to eat',
    timeLabel: '< 2 hours',
  },
  {
    id: 2,
    title: 'Assorted Raw Veggies',
    donor: 'City Market Co-op',
    distance: '4.2 km',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAadeTglXWoMQx-S2wpVMzZxIso5HQQnPTa7hecrdsCbpv7zsYCBIRB1sInaKZ1WsJlppi-CInNExl4LDMDgIMv2obMWbJKUBeRfSIGC29GUcG8uQ3_jpmOMam6wKJFv3bAyzToELj4hnwgnbMWJga-QgEKiS33JFo-pcyrbTlI_Xe4vQSDKgCV_9z-p8SNf5EUAKBR-mSG_lnu31L2bNi3zHmEeGZFTYwvbxSR1r5xSIhIKpTDyEgT6cTVZL4fMR_bfb2fY7VEOg',
    urgent: false,
    typeIcon: 'grocery',
    typeLabel: 'Raw Ingredients',
    timeLabel: '24 hours',
  },
  {
    id: 3,
    title: '20 Frozen Pizzas',
    donor: 'Dominos Downtown',
    distance: '1.8 km',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDaT_JjepvGoVLxW0CnyzykaEe4reQ2axAa5WbAcCpBaCe6d5mk8-Ms_s_VUjh-i1o7lf98gsL1zn0iNifJj_4_QDHaoD1KgoTCrssh6S97N8TNR3iAH06gQ1pdk42zVafGfe0XSB7ipXBwq-oJnTr7fi1nyRYS1PRi8Tu7Q5PhiujfDpeY2VRyvU1yvkt5eFT-vxFNLFod1Q_nvk6NeCl252ErgOaOQ1YZNWh4uwqzEi1UYkb7nn6fX-GhQSuSGdfmwT0WfulA',
    urgent: false,
    badgeBg: 'bg-blue-500/90',
    badgeLabel: 'Frozen',
    badgeIcon: 'severe_cold',
    typeIcon: 'ac_unit',
    typeLabel: 'Frozen',
    timeLabel: '48 hours',
  },
  {
    id: 4,
    title: 'Surplus Bread Loaves',
    donor: "Baker's Dozen",
    distance: '5.0 km',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABqOUB349kfkdi1amD3D63mFuoeJRAhV4M7YJwX2Z7QGlm6B-PffpLbEiqqR4qd1hKUxmHm4S2Oyj4gyxgnrES8sRTiEX13yuFm4rfWRJ7F_j-da2blvkvecsV5attnmYhhkfHbuHvGnvp8XvTLXQHcYh_QGLRVWBtbN6h1bgOlAiOWOHbe4uR6s7wv7Pj83Yy_NKXqHQnsdl2Z74V8c6162-AALoDdnEaAesk07N1hoK3usN_O5RqqNgYqlAuMJUFkZSKgEnTMg',
    urgent: false,
    typeIcon: 'bakery_dining',
    typeLabel: 'Baked Goods',
    timeLabel: '12 hours',
  },
  {
    id: 5,
    title: '100 Pasta Portions',
    donor: 'Italian Feast Events',
    distance: '0.8 km',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWxrx_NiY4XZ--fGgRh5MiO2i_Vq-QtlCKYaiU33Kk-LxTIZtqsOarLzDjPQtA3xzX8-KvfGJ2zucCbtEXfeSL9ni3IJ8yCWIiVp_-xdgo-wdPerjdsg44H9G3a4mEIGJ1VrHxMnOfEMjhF5HIrHs-7maWtz4nHbc6g3dyqCt0ZqYNtyfxQ4p6xY7CnJfqy9zAP2BTjo2U4g5HB-ANsAQ6et-he-72ZN_rc242SBI7B70ObsyQ2tm86NF9BS3hL2vZeVeIQ2p_8A',
    urgent: true,
    urgentLabel: 'Urgent Pickup',
    urgentIcon: 'timer',
    typeIcon: 'restaurant_menu',
    typeLabel: 'Bulk Meal',
    timeLabel: '< 1 hour',
  },
  {
    id: 6,
    title: 'Fresh Seasonal Fruit',
    donor: 'Whole Foods Local',
    distance: '6.5 km',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqkClQ7sn0QeM834bquPPoRC5nQHQ27ovwr18mVS2biJsaL4AiTUaZIA5OAPYJKRwK64iBEnNxSZRYRKmvy17O2i-EfxwoNFdAGhr8Gmxo3Ara7gAj5494ntcUI1TP2qouMgtrpFGnm6W6kWmE_sbALDJKuCnjObpUeWcSQjMBs7iPh0-ju6KKhST5sQGi2IyoPnVLvjyLd3U47U8jO-jR6pKVmUuIewdbVCgy9If4qAKE7YiHFF5MQNguC245wwZkzLasISiecw',
    urgent: false,
    typeIcon: 'nutrition',
    typeLabel: 'Fresh Produce',
    timeLabel: '3 days',
  },
]

function FeedCard({ card }) {
  return (
    <div className="group bg-[#2c1a15] rounded-xl overflow-hidden border border-[#3a2c27] hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-[#3a2c27]">
        {/* Urgent or Custom Tag */}
        {(card.urgent || card.badgeLabel) && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-white text-xs font-bold backdrop-blur-sm shadow-sm ${card.urgent ? 'bg-red-500/90' : card.badgeBg}`}>
              <span className="material-symbols-outlined text-[14px]">
                {card.urgent ? card.urgentIcon : card.badgeIcon}
              </span>
              {card.urgent ? card.urgentLabel : card.badgeLabel}
            </span>
          </div>
        )}
        
        {/* Favorite */}
        <div className="absolute top-3 right-3 z-10">
          <button className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors">
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </button>
        </div>

        {/* Image */}
        <div 
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
          style={{ backgroundImage: `url('${card.img}')` }}
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">{card.title}</h3>
            <p className="text-sm text-[#bca39a] mt-1">{card.donor}</p>
          </div>
          <div className="flex items-center justify-center bg-[#3a2c27] rounded-lg px-2 py-1">
            <span className="text-xs font-bold text-white">{card.distance}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 my-3 text-sm text-[#bca39a]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">{card.typeIcon}</span>
            <span>{card.typeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[18px] ${card.urgent ? 'text-primary' : 'text-slate-400'}`}>schedule</span>
            <span className={card.urgent ? 'text-primary' : ''}>{card.timeLabel}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-[#3a2c27] flex gap-3">
          <button className="flex-1 bg-primary hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
            <span>Claim Now</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FeedGrid() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {CARDS.map(c => <FeedCard key={c.id} card={c} />)}
      </div>
      
      {/* Load More */}
      <div className="mt-12 mb-8 flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#3a2c27] bg-[#2c1a15] text-[#bca39a] hover:text-white hover:border-primary/50 transition-colors font-semibold">
          <span>Load more donations</span>
          <span className="material-symbols-outlined text-[20px]">expand_more</span>
        </button>
      </div>
    </>
  )
}
