# Plan: Curated Expeditions Continuous Glide & Luxury Header Redesign

## 1. Architectural Changes
1. **Header Layout**:
   - Wrap header badge with luxury pill styling:
     ```tsx
     <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#0B2019] text-[10px] tracking-[0.25em] uppercase font-bold mb-2">
       <Sparkles className="w-3 h-3 text-[#D4AF37]" />
       <span>World-Class Portfolio</span>
     </div>
     ```
   - Heading: `Curated Expeditions for 2026` with Cormorant Garamond font.
   - Subtitle: `Swipe or glide through our hand-picked, certified luxury halal sanctuaries.`
   - Filter pills with gold active accents and smooth transitions.
   - Gold-ringed navigation arrow buttons.

2. **Carousel Motion Engine**:
   - Swiper with `loop={true}`, `speed={7500}`, `spaceBetween={24}`.
   - `autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}`.
   - CSS rule:
     ```css
     .destinations-glide-swiper .swiper-wrapper {
       transition-timing-function: linear !important;
     }
     ```
   - Responsive slidesPerView: 1.15 (mobile), 2.2 (tablet), 3.2 (desktop).
   - Card cards styled cleanly with `journey-card` luxury borders and elevation.

3. **Parity in `index.html`**:
   - Mirror continuous marquee linear transition and header styling in `index.html`.

4. **Verification**:
   - Run `npm test` (all 103 tests pass).
   - Run `npm run build` (Next.js production build succeeds).
   - Push to `origin main`.
