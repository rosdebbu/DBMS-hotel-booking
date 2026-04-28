import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plane, Hotel, LayoutDashboard } from 'lucide-react';
import './index.css';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import GuestBooking from './pages/GuestBooking';
import AdminDashboard from './pages/AdminDashboard';

function Navigation() {
  const location = useLocation();
  const isSearch = location.pathname === '/search';

  return (
    <header className={`w-full ${isSearch ? 'bg-[#1e1e1e]' : 'bg-[#1e1e1e]'}`}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Plane className="text-sky-400" size={28} />
          <span className="text-white text-xl font-bold tracking-tight">GoAnywhere</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
            <Hotel size={16} /> Hotels
          </Link>
          <Link to="/admin" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors">
            <LayoutDashboard size={16} /> Admin
          </Link>
          <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors">
            Login or Signup
          </button>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1e1e1e]">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/book" element={<GuestBooking />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
