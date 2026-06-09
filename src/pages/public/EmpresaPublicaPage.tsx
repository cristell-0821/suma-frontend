import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import EmpresaHeader from '../../components/empresa/EmpresaHeader';
import EmpresaInfo from '../../components/empresa/EmpresaInfo';
import EmpresaSidebar from '../../components/empresa/EmpresaSidebar';
import { empresaService } from '../../services/empresaService';
import type { EmpresaProfile } from '../../services/empresaService';

const EmpresaPublicaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<EmpresaProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    empresaService.getPublicProfile(id)
      .then(setEmpresa)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal" />
      </div>
    );
  }

  if (!empresa) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <EmpresaHeader empresa={empresa} readOnly />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <EmpresaInfo empresa={empresa} />
          </div>
          <div className="lg:col-span-4">
            <EmpresaSidebar empresa={empresa} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmpresaPublicaPage;