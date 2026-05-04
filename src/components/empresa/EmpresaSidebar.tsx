import { Accessibility, Phone, Mail, User } from 'lucide-react';
import type { EmpresaProfile } from '../../services/empresaService';

interface Props {
  empresa: EmpresaProfile;
}

const EmpresaSidebar = ({ empresa }: Props) => {

  return (
    <div className="space-y-8">
      {/* Inclusión Activa */}
      <div className="bg-cream-50 p-6 rounded-2xl border border-cream-200">
        <h3 className="text-lg font-bold text-brown mb-4 flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-teal" />
          Inclusión Activa
        </h3>
        <p className="text-sm text-brown/60 mb-4 leading-relaxed">
          Nuestras instalaciones y flujos de trabajo están optimizados para brindar igualdad de oportunidades.
        </p>
        <div className="flex flex-wrap gap-2">
          {empresa.accommodations?.length > 0 ? (
            empresa.accommodations.map((acc, idx) => (
              <span
                key={idx}
                className="bg-teal-50 text-teal px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {acc}
              </span>
            ))
          ) : (
            <p className="text-sm text-brown/40 italic">No hay acomodaciones especificadas</p>
          )}
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
        <h3 className="text-lg font-bold text-brown mb-4">Contacto</h3>
        <div className="space-y-3">
          {empresa.nombreContacto && (
            <div className="flex items-center gap-2 text-sm text-brown">
              <User className="w-4 h-4 text-teal" />
              {empresa.nombreContacto}
            </div>
          )}
          {empresa.cargoContacto && (
            <div className="flex items-center gap-2 text-sm text-brown/60">
              <Mail className="w-4 h-4 text-teal" />
              {empresa.cargoContacto}
            </div>
          )}
          {empresa.telefonoContacto && (
            <div className="flex items-center gap-2 text-sm text-brown/60">
              <Phone className="w-4 h-4 text-teal" />
              {empresa.telefonoContacto}
            </div>
          )}
          {!empresa.nombreContacto && !empresa.telefonoContacto && (
            <p className="text-sm text-brown/40 italic">No hay datos de contacto</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpresaSidebar;