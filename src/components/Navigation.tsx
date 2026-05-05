'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Hotel, LayoutDashboard } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  return (
    <header className="w-full bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Plane className="text-white" size={20} />
          </div>
          <span className="text-white text-xl font-extrabold tracking-tight">
            Go<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Anywhere</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            <Hotel size={15} /> Hotels
          </Link>
          <Link
            href="/admin"
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
