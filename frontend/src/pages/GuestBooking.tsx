import { useState, useEffect } from 'react';
import { CalendarDays, CreditCard, User as UserIcon, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface Room {
  room_id: number;
  room_type: string;
  price_per_night: string;
  availability_status: string;
}

export default function GuestBooking() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', id_proof: '',
    check_in: '', check_out: '', payment_method: 'Credit Card'
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (!selectedRoom || !formData.check_in || !formData.check_out) return 0;
    const start = new Date(formData.check_in);
    const end = new Date(formData.check_out);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return days * parseFloat(selectedRoom.price_per_night);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return alert("Please select a room first!");

    const payload = {
      ...formData,
      room_id: selectedRoom.room_id,
      price_per_night: selectedRoom.price_per_night
    };

    try {
      const res = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg(`🎉 Success! Booking ID: ${data.booking_id}`);
        const roomsRes = await fetch('http://localhost:5000/api/rooms');
        setRooms(await roomsRes.json());
        setSelectedRoom(null);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (err) {
      alert("Error submitting booking");
    }
  };

  return (
    <div className="layout-grid animate-fade-in">
      <div className="rooms-section">
        <h2 className="section-title">Available Rooms</h2>
        {loading ? (
          <p className="loading-text">Loading rooms...</p>
        ) : (
          <div className="room-list">
            {rooms.filter(r => r.availability_status === 'Available').map(room => (
              <div 
                key={room.room_id} 
                className={`glass-panel room-card ${selectedRoom?.room_id === room.room_id ? 'selected' : ''}`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="room-header">
                  <h3 className="room-title">{room.room_type}</h3>
                  <span className="room-price">${parseFloat(room.price_per_night).toFixed(2)}<span>/night</span></span>
                </div>
                <div className="room-badge">
                  <CheckCircle2 size={14} /> Available
                </div>
              </div>
            ))}
            {rooms.filter(r => r.availability_status === 'Available').length === 0 && (
              <div className="glass-panel empty-state">No rooms currently available.</div>
            )}
          </div>
        )}
      </div>

      <div className="booking-section">
        <div className="glass-panel booking-form-container relative">
          {successMsg && (
            <div className="success-overlay animate-fade-in">
              <div className="success-icon-wrapper">
                <CheckCircle2 size={40} className="success-icon" />
              </div>
              <h3>{successMsg}</h3>
              <p>Your room has been successfully booked and payment processed.</p>
              <button className="btn btn-primary" onClick={() => setSuccessMsg('')}>Book Another Room</button>
            </div>
          )}

          <h2 className="section-title">Reservation Details</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><UserIcon size={16} /> Full Name</label>
                <input required type="text" name="name" className="form-input" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label"><Phone size={16} /> Phone</label>
                <input required type="text" name="phone" className="form-input" onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Mail size={16} /> Email</label>
              <input required type="email" name="email" className="form-input" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label"><MapPin size={16} /> Address</label>
              <textarea required name="address" className="form-input text-area" onChange={handleChange}></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><CreditCard size={16} /> ID Proof Details</label>
                <input required type="text" name="id_proof" className="form-input" placeholder="Passport / DL Number" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label"><CreditCard size={16} /> Payment Method</label>
                <select name="payment_method" className="form-input" onChange={handleChange}>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Cash</option>
                  <option>Online Transfer</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><CalendarDays size={16} /> Check In</label>
                <input required type="date" name="check_in" className="form-input" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label"><CalendarDays size={16} /> Check Out</label>
                <input required type="date" name="check_out" className="form-input" onChange={handleChange} />
              </div>
            </div>

            <div className="form-footer">
              <div className="summary">
                <div>
                  <p className="summary-label">Selected Room</p>
                  <p className="summary-value">{selectedRoom ? selectedRoom.room_type : 'None Selected'}</p>
                </div>
                <div className="summary-total">
                  <p className="summary-label">Total Amount</p>
                  <p className="summary-price text-gradient">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={!selectedRoom}
              >
                Confirm Booking & Pay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
