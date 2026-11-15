# Spec: Curated Expeditions Continuous Glide & Luxury Header Redesign

## 1. Context & User Intent
The user observed in their live preview that the 3D Coverflow effect creates card overlap (partially obscuring titles and descriptions of neighboring cards) and steps forward in 3-second jumps. The user asked whether transitioning to a continuous smooth slide view without second intervals ("কোনো সেকেন্ড থাকবে না, সুন্দরভাবে যাবে") would be superior and requested a header beautification for this feature without touching any other parts of the site.

## 2. Professional Assessment & Comparison
- **3D Coverflow (Previous)**: Causes neighboring cards to tilt and overlap, hiding pricing and destination details. Periodic interval snapping interrupts the reading flow.
- **Continuous Smooth Glide (Proposed)**:
  - Cards stay upright, fully readable, side-by-side with 24px-32px clean spacing.
  - Linear transition timing without second pauses creates a luxurious, calming, continuous marquee stream.
  - Hovering pauses the motion seamlessly (`pauseOnMouseEnter: true`) for interaction and booking.
  - **Verdict**: Far superior aesthetic readability, eliminating clutter and elevating the platform to world-class hospitality standards.

## 3. Scope of Work
- **Target Component**: `components/DestinationCards.tsx` & corresponding section in `index.html`.
- **Untouched Scope**: All authentication, API routes, InquiryModal, footer, header, and search dock components remain strictly untouched.

## 4. Acceptance Criteria
1. **Header Elevation**:
   - Includes gold-bordered luxury badge: `✨ WORLD-CLASS PORTFOLIO` or `✨ CURATED EXPEDITIONS 2026`.
   - Serif headline `Curated Expeditions for 2026` with refined typography.
   - Filter pills (`All`, `Pilgrimage`, `Heritage`, `Islands & Seclusion`, `Alpine & Nature`) and navigation arrows arranged in a balanced, responsive alignment.
2. **Continuous Glide Carousel**:
   - Uses linear transition (`transition-timing-function: linear !important`).
   - Autoplay configured with `delay: 0`, continuous speed (7000ms), and `pauseOnMouseEnter: true`.
   - Cards maintain clean upright posture with crisp borders, zero overlap, and hover scale effects.
3. **Data & Contract Integrity**:
   - All 6 destinations remain functional and interactive.
   - Category filtering and Journey Finder integration remain 100% operational.
   - All 103 unit and end-to-end tests continue to pass.
