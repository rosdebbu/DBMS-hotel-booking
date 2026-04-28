import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, User, ChevronRight } from 'lucide-react';

interface Room {
  room_id: number;
  room_type: string;
  price_per_night: string;
  availability_status: string;
  hotel_name: string;
  location: string;
  rating: string;
}

export default function GuestBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read params from URL (passed from HotelDetail or SearchResults)
  const hotelName = searchParams.get('hotel') || '';
  const roomIdParam = searchParams.get('room') || '';
  const roomTypeParam = searchParams.get('type') || '';
  const priceParam = searchParams.get('price') || '';
  const locationParam = searchParams.get('location') || '';
  const ratingParam = searchParams.get('rating') || '';
  const checkinParam = searchParams.get('checkin') || '';
  const checkoutParam = searchParams.get('checkout') || '';

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [step, setStep] = useState(1); // 1 = Review, 2 = Payment
  const [form, setForm] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    id_proof: 'Aadhar',
    check_in: checkinParam,
    check_out: checkoutParam,
    payment_method: 'Card',
    promoCode: '',
    agreeTerms: true,
  });
  const [success, setSuccess] = useState<{ booking_id: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then((r) => r.json())
      .then((data: Room[]) => {
        setRooms(data);
        // Auto-select room if passed via URL
        if (roomIdParam) {
          const found = data.find((r: Room) => String(r.room_id) === roomIdParam);
          if (found) setSelectedRoom(found);
        }
      })
      .catch(console.error);
  }, [roomIdParam]);

  const days = form.check_in && form.check_out
    ? Math.max(1, Math.ceil((new Date(form.check_out).getTime() - new Date(form.check_in).getTime()) / 86400000))
    : 1;

  const basePrice = selectedRoom ? parseFloat(selectedRoom.price_per_night) : (priceParam ? parseFloat(priceParam) : 0);
  const roomTotal = basePrice * days;
  const taxes = Math.round(roomTotal * 0.18);
  const grandTotal = roomTotal + taxes;

  const displayHotelName = selectedRoom?.hotel_name || hotelName || 'Selected Hotel';
  const displayRoomType = selectedRoom?.room_type || roomTypeParam || 'Deluxe Room';
  const displayLocation = selectedRoom?.location || locationParam || '';

  const handleSubmit = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.title} ${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone,
          email: form.email,
          address: form.address,
          id_proof: form.id_proof,
          room_id: selectedRoom.room_id,
          price_per_night: selectedRoom.price_per_night,
          check_in: form.check_in,
          check_out: form.check_out,
          payment_method: form.payment_method,
        }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(data);
      else alert(data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <span className={`flex items-center gap-1 font-medium ${step === 1 ? 'text-blue-400' : 'text-gray-400 cursor-pointer hover:text-blue-300'}`} onClick={() => setStep(1)}>
          1. Review and Travellers
        </span>
        <ChevronRight size={14} className="text-gray-600" />
        <span className={`flex items-center gap-1 font-medium ${step === 2 ? 'text-blue-400' : 'text-gray-500'}`}>
          2. Payment
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ====== LEFT: Main Content ====== */}
        <div className="flex-1">
          {/* Hotel Summary Card */}
          <div className="bg-[#2a2a2a] rounded-lg overflow-hidden mb-6">
            <div className="p-5 flex gap-5">
              {/* Hotel Image */}
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=250&fit=crop&q=80"
                alt={displayHotelName}
                className="w-[200px] h-[160px] object-cover rounded-lg shrink-0 hidden md:block"
              />

              {/* Hotel Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-white text-xl font-bold flex items-center gap-2">
                      {displayHotelName}
                      <span className="flex gap-0.5">
                        {[...Array(Math.floor(parseFloat(ratingParam || selectedRoom?.rating || '4')))].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                      </span>
                    </h2>
                    <p className="text-gray-500 text-sm">{displayLocation}</p>
                  </div>
                  <span className="text-blue-400 text-xs cursor-pointer hover:underline">[Change Hotel]</span>
                </div>

                {/* Check-in / Check-out / Guest */}
                <div className="grid grid-cols-3 gap-4 bg-[#1e1e1e] rounded-lg p-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs">Check-In</p>
                    <p className="text-white font-bold">{formatDate(form.check_in)}</p>
                    <p className="text-gray-500 text-xs">3:00 PM</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Check-Out</p>
                    <p className="text-white font-bold">{formatDate(form.check_out)}</p>
                    <p className="text-gray-500 text-xs">12:00 PM</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Guest</p>
                    <p className="text-white font-bold">1 Adult</p>
                    <p className="text-gray-500 text-xs">1 Room | {days} Night{days > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Room Type */}
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-medium">Room Type: {displayRoomType}, Guest room</p>
                    <span className="text-blue-400 text-xs cursor-pointer hover:underline">[Change Room]</span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Inclusions:</p>
                  <p className="text-green-400 text-sm flex items-center gap-1">✓ Room Only</p>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="px-5 pb-5">
              <p className="text-white text-sm font-semibold mb-2">Cancellation Policy:</p>
              <p className="text-gray-400 text-xs mb-1">Before: {formatDate(form.check_in)} — USD 0 (Free Cancellation)</p>
              <p className="text-gray-400 text-xs mb-3">From {formatDate(form.check_in)} to {formatDate(form.check_out)} — 96%</p>

              {/* Timeline */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                <p className="text-green-400 text-sm">● Before: {formatDate(form.check_in)} — USD 0 (Free Cancellation)</p>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full mb-2">
                <div className="absolute left-0 top-0 h-full w-[70%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                <div className="absolute left-0 top-0 w-3 h-3 bg-blue-500 rounded-full -mt-0.5 border-2 border-blue-300"></div>
                <div className="absolute left-[70%] top-0 w-3 h-3 bg-blue-400 rounded-full -mt-0.5 border-2 border-blue-200"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="font-bold text-white">NOW</span>
                <span>{formatDate(form.check_in)}</span>
                <span className="text-amber-400">(Non Refundable)</span>
                <span className="text-blue-400 font-medium">{formatDate(form.check_out)}<br /><span className="text-gray-500">Check-in</span></span>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="bg-[#2a2a2a] rounded-lg overflow-hidden mb-6">
            {/* Section Header */}
            <div className="bg-blue-700/40 px-5 py-3 flex items-center gap-2">
              <User size={16} className="text-blue-300" />
              <span className="text-white font-semibold text-sm">Guest Details</span>
            </div>

            <div className="p-5">
              {/* Room 1 / Adult 1 */}
              <div className="flex items-center gap-8 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400 text-xs mb-1">Room 1</div>
                </div>
                <div>
                  <p className="text-white font-semibold">Adult 1</p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Title</label>
                  <select
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none text-sm"
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="text-gray-400 text-sm mb-1 block">First Name</label>
                  <input
                    type="text"
                    placeholder="ENTER FIRST NAME"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none placeholder-gray-600 text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm mb-1 block">Last Name</label>
                  <input
                    type="text"
                    placeholder="ENTER LAST NAME"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none placeholder-gray-600 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Contact Details */}
              <h3 className="text-white font-bold mb-4">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="ENTER EMAIL ADDRESS"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none placeholder-gray-600 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Mobile Number</label>
                  <div className="flex gap-2">
                    <select className="bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-2 py-2.5 outline-none text-sm w-20">
                      <option>+91</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="ENTER MOBILE NUMBER"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none placeholder-gray-600 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-6">Your booking details will be sent to this email address and mobile number.</p>

              {/* Address & ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Address</label>
                  <input
                    type="text"
                    placeholder="ENTER ADDRESS"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none placeholder-gray-600 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">ID Proof</label>
                  <select
                    value={form.id_proof}
                    onChange={(e) => setForm({ ...form, id_proof: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none text-sm"
                  >
                    <option value="Aadhar">Aadhar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
              </div>

              {/* Date Inputs if not from URL */}
              {(!checkinParam || !checkoutParam) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Check-in Date</label>
                    <input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Check-out Date</label>
                    <input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none text-sm" required />
                  </div>
                </div>
              )}

              {/* Room selection if not pre-selected */}
              {!selectedRoom && rooms.length > 0 && (
                <div className="mb-6">
                  <label className="text-gray-400 text-sm mb-2 block">Select Room</label>
                  <div className="grid gap-2">
                    {rooms.filter(r => r.availability_status === 'Available').map((room) => (
                      <div
                        key={room.room_id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-3 rounded-lg cursor-pointer border transition-all ${
                          selectedRoom?.room_id === room.room_id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 hover:border-gray-500 bg-[#1e1e1e]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium text-sm">{room.room_type} — {room.hotel_name}</p>
                            <p className="text-gray-500 text-xs">{room.location}</p>
                          </div>
                          <p className="text-amber-400 font-bold">₹{parseFloat(room.price_per_night).toLocaleString()}/night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Continue */}
          <div className="border-t border-gray-700 pt-6">
            <label className="flex items-center gap-3 text-gray-300 text-sm mb-6 cursor-pointer">
              <input type="checkbox" checked={form.agreeTerms} onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                className="accent-blue-500 w-5 h-5 rounded" />
              I understand and agree to the rules of this fare, the <span className="text-blue-400 hover:underline cursor-pointer">Terms & Conditions</span> and <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span> of GoAnywhere
            </label>

            <button
              onClick={handleSubmit}
              disabled={!selectedRoom || !form.firstName || !form.email || !form.phone || !form.agreeTerms || loading}
              className="w-full max-w-md mx-auto block bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-full transition-colors"
            >
              {loading ? 'Processing...' : 'Continue Booking'}
            </button>
          </div>
        </div>

        {/* ====== RIGHT SIDEBAR ====== */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-4">
          {/* Room Price Details */}
          <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="bg-blue-700/40 px-5 py-3">
              <p className="text-white font-semibold text-sm">Room Price Details</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>1 Room X {days} Night{days > 1 ? 's' : ''}</span>
                <span className="text-white font-semibold">₹{roomTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Taxes & fees</span>
                <span className="text-white font-semibold">₹{taxes.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-amber-400 font-bold">Grand Total</span>
                <span className="text-white text-2xl font-bold">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Offers & Promo Codes */}
          <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between">
              <p className="text-white font-semibold text-sm">Offers & Promo Codes</p>
              <span className="text-2xl">🏷️</span>
            </div>
            <div className="px-5 pb-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER PROMO CODE"
                  value={form.promoCode}
                  onChange={(e) => setForm({ ...form, promoCode: e.target.value })}
                  className="flex-1 bg-[#1e1e1e] border border-gray-600 rounded-md text-white px-3 py-2.5 outline-none placeholder-gray-600 text-sm"
                />
                <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#2a2a2a] rounded-lg p-5">
            <p className="text-white font-semibold text-sm mb-3">Payment Method</p>
            <div className="space-y-2">
              {['Card', 'UPI', 'Net Banking', 'Cash'].map((m) => (
                <label key={m} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                  form.payment_method === m ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'
                }`}>
                  <input type="radio" name="payment" value={m} checked={form.payment_method === m}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="accent-blue-500" />
                  <span className="text-gray-300 text-sm">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ====== SUCCESS OVERLAY ====== */}
      {success && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-2xl p-10 text-center max-w-md mx-4 shadow-2xl">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">Booking Confirmed!</h3>
            <p className="text-gray-400 mb-1">Your booking ID is</p>
            <p className="text-amber-400 text-3xl font-bold mb-6">#{success.booking_id}</p>
            <p className="text-gray-500 text-sm mb-6">Confirmation has been sent to your email.</p>
            <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
