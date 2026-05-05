'use client';

import { Plane, Globe, MessageSquare, Heart, Phone } from 'lucide-react';

export default function Footer() {
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
              India&apos;s smartest hotel booking platform. Powered by advanced DBMS with real-time availability.
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
              <p className="text-gray-500 text-[11px]">MySQL · Next.js · React · TypeScript</p>
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
