import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-brand-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-goldDark">Voices of Distinction</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-brand-emerald tracking-tight">
            Praise from Our Dignitaries
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-brand-gold gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="font-serif text-lg text-neutral-700 italic leading-relaxed">
                &ldquo;Travel With Maijrun arranged our royal Umrah in Makkah with unmatched reverence. Having a private scholar and direct Haram access without crowd stress was a gift our family will cherish for generations.&rdquo;
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-100 mt-6">
              <h4 className="font-bold text-brand-emerald text-sm">Al-Mansoor Family</h4>
              <span className="text-xs text-neutral-400 font-light">Dubai, United Arab Emirates</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-brand-gold gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="font-serif text-lg text-neutral-700 italic leading-relaxed">
                &ldquo;Finding genuine 100% halal fine dining and total villa privacy in Europe used to be impossible. Maijrun’s team made our Andalusia and Swiss Alps journey seamless, luxurious, and spiritually tranquil.&rdquo;
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-100 mt-6">
              <h4 className="font-bold text-brand-emerald text-sm">Dr. Farhan & Shagufta Qureshi</h4>
              <span className="text-xs text-neutral-400 font-light">London, United Kingdom</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-brand-gold gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="font-serif text-lg text-neutral-700 italic leading-relaxed">
                &ldquo;The level of discretion and attention to detail rivals any global ultra-luxury brand, but with the heartfelt warmth of Islamic hospitality. We will never travel with anyone else.&rdquo;
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-100 mt-6">
              <h4 className="font-bold text-brand-emerald text-sm">Eng. Tariqul Islam Chowdhury</h4>
              <span className="text-xs text-neutral-400 font-light">Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
