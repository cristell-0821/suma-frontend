import { CheckCircle2, ListChecks, AlignLeft } from 'lucide-react';

interface Props {
  descripcion: string;
  funciones: string | string[];
  requisitos: string | string[];
}

const normalizeToArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  // Si es string, separar por saltos de línea
  return value
    .split(/[\n\r]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const JobDescription = ({ descripcion, funciones, requisitos }: Props) => {
  const funcionesList = normalizeToArray(funciones);
  const requisitosList = normalizeToArray(requisitos);

  return (
    <div className="space-y-10">
      {/* Descripción */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brown font-sans flex items-center gap-2">
          <AlignLeft className="w-6 h-6 text-teal" />
          Descripción del Puesto
        </h2>
        <p className="text-brown/70 leading-relaxed whitespace-pre-line">
          {descripcion}
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Responsabilidades */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-brown font-sans flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-teal" />
            Responsabilidades
          </h3>
          {funcionesList.length > 0 ? (
            <ul className="space-y-3">
              {funcionesList.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-brown/70">
                  <span className="w-2 h-2 mt-2 rounded-full bg-teal shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brown/40 text-sm italic">No especificado</p>
          )}
        </section>

        {/* Requisitos */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-brown font-sans flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-coral" />
            Requisitos
          </h3>
          {requisitosList.length > 0 ? (
            <ul className="space-y-3">
              {requisitosList.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-brown/70">
                  <span className="w-2 h-2 mt-2 rounded-full bg-coral shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brown/40 text-sm italic">No especificado</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobDescription;