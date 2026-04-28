import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Coffee, Car, UtensilsCrossed, Phone, ChevronDown } from 'lucide-react';

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

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get('location') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/search?location=${encodeURIComponent(locationQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [locationQuery]);

  const renderStars = (rating: number) => {
    return [...Array(Math.floor(rating))].map((_, i) => (
      <Star key={i} size={13} fill="#fbbf24" className="text-yellow-400" />
    ));
  };

  return (
    <div>
      {/* ====== Top Search Bar (Compact) ====== */}
      <div className="bg-[#2a2a2a] border-b border-gray-700">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-col md:flex-row items-center gap-3">
          <div className="flex-[2] bg-[#1e1e1e] rounded px-4 py-2">
            <span className="text-white text-sm font-medium">{locationQuery || 'All Locations'}</span>
          </div>
          <div className="flex-1 bg-[#1e1e1e] rounded px-4 py-2 text-gray-400 text-sm">
            {searchParams.get('checkin') || 'Check-in'}
          </div>
          <div className="flex-1 bg-[#1e1e1e] rounded px-4 py-2 text-gray-400 text-sm">
            {searchParams.get('checkout') || 'Check-out'}
          </div>
          <div className="flex-1 bg-[#1e1e1e] rounded px-4 py-2 text-gray-400 text-sm">
            1 Room, 1 Guest
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 rounded transition-colors"
          >
            Modify Search
          </button>
        </div>
      </div>

      {/* ====== Main Content ====== */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-bold">
            <span className="text-amber-400">{results.length}</span> Properties found in{' '}
            <span className="text-amber-400">{locationQuery || 'All Locations'}</span>
          </h2>
          <div className="relative">
            <select className="appearance-none bg-[#2a2a2a] text-gray-300 border border-gray-600 rounded-md px-4 py-2 pr-8 text-sm cursor-pointer">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-6">
          {/* ====== LEFT SIDEBAR ====== */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="bg-[#2a2a2a] rounded-lg p-5 sticky top-4">
              {/* Filter Search */}
              <input
                type="text"
                placeholder="Enter hotel name or location"
                className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-sm text-white placeholder-gray-500 px-3 py-2 mb-5 outline-none focus:border-blue-500"
              />

              {/* Filters Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-base">Filters</h3>
                <button className="text-blue-400 text-xs hover:underline">Reset</button>
              </div>

              {/* Lowest Price Badge */}
              <div className="bg-green-900/30 border border-green-700/40 rounded-lg p-3 mb-5">
                <p className="text-green-400 font-bold text-sm">Lowest Price Guarantee</p>
                <p className="text-gray-400 text-xs">Hotels cheaper than anywhere</p>
              </div>

              {/* Star Rating */}
              <div className="border-b border-gray-700 pb-4 mb-4">
                <h4 className="text-white font-semibold text-sm mb-3">Star Rating</h4>
                {[
                  { label: '5 Star', count: 470 },
                  { label: '4 Star', count: 2742 },
                  { label: '3 Star', count: 3546 },
                ].map((s) => (
                  <label key={s.label} className="flex items-center gap-2 text-gray-300 text-sm mb-2 cursor-pointer hover:text-white">
                    <input type="checkbox" className="accent-blue-500 rounded" />
                    {s.label}
                    <span className="ml-auto text-gray-500 text-xs">{s.count}</span>
                  </label>
                ))}
              </div>

              {/* User Rating */}
              <div className="border-b border-gray-700 pb-4 mb-4">
                <h4 className="text-white font-semibold text-sm mb-3">User Rating</h4>
                {['Excellent (4.2+)', 'Very Good (3.5+)', 'Good (3+)'].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-gray-300 text-sm mb-2 cursor-pointer hover:text-white">
                    <input type="checkbox" className="accent-blue-500 rounded" />
                    {r}
                  </label>
                ))}
              </div>

              {/* Area & Attraction */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Area & Attraction</h4>
                {['Gateway of India', 'Marine Drive', 'Juhu Beach'].map((a) => (
                  <label key={a} className="flex items-center gap-2 text-gray-300 text-sm mb-2 cursor-pointer hover:text-white">
                    <input type="checkbox" className="accent-blue-500 rounded" />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ====== RIGHT: HOTEL LIST ====== */}
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 text-lg animate-pulse">Searching for best deals...</div>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-[#2a2a2a] rounded-lg p-16 text-center">
                <p className="text-gray-400 text-lg">No hotels found matching "{locationQuery}"</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-400 hover:underline">
                  Go back to search
                </button>
              </div>
            ) : (
              results.map((room, idx) => (
                <div
                  key={room.room_id}
                  className="bg-[#2a2a2a] rounded-lg overflow-hidden flex flex-col md:flex-row hover:ring-1 hover:ring-gray-600 transition-all"
                >
                  {/* Hotel Image */}
                  <div className="relative w-full md:w-[300px] h-[220px] md:h-auto shrink-0">
                    <img
                      src={HOTEL_IMAGES[idx % HOTEL_IMAGES.length]}
                      alt={room.hotel_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1 p-5 flex flex-col">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="w-1 h-6 bg-amber-500 rounded-full shrink-0 mt-0.5"></span>
                      <h3 className="text-blue-400 text-lg font-bold">{room.hotel_name}</h3>
                    </div>

                    <div className="flex items-center gap-1 ml-3 mb-1">
                      {renderStars(parseFloat(room.rating) || 4)}
                    </div>

                    <p className="text-blue-400 text-xs ml-3 mb-3 flex items-center gap-1">
                      <MapPin size={12} /> {room.location}
                    </p>

                    <p className="text-gray-300 text-sm ml-3 mb-2">
                      <span className="text-gray-400">Room: </span>
                      <span className="font-medium text-white">{room.room_type}</span>
                    </p>

                    <p className="text-gray-400 text-sm ml-3 mb-3">Free Wi-Fi</p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 ml-3 mb-3">
                      {[
                        { icon: <Coffee size={11} />, label: 'breakfast' },
                        { icon: <Wifi size={11} />, label: 'wifi' },
                        { icon: <Car size={11} />, label: 'parking' },
                        { icon: <UtensilsCrossed size={11} />, label: 'lunch' },
                      ].map((a) => (
                        <span key={a.label} className="text-gray-400 text-xs flex items-center gap-1">
                          {a.icon} {a.label}
                        </span>
                      ))}
                      <span className="text-blue-400 text-xs cursor-pointer">+ 4 More</span>
                    </div>

                    <p className="text-green-400 text-sm font-medium ml-3 mt-auto">✓ Free Cancellation</p>
                  </div>

                  {/* Price Section */}
                  <div className="border-t md:border-t-0 md:border-l border-gray-700 p-5 flex flex-col items-end justify-end min-w-[180px]">
                    <p className="text-white text-3xl font-bold">
                      ₹{parseFloat(room.price_per_night).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mb-4">+ ₹120 taxes & fees / night</p>

                    <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded mb-2 transition-colors flex items-center gap-1.5 w-full justify-center">
                      <Phone size={12} /> Call to Book
                    </button>
                    <button
                      onClick={() => {
                        const slug = room.hotel_name.replace(/\s+/g, '-').toLowerCase();
                        const checkin = searchParams.get('checkin') || '';
                        const checkout = searchParams.get('checkout') || '';
                        navigate(`/hotel/${slug}?checkin=${checkin}&checkout=${checkout}`);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-6 py-2.5 rounded transition-colors w-full"
                    >
                      View Rooms
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
