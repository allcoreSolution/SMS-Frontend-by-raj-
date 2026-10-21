import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/landing/Hero';
import Deliverables from '../components/landing/Deliverables';
import Ecosystem from '../components/landing/Ecosystem';
import Features from '../components/landing/Features';
import AIFeature from '../components/landing/AIFeature';
import HardwareSync from '../components/landing/HardwareSync';
import Modules from '../components/landing/Modules';
import Showcase from '../components/landing/Showcase';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import PurchaseTerms from '../components/landing/PurchaseTerms';
import FooterLanding from '../components/landing/FooterLanding';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] overflow-hidden">
      <Navbar />
      
      {/* Background Grid Pattern & Liquid Button CSS (Global) */}
      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #0000000A 1px, transparent 1px),
            linear-gradient(to bottom, #0000000A 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .liquid-btn {
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .liquid-btn::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: 100%;
          left: -50%;
          background-color: var(--liquid-bg, #0f172a);
          border-radius: 40%;
          z-index: -1;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), top 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s ease;
        }
        .liquid-btn:hover::before {
          top: -30%;
          transform: rotate(180deg);
          border-radius: 0%;
        }
        .liquid-btn * {
          transition: color 0.4s ease;
        }
        .liquid-btn:hover * {
          color: var(--liquid-text, #ffffff) !important;
        }
      `}</style>
      
      <main className="mt-20">
         <Hero />
         <Deliverables />
         <Ecosystem />
         <Features />
         <AIFeature />
         <HardwareSync />
         <Modules />
         <Showcase />
         <Testimonials />
         <Pricing />
         <FAQ />
         <PurchaseTerms />
      </main>

      <FooterLanding />
    </div>
  );
}
