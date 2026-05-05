'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plane, Hotel, LayoutDashboard, LogOut, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AuthUser {
  user_id: number;
  name: string;
  email: string;
  role: 'guest' | 'admin';
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.includes('/admin');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

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

          {user ? (
            /* Logged In — User dropdown */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 text-white text-sm font-medium px-3 py-2 rounded-lg hover:border-blue-500/40 transition-all"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block max-w-[120px] truncate">{user.name}</span>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-gray-500 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-2 bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-gray-400 text-sm rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <UserCircle size={16} /> My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-400 text-sm rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Not logged in — Show Login button */
            <Link
              href="/login"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
            >
              Login or Signup
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
