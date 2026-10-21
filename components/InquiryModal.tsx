'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  destinationTitle?: string;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, destinationTitle, onClose }: InquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-light bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-brand-gold/30 animate-fade-in max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-brand-emerald transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <span className="text-4xl">✨</span>
            <h3 className="font-serif text-3xl text-brand-emerald font-bold">Alhamdulillah!</h3>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              Your confidential bespoke inquiry has been received. Our Senior Travel Director will contact you within 4 business hours.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-goldDark">Private Invitation</span>
              <h3 className="font-serif text-3xl text-brand-emerald font-bold">
                {destinationTitle ? `Inquire: ${destinationTitle}` : 'Plan Your Bespoke Escape'}
              </h3>
              <p className="text-xs text-neutral-500">Provide your preferences and our senior travel director will contact you discretely.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sheikh Mahmud Hasan"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1800-000000"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">Special Preferences / Halal Amenities</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about specific privacy requirements, dietary requests, scholar accompaniment, or preferred dates..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-emerald hover:bg-brand-gold text-white hover:text-brand-emeraldDeep font-semibold text-xs tracking-widest uppercase py-4 rounded-xl shadow-lg transition-all duration-300"
              >
                Request Confidential Proposal
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
