import type { ReactNode } from 'react';
import Navbar from './Navbar';
import { usePostulanteProfile } from '../../hooks/usePostulanteProfile';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  usePostulanteProfile();
  return (
    <div className="min-h-screen bg-cream-50 text-brown font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;