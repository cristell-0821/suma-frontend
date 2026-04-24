import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MainLayout = ({ children, showFooter = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-cream-50 text-brown font-sans">
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;