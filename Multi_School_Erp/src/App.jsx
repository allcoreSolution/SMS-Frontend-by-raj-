import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModulesPage from './pages/ModulesPage';
import PricingPage from './pages/PricingPage';
import { ModalProvider } from './context/ModalContext';
import PortalModal from './components/PortalModal';

export default function App() {
  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
        <PortalModal />
      </BrowserRouter>
    </ModalProvider>
  );
}
