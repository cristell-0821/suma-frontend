import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import MainLayout from '../../components/layout/MainLayout';
import { UserPlus, Network, PartyPopper, ArrowRight } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const getToken = () => localStorage.getItem('accessToken');

  const handleBuscoEmpleo = () => {
    const token = getToken();
    if (token && user?.role === 'POSTULANTE') {
      navigate('/postulante/empleos');
    } else {
      if (!token) logout();
      navigate('/registro?role=postulante');
    }
  };

  const handleSoyEmpresa = () => {
    const token = getToken();
    if (token && user?.role === 'EMPRESA') {
      navigate('/empresa');
    } else {
      if (!token) logout();
      navigate('/registro?role=empresa');
    }
  };

  /* const handleShowMyPotential = () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    if (user?.role === 'POSTULANTE') {
      navigate('/postulante/empleos');
    } else if (user?.role === 'EMPRESA') {
      navigate('/empresa');
    }
  }; */

  const STEPS = [
    {
      Icon: UserPlus,
      title: "1. Regístrate",
      desc: "Crea un perfil que resalte tus talentos únicos. No pedimos etiquetas, pedimos potencial.",
      color: "border-teal",
      bgIcon: "bg-teal-50",
      iconColor: "text-teal",
      textColor: "text-teal",
    },
    {
      Icon: Network,
      title: "2. Encuentra tu match",
      desc: "Nuestro algoritmo conecta tus habilidades con empresas que buscan exactamente lo que ofreces.",
      color: "border-coral",
      bgIcon: "bg-coral-50",
      iconColor: "text-coral",
      textColor: "text-coral",
    },
    {
      Icon: PartyPopper,
      title: "3. Empieza a trabajar",
      desc: "Acompañamos tu proceso de Onboarding para asegurar un entorno de trabajo accesible y justo.",
      color: "border-brown",
      bgIcon: "bg-cream-100",
      iconColor: "text-brown",
      textColor: "text-brown",
    },
  ];

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 z-10">
            <div className="inline-block px-4 py-2 bg-teal-50 text-teal rounded-full text-sm font-bold tracking-wider uppercase">
              Talento sin etiquetas
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-brown leading-[1.1] tracking-tight font-sans">
              Súmate al <span className="text-teal italic">trabajo inclusivo</span>
            </h1>
            <p className="text-lg text-brown/70 leading-relaxed max-w-xl">
              Conectamos talento extraordinario con empresas que valoran la diversidad en el Perú. Un espacio diseñado para honrar tu dignidad y potenciar tus habilidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleBuscoEmpleo}
                className="bg-coral text-white px-8 py-4 rounded-xl font-sans font-bold text-lg shadow-lg hover:bg-coral-600 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Busco Empleo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleSoyEmpresa}
                className="bg-teal text-white px-8 py-4 rounded-xl font-sans font-bold text-lg hover:bg-teal-600 active:scale-95 transition-all flex items-center justify-center"
              >
                Soy Empresa
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-40"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700">
              <img
                alt="Equipo inclusivo"
                className="w-full h-[500px] object-cover"
                src="/img/home2.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal/30 to-transparent"></div>
            </div>
            {/* Card flotante */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl max-w-xs border-l-4 border-teal">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-teal-50 p-2 rounded-full">
                  <img 
                    src="/icons/comunity.svg" 
                    alt="Comunidad" 
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-bold text-brown font-sans">Más de 500+</span>
              </div>
              <p className="text-sm text-brown/60">Matchings exitosos logrados este año en todo el Perú.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className=" py-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-16 space-y-3">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-brown font-sans">
              Tu camino hacia el éxito
            </h2>
            <p className="text-lg text-brown/60 max-w-2xl">
              Simplificamos el proceso para que te enfoques en lo que mejor sabes hacer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => {
              const Icon = step.Icon;

              return (
                <div
                  key={step.title}
                  className={`bg-white p-8 rounded-2xl shadow-sm ${step.color} border-l-4 group hover:shadow-lg transition-all h-full flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-14 h-14 ${step.bgIcon} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`${step.iconColor} w-6 h-6`} />
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-brown font-sans">
                      {step.title}
                    </h3>

                    <p className="text-brown/60 leading-relaxed text-sm">
                      {step.desc}
                    </p>
                  </div>

                  {/* <div className={`mt-6 ${step.textColor} font-bold flex items-center gap-1 text-sm font-sans`}>
                    Comenzar 
                    <ChevronRight className="w-4 h-4" />
                  </div> */}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="mx-6 mb-24 px-6">
        <div className="max-w-7xl mx-auto bg-teal rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="flex-1 p-12 md:p-16 space-y-5 text-white">
            <h2 className="text-3xl md:text-4xl font-black leading-tight font-sans">
              Impactando vidas en todo el país
            </h2>
            <p className="text-base text-white/80">
              Nuestra misión es descentralizar el talento y crear oportunidades reales en cada región del Perú.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <div className="text-4xl font-black mb-1 font-sans">94%</div>
                <div className="text-xs uppercase tracking-widest font-bold text-white/70">Retención laboral</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-1 font-sans">12k+</div>
                <div className="text-xs uppercase tracking-widest font-bold text-white/70">Postulantes</div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] relative bg-teal-600 flex items-center justify-center">
            <img
              src="/img/city.jpg"
              alt="Ciudad"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <div className="bg-cream-100 rounded-2xl p-12 md:p-16 space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-brown font-sans">
            ¿Listo para mostrar tu potencial?
          </h2>
          <p className="text-lg text-brown/60">
            Únete a la comunidad más grande de talento diverso en el Perú y transforma tu futuro hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              onClick={handleBuscoEmpleo}
              className="bg-teal text-white px-10 py-5 rounded-xl font-sans font-bold text-lg hover:bg-teal-600 hover:shadow-xl active:scale-95 transition-all"
            >
              Crear mi Perfil Gratis
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;