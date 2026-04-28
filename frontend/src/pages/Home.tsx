import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CalendarDays, Users, Search, Shield, Sparkles, Clock, TrendingDown } from 'lucide-react';

const DESTINATIONS = [
  { name: 'Mumbai', tag: '120+ Hotels', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop&q=80' },
  { name: 'Chennai', tag: '85+ Hotels', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop&q=80' },
  { name: 'Goa', tag: '200+ Hotels', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop&q=80' },
  { name: 'Delhi', tag: '150+ Hotels', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=80' },
  { name: 'Jaipur', tag: '90+ Hotels', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop&q=80' },
  { name: 'Udaipur', tag: '75+ Hotels', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop&q=80' },
];

const FEATURES = [
  { icon: <TrendingDown size={22} />, title: 'Lowest Prices', desc: 'Best rate guarantee on every booking' },
  { icon: <Shield size={22} />, title: 'Secure Booking', desc: 'Your data is protected with SSL encryption' },
  { icon: <Clock size={22} />, title: 'Instant Confirmation', desc: 'Get booking confirmation in seconds' },
  { icon: <Sparkles size={22} />, title: 'Free Cancellation', desc: 'Cancel anytime with full refund' },
];

export default function Home() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 Room, 1 Guest');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      navigate(`/search?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}`);
    }
  };

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="hero-gradient px-6 pt-16 pb-24 relative">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Same hotel, Cheapest price!</span>
            </div>
            <h1 className="text-white text-5xl font-extrabold leading-tight mb-4">
              Discover Your
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent"> Perfect Stay</span>
            </h1>
            <p className="text-gray-400 text-lg mb-2">Find and book hotels at the best prices across India.</p>
            <p className="text-gray-500 text-sm">Powered by real-time database • MySQL + Flask</p>
          </div>
        </div>
      </section>

      {/* ============ SEARCH BAR ============ */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-10 relative z-20">
        <form
          onSubmit={handleSearch}
          className="glass-card rounded-2xl shadow-2xl shadow-black/40 flex flex-col md:flex-row items-stretch overflow-hidden"
        >
          {/* City */}
          <div className="flex-[2] px-5 py-5 border-b md:border-b-0 md:border-r border-white/5">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">
              <Building2 size={12} /> City, Location or Hotel
            </label>
            <input
              type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full bg-transparent text-white text-lg font-semibold placeholder-gray-600 border-none outline-none"
              required
            />
          </div>

          {/* Check-in */}
          <div className="flex-1 px-5 py-5 border-b md:border-b-0 md:border-r border-white/5">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">
              <CalendarDays size={12} /> Check-in
            </label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-white text-lg font-semibold border-none outline-none" required />
          </div>

          {/* Check-out */}
          <div className="flex-1 px-5 py-5 border-b md:border-b-0 md:border-r border-white/5">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">
              <CalendarDays size={12} /> Check-out
            </label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-white text-lg font-semibold border-none outline-none" required />
          </div>

          {/* Guests */}
          <div className="flex-1 px-5 py-5 border-b md:border-b-0 md:border-r border-white/5">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">
              <Users size={12} /> Rooms & Guests
            </label>
            <input type="text" value={guests} readOnly
              className="w-full bg-transparent text-white text-lg font-semibold border-none outline-none cursor-pointer" />
          </div>

          {/* Search */}
          <button type="submit"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg tracking-wider px-10 py-5 transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-amber-500/20">
            <Search size={20} /> SEARCH
          </button>
        </form>
      </div>

      {/* ============ FEATURES ============ */}
      <section className="max-w-[1400px] mx-auto px-6 mt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-5 text-center group hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-blue-400 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ DESTINATIONS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 mt-14 pb-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-white text-2xl font-bold mb-1">Popular Destinations</h2>
            <p className="text-gray-500 text-sm">Explore trending cities with the best hotel deals</p>
          </div>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/search?location=${dest.name}`)}
              className="relative group rounded-2xl overflow-hidden h-[220px] cursor-pointer hover-float glow-border"
            >
              <img src={dest.img} alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Tag */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                {dest.tag}
              </div>
              {/* Name */}
              <div className="absolute bottom-5 left-5">
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">{dest.name}</h3>
                <p className="text-gray-300 text-xs mt-0.5">Explore hotels →</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
