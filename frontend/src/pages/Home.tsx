import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CalendarDays, Users, Search } from 'lucide-react';

const DESTINATIONS = [
  {
    name: 'Mumbai',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Chennai',
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Goa',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Delhi',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Jaipur',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Udaipur',
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop&q=80',
  },
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
      {/* ============ HERO SECTION ============ */}
      <section className="bg-blue-700 px-6 pt-12 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-amber-400 font-semibold text-lg mb-1">Same hotel, Cheapest price!</p>
          <p className="text-blue-200 text-sm">Find the best deals on GoAnywhere</p>
        </div>
      </section>

      {/* ============ SEARCH BAR ============ */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-10 relative z-10">
        <form
          onSubmit={handleSearch}
          className="bg-[#2a2a2a] rounded-lg shadow-2xl flex flex-col md:flex-row items-stretch"
        >
          {/* City Input */}
          <div className="flex-[2] px-5 py-4 border-b md:border-b-0 md:border-r border-gray-700">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 uppercase tracking-wider mb-1">
              <Building2 size={13} /> Enter City name, Location or Specific hotel
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full bg-transparent text-white text-lg font-semibold placeholder-gray-500 border-none outline-none"
              required
            />
          </div>

          {/* Check-in */}
          <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-700">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 uppercase tracking-wider mb-1">
              <CalendarDays size={13} /> Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-white text-lg font-semibold border-none outline-none"
              required
            />
          </div>

          {/* Check-out */}
          <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-700">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 uppercase tracking-wider mb-1">
              <CalendarDays size={13} /> Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-white text-lg font-semibold border-none outline-none"
              required
            />
          </div>

          {/* Rooms & Guests */}
          <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-700">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-400 uppercase tracking-wider mb-1">
              <Users size={13} /> Rooms & Guests
            </label>
            <input
              type="text"
              value={guests}
              readOnly
              className="w-full bg-transparent text-white text-lg font-semibold border-none outline-none cursor-pointer"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg tracking-wider px-10 py-5 md:rounded-r-lg transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Search size={20} />
            SEARCH
          </button>
        </form>
      </div>

      {/* ============ POPULAR DESTINATIONS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 mt-12 pb-16">
        <h2 className="text-white text-2xl font-bold mb-2">Book Hotels at Popular Destinations</h2>
        <div className="w-12 h-1 bg-blue-600 rounded mb-8"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/search?location=${dest.name}`)}
              className="relative group rounded-xl overflow-hidden h-[220px] cursor-pointer shadow-lg"
            >
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <h3 className="absolute bottom-5 left-5 text-white text-2xl font-bold drop-shadow-lg">
                {dest.name}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
