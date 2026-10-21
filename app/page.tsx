'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import JourneyFinder from '@/components/JourneyFinder';
import HalalPillars from '@/components/HalalPillars';
import DestinationCards from '@/components/DestinationCards';
import BespokeSection from '@/components/BespokeSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import InquiryModal from '@/components/InquiryModal';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string | undefined>();

  const handleOpenInquiry = (destination?: string) => {
    setSelectedTarget(destination);
    setModalOpen(true);
  };

  const handleCloseInquiry = () => {
    setModalOpen(false);
    setSelectedTarget(undefined);
  };

  return (
    <main className="min-h-screen bg-brand-sand">
      <Navbar onOpenInquiry={handleOpenInquiry} />
      <HeroSlider onOpenInquiry={handleOpenInquiry} />
      <JourneyFinder />
      <HalalPillars />
      <DestinationCards onOpenInquiry={handleOpenInquiry} />
      <BespokeSection onOpenInquiry={handleOpenInquiry} />
      <Testimonials />
      <Footer />

      <InquiryModal
        isOpen={modalOpen}
        destinationTitle={selectedTarget}
        onClose={handleCloseInquiry}
      />
    </main>
  );
}
