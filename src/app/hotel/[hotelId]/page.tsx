'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Star, ChevronLeft, ChevronRight, Wifi, Coffee, Car, UtensilsCrossed, ShieldCheck, Leaf, Users as UsersIcon, Maximize } from 'lucide-react';

interface Room {
  room_id: number;
  room_type: string;
  price_per_night: string;
  availability_status: string;
  hotel_name: string;
  location: string;
  rating: string;
}

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop&q=80',
];

const TABS = ['Rooms', 'Overview', 'Amenities', 'Location', 'Booking Policy', 'Guest Rating'];

export default function HotelDetail({ params }: { params: { hotelId: string } }) {
  const hotelId = params.hotelId;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Rooms');
  const [galleryIdx, setGalleryIdx] = useState(0);
  const checkin = searchParams.get('checkin') || '';
  const checkout = searchParams.get('checkout') || '';

  useEffect(() => {
    fetch('/api/search?location=')
      .then((r) => r.json())
      .then((data: Room[]) => {
        const filtered = data.filter((r) => String(r.hotel_name).replace(/\s+/g, '-').toLowerCase() === hotelId);
        setRooms(filtered.length > 0 ? filtered : data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hotelId]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse text-lg">Loading hotel...</div>;
  const hotel = rooms[0];
  if (!hotel) return <div className="flex items-center justify-center h-64 text-gray-400">Hotel not found</div>;

  const ratingNum = parseFloat(hotel.rating) || 4.0;
  const reviewCount = Math.floor(ratingNum * 750 + 283);
  const prevImg = () => setGalleryIdx((i) => (i === 0 ? GALLERY_IMAGES.length - 1 : i - 1));
  const nextImg = () => setGalleryIdx((i) => (i === GALLERY_IMAGES.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="bg-[#2a2a2a] border-b border-gray-700">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3">
          <div className="flex-[2] bg-[#1e1e1e] rounded px-4 py-2 text-white text-sm">{hotel.location}</div>
          <div className="flex-1 bg-[#1e1e1e] rounded px-4 py-2 text-gray-400 text-sm">{checkin || '29/04/2026'}</div>
          <div className="flex-1 bg-[#1e1e1e] rounded px-4 py-2 text-gray-400 text-sm">{checkout || '30/04/2026'}</div>
          <div className="flex-1 bg-[#1e1e1e] rounded px-4 py-2 text-gray-400 text-sm">1 Room, 1 Guest</div>
          <button onClick={() => router.push('/')} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 rounded transition-colors">Modify Search</button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-3">
        <p className="text-blue-400 text-xs"><span className="cursor-pointer hover:underline" onClick={() => router.back()}>‹ Back</span><span className="text-gray-500"> › {hotel.location}, {checkin || '29 Apr 2026'}, {checkout || '30 Apr 2026'}, 1 Room, 1 Guest</span></p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-6">
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="p-6 flex items-start justify-between border-b border-gray-700">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-white text-2xl font-bold">{hotel.hotel_name}</h1>
                <div className="flex gap-0.5">{[...Array(Math.floor(ratingNum))].map((_, i) => <Star key={i} size={14} fill="#fbbf24" className="text-yellow-400" />)}</div>
                <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded">Hotel</span>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-1"><MapPin size={13} /> {hotel.location}<span className="text-blue-400 text-xs ml-2 cursor-pointer hover:underline">View on map</span></p>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-sm font-medium">Very Good</p>
              <p className="text-gray-500 text-xs">{reviewCount.toLocaleString()} reviews</p>
              <div className="mt-1 bg-blue-600 text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center ml-auto">{ratingNum.toFixed(1)}</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[55%] p-4">
              <div className="relative rounded-lg overflow-hidden h-[350px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={GALLERY_IMAGES[galleryIdx]} alt="Hotel" className="w-full h-full object-cover" />
                <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"><ChevronRight size={20} /></button>
              </div>
              <div className="flex gap-2 mt-2">
                {GALLERY_IMAGES.slice(0, 4).map((img, i) => (
                  <div key={i} onClick={() => setGalleryIdx(i)} className={`w-1/4 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${galleryIdx === i ? 'border-blue-500' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-1/4 h-20 rounded-md overflow-hidden relative cursor-pointer" onClick={() => setGalleryIdx(4)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={GALLERY_IMAGES[4]} alt="" className="w-full h-full object-cover brightness-50" />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">SEE ALL {GALLERY_IMAGES.length} PHOTOS</span>
                </div>
              </div>
            </div>

            <div className="lg:w-[45%] p-6 border-l border-gray-700">
              <div className="mb-4"><p className="text-amber-400 text-lg font-semibold">{rooms[0]?.room_type} Room</p><p className="text-gray-400 text-sm">1 x Guest | 1 x Room</p></div>
              <p className="text-green-400 text-sm font-medium mb-4">✓ Free Cancellation</p>
              <div className="space-y-2 mb-6">
                {[
                  { icon: <ShieldCheck size={14} />, text: 'Dry cleaning/laundry service' },
                  { icon: <Coffee size={14} />, text: 'Vegetarian breakfast available' },
                  { icon: <Leaf size={14} />, text: 'Eco-friendly cleaning products used' },
                  { icon: <UsersIcon size={14} />, text: `Number of meeting rooms — ${Math.floor(ratingNum * 5 + 3)}` },
                  { icon: <Maximize size={14} />, text: `Conference space size (meters) — ${Math.floor(ratingNum * 120 + 10)}` },
                ].map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">{amenity.icon}</span>{amenity.text}</div>
                ))}
              </div>
              <div className="text-right mb-4">
                <p className="text-white text-3xl font-bold">₹{parseFloat(rooms[0]?.price_per_night).toLocaleString()}</p>
                <p className="text-gray-500 text-xs">+ ₹126 Taxes & fees</p>
                <p className="text-gray-500 text-xs">Base price (Per Night)</p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 border border-gray-500 text-white font-semibold py-3 rounded-md hover:bg-white/5 transition-colors">Select Rooms</button>
                <button onClick={() => router.push(`/book?hotel=${encodeURIComponent(hotel.hotel_name)}&room=${rooms[0]?.room_id}&checkin=${checkin}&checkout=${checkout}`)} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-md transition-colors">Book Now</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700">
            <div className="flex gap-0 overflow-x-auto">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white'}`}>{tab}</button>
              ))}
            </div>
          </div>

          {activeTab === 'Rooms' && (
            <div className="p-4">
              <div className="bg-blue-700/30 rounded-t-lg">
                <div className="grid grid-cols-4 px-6 py-3">
                  <span className="text-white font-semibold text-sm">Room Type</span>
                  <span className="text-white font-semibold text-sm">Benefits</span>
                  <span className="text-white font-semibold text-sm text-center">Per Night Price</span>
                  <span></span>
                </div>
              </div>
              {rooms.map((room, idx) => (
                <div key={room.room_id} className="grid grid-cols-4 items-center px-6 py-4 border-b border-gray-800 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={GALLERY_IMAGES[idx % GALLERY_IMAGES.length]} alt="" className="w-20 h-14 rounded object-cover" />
                    <div><p className="text-white text-sm font-medium">{room.room_type}</p><p className="text-gray-500 text-xs">Guest room</p></div>
                  </div>
                  <div><p className="text-gray-300 text-sm">| Room Only</p><p className="text-green-400 text-xs">✓ Free Cancellation</p></div>
                  <div className="text-center"><p className="text-white text-xl font-bold">₹{parseFloat(room.price_per_night).toLocaleString()}</p><p className="text-gray-500 text-xs">per night</p></div>
                  <div className="text-right">
                    <button onClick={() => router.push(`/book?hotel=${encodeURIComponent(room.hotel_name)}&room=${room.room_id}&type=${encodeURIComponent(room.room_type)}&price=${room.price_per_night}&location=${encodeURIComponent(room.location)}&rating=${room.rating}&checkin=${checkin}&checkout=${checkout}`)} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 rounded transition-colors">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
