import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DETAILED_DESTINATIONS } from '@/lib/destination-details';
import DestinationClientView from '@/components/DestinationClientView';

interface DestinationPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return Object.keys(DETAILED_DESTINATIONS).map((id) => ({
    id,
  }));
}

export function generateMetadata({ params }: DestinationPageProps): Metadata {
  const destination = DETAILED_DESTINATIONS[params.id];
  if (!destination) {
    return {
      title: 'Destination Not Found | Travel With Maijrun',
    };
  }

  return {
    title: `${destination.title} | Travel With Maijrun`,
    description: destination.overview,
    openGraph: {
      title: `${destination.title} • Travel With Maijrun`,
      description: destination.overview,
      images: [
        {
          url: destination.heroImage,
          width: 1200,
          height: 630,
          alt: destination.title,
        },
      ],
    },
  };
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const destination = DETAILED_DESTINATIONS[params.id];

  if (!destination) {
    notFound();
  }

  return <DestinationClientView destination={destination} />;
}
