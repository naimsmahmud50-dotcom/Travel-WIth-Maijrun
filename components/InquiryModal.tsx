'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  destinationTitle?: string;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, destinationTitle, onClose }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('Couples / 2 Guests');
  const [preferences, setPreferences] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Synchronize destination when modal opens or destinationTitle prop changes
  useEffect(() => {
    if (isOpen) {
      setDestination(destinationTitle || '');
      setError('');
    }
  }, [isOpen, destinationTitle]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting && !isSubmittingRef.current) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting]);

  // Auto-close modal after successful submission
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (submitted) {
      timer = setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [submitted, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting || isSubmittingRef.current) return;
    setSubmitted(false);
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubmittingRef.current) return;
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // Client-side validations
    if (!trimmedName) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    const phoneClean = trimmedPhone.replace(/[\s().-]/g, '');
    if (!trimmedPhone || phoneClean.length < 6 || !/^\+?[0-9]+$/.test(phoneClean)) {
      setError('Please provide a valid WhatsApp or phone contact number.');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      destination: destination.trim() || destinationTitle || 'Custom Bespoke Itinerary',
      guests: guests.trim() || 'Couples / 2 Guests',
      preferences: preferences.trim() || 'None specified',
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const errorMsg =
          data?.error || 'Unable to transmit your bespoke inquiry. Please try again or contact our VIP concierge.';
        setError(errorMsg);
        return;
      }

      // Success: clear/reset all fields
      setName('');
      setEmail('');
      setPhone('');
      setDestination('');
      setGuests('Couples / 2 Guests');
      setPreferences('');
      setError('');
      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Network connection error. Please verify your connection and try again.';
      setError(message);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting && !isSubmittingRef.current) {
          handleClose();
        }
      }}
    >
      <div className="glass-light bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-brand-gold/30 animate-fade-in max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-neutral-400 hover:text-brand-emerald transition-colors disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <span className="text-4xl">✨</span>
            <h3 id="inquiry-modal-title" className="font-serif text-3xl text-brand-emerald font-bold">
              Alhamdulillah!
            </h3>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              Your confidential bespoke inquiry has been received. Our Senior Travel Director will contact you within 4 business hours.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-brand-gold text-brand-emerald hover:bg-brand-gold hover:text-white transition-all text-xs tracking-wider uppercase font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-goldDark">Private Invitation</span>
              <h3 id="inquiry-modal-title" className="font-serif text-3xl text-brand-emerald font-bold">
                {destinationTitle ? `Inquire: ${destinationTitle}` : 'Plan Your Bespoke Escape'}
              </h3>
              <p className="text-xs text-neutral-500">Provide your preferences and our senior travel director will contact you discretely.</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="inquiry-name" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  id="inquiry-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. Sheikh Mahmud Hasan"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50 disabled:bg-neutral-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-email" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="inquiry-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50 disabled:bg-neutral-50"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-phone" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    id="inquiry-phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50 disabled:bg-neutral-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-destination" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    Desired Destination
                  </label>
                  <input
                    id="inquiry-destination"
                    name="destination"
                    type="text"
                    list="destination-suggestions"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    disabled={isSubmitting}
                    placeholder={destinationTitle || 'e.g. Royal Makkah & Madinah'}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50 disabled:bg-neutral-50"
                  />
                  <datalist id="destination-suggestions">
                    <option value="Royal Makkah & Madinah Sanctuary" />
                    <option value="Andalusia & Alhambra Private Heritage" />
                    <option value="The Pearl Pavilions: Maldives Sanctuary" />
                    <option value="Swiss Alps Halal Chalet Escape" />
                    <option value="Istanbul Ottoman Palaces & Bosphorus" />
                    <option value="Serengeti Private Halal Wildlife Safari" />
                    <option value="Bespoke Custom Plan" />
                  </datalist>
                </div>
                <div>
                  <label htmlFor="inquiry-guests" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    Guests / Retinue Size
                  </label>
                  <input
                    id="inquiry-guests"
                    name="guests"
                    type="text"
                    list="guests-suggestions"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g. Couples / 2 Guests"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50 disabled:bg-neutral-50"
                  />
                  <datalist id="guests-suggestions">
                    <option value="Couples / 2 Guests" />
                    <option value="Solo Traveler / 1 Guest" />
                    <option value="Family Sanctuary (3-5 Guests)" />
                    <option value="Royal Retinue (6+ Guests)" />
                    <option value="VIP Delegation / Corporate" />
                  </datalist>
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-preferences" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Special Preferences / Halal Amenities
                </label>
                <textarea
                  id="inquiry-preferences"
                  name="preferences"
                  rows={3}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Tell us about specific privacy requirements, dietary requests, scholar accompaniment, or preferred dates..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50 disabled:bg-neutral-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-emerald hover:bg-brand-gold text-white hover:text-brand-emeraldDeep font-semibold text-xs tracking-widest uppercase py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                    <span>Securing Bespoke Request...</span>
                  </>
                ) : (
                  'Request Confidential Proposal'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
