import { useState, useEffect } from 'react';
import { Users, BedDouble, DollarSign, Trash2 } from 'lucide-react';

interface Stats {
  total_revenue: number;
  active_bookings: number;
  top_room_type: string;
}

interface Reservation {
  booking_id: number;
  guest_name: string;
  room_type: string;
  room_id: number;
  check_in: string;
  check_out: string;
  total_amount: string;
  status: string;
  payment_method: string;
}

interface Guest {
  guest_id: number;
  name: string;
  phone: string;
  email: string;
  id_proof: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activeTab, setActiveTab] = useState<'reservations' | 'guests'>('reservations');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, resRes, guestsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats'),
        fetch('http://localhost:5000/api/admin/reservations'),
        fetch('http://localhost:5000/api/admin/guests'),
      ]);
      setStats(await statsRes.json());
      setReservations(await resRes.json());
      setGuests(await guestsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteReservation = async (id: number) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/reservations/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteGuest = async (id: number) => {
    if (!confirm('Delete this guest?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/guests/${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); alert(d.error); } else { fetchData(); }
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <h1 className="text-white text-3xl font-extrabold mb-8">Admin <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Dashboard</span></h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="glass-card rounded-xl p-6 flex items-center gap-4 border-l-4 border-blue-500">
          <div className="w-14 h-14 bg-blue-500/15 rounded-xl flex items-center justify-center">
            <DollarSign size={28} className="text-blue-400" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-white text-2xl font-bold">₹{stats?.total_revenue?.toLocaleString() || '0'}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex items-center gap-4 border-l-4 border-violet-500">
          <div className="w-14 h-14 bg-violet-500/15 rounded-xl flex items-center justify-center">
            <BedDouble size={28} className="text-violet-400" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Bookings</p>
            <p className="text-white text-2xl font-bold">{stats?.active_bookings || 0}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex items-center gap-4 border-l-4 border-pink-500">
          <div className="w-14 h-14 bg-pink-500/15 rounded-xl flex items-center justify-center">
            <Users size={28} className="text-pink-400" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Top Room Type</p>
            <p className="text-white text-xl font-bold">{stats?.top_room_type || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'reservations' ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          All Reservations
        </button>
        <button
          onClick={() => setActiveTab('guests')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'guests' ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          Guest Directory
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'reservations' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">ID</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Guest</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Room</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Dates</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Amount</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Status</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.booking_id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-gray-500 text-sm">#{r.booking_id}</td>
                    <td className="px-5 py-4 text-white font-medium">{r.guest_name}</td>
                    <td className="px-5 py-4 text-gray-300 text-sm">{r.room_type} (#{r.room_id})</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      <div>In: {r.check_in}</div>
                      <div>Out: {r.check_out}</div>
                    </td>
                    <td className="px-5 py-4 text-blue-400 font-semibold">₹{parseFloat(r.total_amount).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-medium px-2.5 py-1 rounded-full">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDeleteReservation(r.booking_id)}
                        className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500">No reservations</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-gray-700">
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">ID</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Name</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Phone</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Email</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">ID Proof</th>
                  <th className="px-5 py-3 text-gray-400 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g.guest_id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-gray-500 text-sm">#{g.guest_id}</td>
                    <td className="px-5 py-4 text-white font-medium">{g.name}</td>
                    <td className="px-5 py-4 text-gray-300">{g.phone}</td>
                    <td className="px-5 py-4 text-gray-300">{g.email}</td>
                    <td className="px-5 py-4 text-gray-300">{g.id_proof}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDeleteGuest(g.guest_id)}
                        className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No guests</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
