'use client';

import React from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Clock,
  Compass,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface SignatureJourneysProps {
  onOpenInquiry: (destination?: string) => void;
}

const SIGNATURE_CARDS = [
  {
    id: 'switzerland',
    title: 'Switzerland',
    tag: 'Alpine Sanctuary',
    desc: 'Storybook Alpine peaks of Zermatt & Lake Geneva with private halal chalet catering.',
    days: '10 Days',
    price: 'From ৳ 890,000 / $7,400',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Switzerland Alpine Sanctuary',
  },
  {
    id: 'costa-rica',
    title: 'Costa Rica',
    tag: 'Pristine Eco-Sanctuary',
    desc: 'Lush cloud forests, private hot-spring villas, and custom halal eco-adventures.',
    days: '9 Days',
    price: 'From ৳ 720,000 / $6,000',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Costa Rica Rainforest Sanctuary',
  },
  {
    id: 'japan',
    title: 'Japan',
    tag: 'Imperial Heritage',
    desc: 'Kyoto private ryokan buyouts, bullet train first class, and certified halal Wagyu Kaiseki.',
    days: '12 Days',
    price: 'From ৳ 940,000 / $7,800',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Japan Heritage Ryokan',
  },
  {
    id: 'moorish-spain',
    title: 'Moorish Spain',
    tag: 'Islamic Golden Age',
    desc: 'VIP private access to Alhambra, historic Cordoba courtyards, and halal olive-estate dining.',
    days: '11 Days',
    price: 'From ৳ 768,000 / $6,400',
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Andalusia Private Palaces',
  },
  {
    id: 'turkey-bosphorus',
    title: 'Bosphorus & Cappadocia',
    tag: 'Ottoman Grandeur',
    desc: 'Private Golden Horn yacht charters and exclusive cave-sanctuary hot air balloon dawns.',
    days: '8 Days',
    price: 'From ৳ 640,000 / $5,300',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Ottoman Bosphorus & Cappadocia',
  },
  {
    id: 'serengeti-safari',
    title: 'Serengeti & Rovos Rail',
    tag: 'Royal Wilderness',
    desc: 'Vintage luxury train traverse through wild savannahs with private halal bush banquet dining.',
    days: '13 Days',
    price: 'From ৳ 1,120,000 / $9,300',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
    inquiryTarget: 'Serengeti Royal Wilderness',
  },
];

export default function SignatureJourneys({ onOpenInquiry }: SignatureJourneysProps) {
  return (
    <section id="signature-journeys" className="py-24 bg-[#FAFAF8] border-b border-brand-sandDark/70 scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header with Title and Swiper Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#0B2019] text-[10px] tracking-[0.25em] uppercase font-bold mb-2">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Destinations We Love</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B2019] tracking-tight">
              Signature Journeys
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm font-light mt-1 max-w-xl">
              Inspired by iconic global journeys, hand-crafted with 100% verified Halal luxury and private sanctuary protocols.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenInquiry('Where Do You Want To Go Consultation')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#0B2019] hover:text-[#D4AF37] transition-colors cursor-pointer group"
            >
              <span>Request Custom Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Swiper Navigation Arrows */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-300">
              <button
                type="button"
                className="sig-swiper-prev w-10 h-10 rounded-full border border-[#D4AF37]/50 bg-white hover:bg-[#D4AF37] hover:border-[#D4AF37] text-[#061410] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous Journey"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="sig-swiper-next w-10 h-10 rounded-full border border-[#D4AF37]/50 bg-white hover:bg-[#D4AF37] hover:border-[#D4AF37] text-[#061410] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next Journey"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper Slider Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, A11y]}
            spaceBetween={24}
            slidesPerView={1.15}
            loop={SIGNATURE_CARDS.length > 4}
            grabCursor={true}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: '.sig-swiper-prev',
              nextEl: '.sig-swiper-next',
            }}
            pagination={{
              el: '.sig-swiper-pagination',
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="w-full !pb-14 overflow-visible"
          >
            {SIGNATURE_CARDS.map((card) => (
              <SwiperSlide key={card.id} className="h-auto">
                <div
                  onClick={() => onOpenInquiry(card.inquiryTarget)}
                  className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl h-[420px] flex flex-col justify-end p-6 cursor-pointer border border-[#D4AF37]/25 transition-all duration-500 hover:-translate-y-1.5 bg-[#061410]"
                >
                  {/* Background Image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061410] via-black/40 to-black/10 group-hover:via-black/50 transition-colors" />

                  {/* Top Tag */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 shadow-sm">
                      {card.tag}
                    </span>
                  </div>

                  {/* Top Right Quick Action Pill */}
                  <div className="absolute top-5 right-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#061410] flex items-center justify-center shadow-lg">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Information */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-200 font-light line-clamp-2 leading-relaxed">
                      {card.desc}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-white/15 text-[11px]">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{card.days}</span>
                      </div>
                      <span className="text-[#D4AF37] font-semibold">
                        {card.price}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dynamic Swiper Pagination Bullets */}
          <div className="sig-swiper-pagination flex justify-center mt-2" />
        </div>

      </div>
    </section>
  );
}
