'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Star, Wifi, Coffee, Car, UtensilsCrossed, Phone, ChevronDown, Shield, Zap } from 'lucide-react';

interface SearchResult {
  room_id: number;
  room_type: string;
  price_per_night: string;
  availability_status: string;
  hotel_name: string;
  location: string;
  rating: string;
}

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=350&fit=crop&q=80',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const locationQuery = searchParams.get('location') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/search?location=${encodeURIComponent(locationQuery)}`)
      .then((r) => r.json())
      .then((data) => { setResults(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [locationQuery]);

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price_per_night) - parseFloat(b.price_per_night);
    if (sortBy === 'price-high') return parseFloat(b.price_per_night) - parseFloat(a.price_per_night);
    if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
    return 0;
  });

  const renderStars = (rating: number) =>
    [...Array(Math.floor(rating))].map((_, i) => <Star key={i} size={12} fill="#fbbf24" className="text-yellow-400" />);

  return (
    <div>
      <div className="bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-col md:flex-row items-center gap-3">
          <div className="flex-[2] glass-card rounded-lg px-4 py-2"><span className="text-white text-sm font-medium">{locationQuery || 'All Locations'}</span></div>
          <div className="flex-1 glass-card rounded-lg px-4 py-2 text-gray-400 text-sm">{searchParams.get('checkin') || 'Check-in'}</div>
          <div className="flex-1 glass-card rounded-lg px-4 py-2 text-gray-400 text-sm">{searchParams.get('checkout') || 'Check-out'}</div>
          <div className="flex-1 glass-card rounded-lg px-4 py-2 text-gray-400 text-sm">1 Room, 1 Guest</div>
          <button onClick={() => router.push('/')} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-amber-500/20">Modify Search</button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-bold">
            <span className="text-amber-400">{sortedResults.length}</span> Properties in <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{locationQuery || 'All Locations'}</span>
          </h2>
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none glass-card text-gray-300 rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer outline-none">
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="glass-card rounded-xl p-5 sticky top-20">
              <input type="text" placeholder="Search hotel name..." className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 px-3 py-2 mb-5 outline-none focus:border-blue-500/50" />
              <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold text-sm">Filters</h3><button className="text-blue-400 text-xs hover:underline">Reset</button></div>
              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5">
                <div className="flex items-center gap-2 mb-1"><Shield size={14} className="text-emerald-400" /><p className="text-emerald-400 font-bold text-sm">Price Guarantee</p></div>
                <p className="text-gray-500 text-xs">Cheapest price or we refund the difference</p>
              </div>
              <div className="border-b border-white/5 pb-4 mb-4">
                <h4 className="text-white font-semibold text-sm mb-3">Star Rating</h4>
                {[{ label: '5 Star', count: 470 }, { label: '4 Star', count: 2742 }, { label: '3 Star', count: 3546 }].map((s) => (
                  <label key={s.label} className="flex items-center gap-2 text-gray-400 text-sm mb-2.5 cursor-pointer hover:text-white transition-colors"><input type="checkbox" className="accent-blue-500 rounded" />{s.label}<span className="ml-auto text-gray-600 text-xs">{s.count}</span></label>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Searching best deals...</p>
              </div>
            ) : sortedResults.length === 0 ? (
              <div className="glass-card rounded-xl p-16 text-center">
                <p className="text-gray-400 text-lg mb-2">No hotels found matching &quot;{locationQuery}&quot;</p>
                <button onClick={() => router.push('/')} className="text-blue-400 hover:underline text-sm">← Back to search</button>
              </div>
            ) : sortedResults.map((room, idx) => (
              <div key={room.room_id} className="glass-card rounded-xl overflow-hidden flex flex-col md:flex-row hover:bg-white/[0.03] transition-all group">
                <div className="relative w-full md:w-[280px] h-[200px] md:h-auto shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={HOTEL_IMAGES[idx % HOTEL_IMAGES.length]} alt={room.hotel_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1"><Zap size={10} className="text-amber-400" /> GoAnywhere Choice</div>
                </div>
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-1"><span className="w-1 h-5 bg-gradient-to-b from-blue-400 to-violet-400 rounded-full shrink-0"></span><h3 className="text-blue-400 text-lg font-bold">{room.hotel_name}</h3></div>
                  <div className="flex items-center gap-1 ml-3 mb-1">{renderStars(parseFloat(room.rating) || 4)}</div>
                  <p className="text-blue-400/70 text-xs ml-3 mb-3 flex items-center gap-1"><MapPin size={11} /> {room.location}</p>
                  <p className="text-gray-300 text-sm ml-3 mb-1"><span className="text-gray-500">Room: </span><span className="font-medium text-white">{room.room_type}</span></p>
                  <p className="text-gray-600 text-sm ml-3 mb-3">Complimentary Wi-Fi</p>
                  <div className="flex flex-wrap gap-3 ml-3 mb-3">
                    {[{ icon: <Coffee size={11} />, label: 'Breakfast' }, { icon: <Wifi size={11} />, label: 'Wi-Fi' }, { icon: <Car size={11} />, label: 'Parking' }, { icon: <UtensilsCrossed size={11} />, label: 'Dining' }].map((a) => (
                      <span key={a.label} className="text-gray-500 text-[11px] flex items-center gap-1">{a.icon} {a.label}</span>
                    ))}
                  </div>
                  <p className="text-emerald-400 text-sm font-medium ml-3 mt-auto">✓ Free Cancellation</p>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-white/5 p-5 flex flex-col items-end justify-end min-w-[180px]">
                  <p className="text-white text-3xl font-bold">₹{parseFloat(room.price_per_night).toLocaleString()}</p>
                  <p className="text-gray-600 text-xs mb-4">+ ₹120 taxes / night</p>
                  <button className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-4 py-2 rounded-lg mb-2 transition-colors flex items-center gap-1.5 w-full justify-center"><Phone size={12} /> Call to Book</button>
                  <button onClick={() => { const slug = room.hotel_name.replace(/\s+/g, '-').toLowerCase(); router.push(`/hotel/${slug}?checkin=${searchParams.get('checkin') || ''}&checkout=${searchParams.get('checkout') || ''}`); }} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all w-full shadow-lg shadow-amber-500/10">View Rooms</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400 animate-pulse text-lg">Loading...</div>}><SearchContent /></Suspense>;
}
