import type { ReactNode } from 'react';
import DashboardNav from './DashboardNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-cream-50 text-brown font-sans">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-8 py-12">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;