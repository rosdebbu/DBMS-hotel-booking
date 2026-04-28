import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plane, Hotel, LayoutDashboard, Phone, Globe, MessageSquare, Heart } from 'lucide-react';
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
    <header className="w-full bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Plane className="text-white" size={20} />
          </div>
          <span className="text-white text-xl font-extrabold tracking-tight">
            Go<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Anywhere</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            <Hotel size={15} /> Hotels
          </Link>
          <Link
            to="/admin"
            className={`text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              isAdmin
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <LayoutDashboard size={15} /> Admin
          </Link>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40">
            Login or Signup
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#060a12] border-t border-white/5 mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Plane className="text-white" size={18} />
              </div>
              <span className="text-white text-lg font-extrabold">
                Go<span className="text-blue-400">Anywhere</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              India's smartest hotel booking platform. Powered by advanced DBMS with real-time availability.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageSquare, Heart].map((Icon, i) => (
                <div key={i} className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors border border-white/5">
                  <Icon size={16} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Contact', 'Careers', 'Blog', 'Partners'].map((l) => (
                <li key={l}><span className="text-gray-500 text-sm hover:text-blue-400 cursor-pointer transition-colors">{l}</span></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Help Center', 'Cancellation Policy', 'Terms & Conditions', 'Refund Policy'].map((l) => (
                <li key={l}><span className="text-gray-500 text-sm hover:text-blue-400 cursor-pointer transition-colors">{l}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
              <Phone size={14} className="text-blue-400" /> +91 1800-123-4567
            </div>
            <p className="text-gray-500 text-xs mb-4">Available 24/7 for your booking needs</p>
            <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-400 text-xs font-medium">🎓 DBMS Hotel Management Project</p>
              <p className="text-gray-500 text-[11px]">MySQL · Flask · React · TypeScript</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">© 2026 GoAnywhere. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <span key={l} className="text-gray-600 text-xs hover:text-gray-400 cursor-pointer transition-colors">{l}</span>
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
      <div className="min-h-screen bg-[#0a0e1a] bg-mesh grain flex flex-col">
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
