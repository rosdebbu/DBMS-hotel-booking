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
        fetch('http://localhost:5000/api/admin/guests')
      ]);
      setStats(await statsRes.json());
      setReservations(await resRes.json());
      setGuests(await guestsRes.json());
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteReservation = async (id: number) => {
    if (!confirm('Cancel this reservation? This will free the room.')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/reservations/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGuest = async (id: number) => {
    if (!confirm('Delete this guest?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/guests/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-12 text-xl">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      {/* Stats Cards */}
      <div className="stats-grid mb-8">
        <div className="glass-panel stat-card blue">
          <div className="icon-wrapper blue">
            <DollarSign size={32} />
          </div>
          <div>
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">${stats?.total_revenue?.toFixed(2) || '0.00'}</h3>
          </div>
        </div>
        <div className="glass-panel stat-card purple">
          <div className="icon-wrapper purple">
            <BedDouble size={32} />
          </div>
          <div>
            <p className="stat-label">Active Bookings</p>
            <h3 className="stat-value">{stats?.active_bookings || 0}</h3>
          </div>
        </div>
        <div className="glass-panel stat-card pink">
          <div className="icon-wrapper pink">
            <Users size={32} />
          </div>
          <div>
            <p className="stat-label">Top Room Type</p>
            <h3 className="stat-value text-xl">{stats?.top_room_type || 'N/A'}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          All Reservations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'guests' ? 'active' : ''}`}
          onClick={() => setActiveTab('guests')}
        >
          Guest Directory
        </button>
      </div>

      {/* Tables */}
      <div className="glass-panel overflow-hidden">
        {activeTab === 'reservations' ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.booking_id}>
                    <td className="text-gray-400">#{res.booking_id}</td>
                    <td className="font-medium">{res.guest_name}</td>
                    <td>{res.room_type} (ID: {res.room_id})</td>
                    <td className="text-sm text-gray-400">
                      <div>In: {res.check_in}</div>
                      <div>Out: {res.check_out}</div>
                    </td>
                    <td className="font-medium text-blue-300">${parseFloat(res.total_amount).toFixed(2)}</td>
                    <td>
                      <span className="status-badge">
                        {res.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteReservation(res.booking_id)} className="btn-danger action-btn" title="Cancel Reservation">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">No active reservations</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>ID Proof</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(guest => (
                  <tr key={guest.guest_id}>
                    <td className="text-gray-400">#{guest.guest_id}</td>
                    <td className="font-medium">{guest.name}</td>
                    <td>{guest.phone}</td>
                    <td>{guest.email}</td>
                    <td>{guest.id_proof}</td>
                    <td>
                      <button onClick={() => handleDeleteGuest(guest.guest_id)} className="btn-danger action-btn" title="Delete Guest">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400">No guests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
