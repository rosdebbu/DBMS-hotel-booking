import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Hotel, User, LayoutDashboard } from 'lucide-react';
import './index.css';

// Pages
import GuestBooking from './pages/GuestBooking';
import AdminDashboard from './pages/AdminDashboard';

function Navigation() {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  return (
    <header className="glass-nav p-4 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <Hotel className="text-blue-500" size={32} />
          <span className="text-gradient">LuxeStay</span>
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className={`btn ${!isAdmin ? 'btn-primary' : 'btn-outline'}`}>
            <User size={18} /> Guest Booking
          </Link>
          <Link to="/admin" className={`btn ${isAdmin ? 'btn-primary' : 'btn-outline'}`}>
            <LayoutDashboard size={18} /> Admin Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 pb-12 animate-fade-in">
          <Routes>
            <Route path="/" element={<GuestBooking />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
