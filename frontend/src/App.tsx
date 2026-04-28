import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plane, Hotel, LayoutDashboard, Phone } from 'lucide-react';
import './index.css';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelDetail from './pages/HotelDetail';
import GuestBooking from './pages/GuestBooking';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';

function Navigation() {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  return (
    <header className="w-full bg-[#1e1e1e] border-b border-gray-800">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Plane className="text-sky-400" size={26} />
          <span className="text-white text-xl font-bold tracking-tight">GoAnywhere</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
            <Hotel size={15} /> Hotels
          </Link>
          <Link
            to="/admin"
            className={`text-sm font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors ${
              isAdmin ? 'bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <LayoutDashboard size={15} /> Admin
          </Link>
          <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors">
            Login or Signup
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#161616] border-t border-gray-800 mt-12">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Plane className="text-sky-400" size={22} />
              <span className="text-white text-lg font-bold">GoAnywhere</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              India's fastest growing hotel booking platform. Best prices guaranteed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Careers', 'Blog'].map((l) => (
                <li key={l}><span className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">{l}</span></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2">
              {['FAQ', 'Help Center', 'Cancellation Policy', 'Terms & Conditions'].map((l) => (
                <li key={l}><span className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">{l}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact Us</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Phone size={14} /> +91 1800-123-4567
            </div>
            <p className="text-gray-500 text-xs">Available 24/7 for your booking needs</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">© 2026 GoAnywhere. All rights reserved. | DBMS Hotel Management Project</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <span key={l} className="text-gray-500 text-xs hover:text-gray-300 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1e1e1e] flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/hotel/:hotelId" element={<HotelDetail />} />
            <Route path="/book" element={<GuestBooking />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
