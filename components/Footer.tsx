import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-brand-emeraldDeep text-white border-t border-brand-gold/20 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Newsletter Section */}
        <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-brand-gold/30 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-gold">Private Society Newsletter</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">Receive Our Curated 2026 Black Book of Journeys</h3>
            <p className="text-neutral-400 text-xs sm:text-sm font-light">Unpublished private villas, upcoming royal pilgrimages, and bespoke invitations sent monthly.</p>
          </div>
          <form className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="w-full sm:w-80 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-brand-gold hover:bg-white text-brand-emeraldDeep font-semibold text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-2xl font-bold tracking-tight text-white uppercase">Travel With Maijrun</h4>
            <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-sm">
              Curating world-class bespoke luxury journeys, royal pilgrimages, and sacred historical expeditions under strict 100% Halal hospitality standards.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs text-brand-gold font-medium">Certified Partner:</span>
              <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded text-neutral-300">IATA Accredited</span>
              <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded text-neutral-300">Halal Tourism Alliance</span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs tracking-[0.2em] uppercase font-bold text-brand-gold">Destinations</h5>
            <ul className="space-y-2 text-xs text-neutral-400 font-light">
              <li><a href="#destinations" className="hover:text-white transition-colors">Makkah & Madinah Royal</a></li>
              <li><a href="#destinations" className="hover:text-white transition-colors">Andalusia & Granada</a></li>
              <li><a href="#destinations" className="hover:text-white transition-colors">Maldives Private Atolls</a></li>
              <li><a href="#destinations" className="hover:text-white transition-colors">Bosphorus & Bodrum</a></li>
              <li><a href="#destinations" className="hover:text-white transition-colors">Swiss Alpine Chalets</a></li>
              <li><a href="#destinations" className="hover:text-white transition-colors">Serengeti Safari Tents</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs tracking-[0.2em] uppercase font-bold text-brand-gold">Expedition Styles</h5>
            <ul className="space-y-2 text-xs text-neutral-400 font-light">
              <li><a href="#bespoke-tailored" className="hover:text-white transition-colors">Private Aviation & Jets</a></li>
              <li><a href="#bespoke-tailored" className="hover:text-white transition-colors">Sacred Royal Umrah</a></li>
              <li><a href="#bespoke-tailored" className="hover:text-white transition-colors">Secluded Honeymoons</a></li>
              <li><a href="#bespoke-tailored" className="hover:text-white transition-colors">Multi-Gen Family Havens</a></li>
              <li><a href="#bespoke-tailored" className="hover:text-white transition-colors">Yacht & Coastal Charters</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs tracking-[0.2em] uppercase font-bold text-brand-gold">VIP Concierge</h5>
            <div className="space-y-2 text-xs text-neutral-400 font-light">
              <p><strong>Hotline:</strong> +880 1800-MAIJRUN</p>
              <p><strong>WhatsApp:</strong> +880 1700-000000</p>
              <p><strong>Private Email:</strong> vip@travelwithmaijrun.com</p>
              <p><strong>Global Office:</strong> Gulshan Avenue, Dhaka & Mayfair, London</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 Travel With Maijrun Ltd. All Rights Reserved. Luxury Reimagined with Purpose.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Halal Certification Guarantee</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Luxury Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
