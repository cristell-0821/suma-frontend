import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import { postulanteService } from '../../services/postulanteService';
import { empresaService } from '../../services/empresaService';
import Step1Postulante from '../../components/auth/postulante/Step1Postulante';
import Step2Postulante from '../../components/auth/postulante/Step2Postulante';
import Step1Empresa from '../../components/auth/empresa/Step1Empresa';
import Step2Empresa from '../../components/auth/empresa/Step2Empresa';

type Step = 'postulante1' | 'postulante2' | 'empresa1' | 'empresa2';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  const roleParam = searchParams.get('role');

  const [step, setStep] = useState<Step>('postulante1');

  // Datos acumulados del postulante
  const [postulanteData, setPostulanteData] = useState<{
    nombres: string;
    apellidos: string;
    disabilityIds: string[];
    email: string;
    password: string;
    telefono: string;
    ciudadId: string; 
  } | null>(null);

  const [empresaData, setEmpresaData] = useState<{
    razonSocial: string;
    ruc: string;
    sectorId: string;
    tamaño: string;
    ciudadId: string;
  } | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validar role param y setear step inicial
  useEffect(() => {
    if (roleParam === 'postulante') {
      setStep('postulante1');
    } else if (roleParam === 'empresa') {
      setStep('empresa1');
    } else {
      // Si no hay role válido, redirigir al home
      navigate('/', { replace: true });
    }
  }, [roleParam, navigate]);

  const handlePostulanteStep1 = (data: {
    nombres: string;
    apellidos: string;
    disabilityIds: string[];
  }) => {
    setPostulanteData({
      ...data,
      email: '',
      password: '',
      telefono: '',
      ciudadId: '',
    });
    setStep('postulante2');
  };

  const handlePostulanteStep2 = async (data: {
    email: string;
    password: string;
    telefono: string;
    ciudadId: string;  // ← cambiado de departamento: string
  }) => {
    if (!postulanteData) return;

    setLoading(true);
    setError('');

    try {
      const authResponse = await authService.register({
        email: data.email,
        password: data.password,
        role: 'POSTULANTE',
      });

      setAuth(authResponse.user, authResponse.accessToken, authResponse.refreshToken);

      await postulanteService.updateProfile({
        nombres: postulanteData.nombres,
        apellidos: postulanteData.apellidos,
        telefono: data.telefono,
        ciudadId: data.ciudadId,        // ← NUEVO: enviar ciudadId
        disabilityIds: postulanteData.disabilityIds,
      });

      navigate('/postulante');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleEmpresaStep1 = (data: {
    razonSocial: string;
    ruc: string;
    sectorId: string;
    tamaño: string;
    ciudadId: string;
  }) => {
    setEmpresaData(data);
    setStep('empresa2');
  };

  const handleEmpresaStep2 = async (data: {
    email: string;
    password: string;
    nombreContacto: string;
    cargoContacto: string;
    telefonoContacto: string;
  }) => {
    if (!empresaData) return;

    setLoading(true);
    setError('');

    try {
      const authResponse = await authService.register({
        email: data.email,
        password: data.password,
        role: 'EMPRESA',
      });

      setAuth(authResponse.user, authResponse.accessToken, authResponse.refreshToken);

      await empresaService.updateProfile({
        razonSocial: empresaData.razonSocial,
        ruc: empresaData.ruc,
        sectorId: empresaData.sectorId,     // ← cambiado
        tamaño: empresaData.tamaño,
        ciudadId: empresaData.ciudadId,     // ← cambiado
        nombreContacto: data.nombreContacto,
        cargoContacto: data.cargoContacto,
        telefonoContacto: data.telefonoContacto,
      });

      navigate('/empresa');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goBack = () => {
    if (step === 'postulante2') {
      setStep('postulante1');
    } else if (step === 'empresa2') {
      setStep('empresa1');
    } else {
      // Si está en el primer paso, volver al home
      navigate('/');
    }
  };

  // Render según el paso actual
  if (step === 'postulante1') {
    return <Step1Postulante onContinue={handlePostulanteStep1} onBack={goBack} />;
  }

  if (step === 'postulante2') {
    return (
      <Step2Postulante
        onSubmit={handlePostulanteStep2}
        onBack={goBack}
      />
    );
  }

  if (step === 'empresa1') {
    return <Step1Empresa onContinue={handleEmpresaStep1} onBack={goBack} />;
  }

  if (step === 'empresa2') {
    return (
      <Step2Empresa
        onSubmit={handleEmpresaStep2}
        onBack={goBack}
      />
    );
  }

  // Fallback mientras carga el useEffect
  return null;
};

export default RegisterPage;