import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { MedicalTeam } from './components/MedicalTeam';
import { CTAFinal } from './components/CTAFinal';

export default function PublicLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <MedicalTeam />
      <CTAFinal />
    </div>
  );
}