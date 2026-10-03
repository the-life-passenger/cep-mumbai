import React from 'react';
import { Outlet } from 'react-router-dom';
import DemoBanner from './DemoBanner';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
