import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import { postulanteService } from '../../services/postulanteService';
import { empresaService } from '../../services/empresaService';
import StepRoleSelection from '../../components/auth/StepRoleSelection';
import Step1Postulante from '../../components/auth/postulante/Step1Postulante';
import Step2Postulante from '../../components/auth/postulante/Step2Postulante';
import Step1Empresa from '../../components/auth/empresa/Step1Empresa';
import Step2Empresa from '../../components/auth/empresa/Step2Empresa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const [step, setStep] = useState<'role' | 'postulante1' | 'postulante2' | 'empresa1' | 'empresa2'>('role');
  const [selectedRole, setSelectedRole] = useState<'POSTULANTE' | 'EMPRESA' | null>(null);
  
  // Datos acumulados del postulante
  const [postulanteData, setPostulanteData] = useState<{
    nombres: string;
    apellidos: string;
    disabilityIds: string[];
    email: string;
    password: string;
    telefono: string;
    departamento: string;
  } | null>(null);

  const [empresaData, setEmpresaData] = useState<{
    razonSocial: string;
    ruc: string;
    sector: string;
    tamaño: string;
    ciudad: string;
  } | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (role: 'POSTULANTE' | 'EMPRESA') => {
    setSelectedRole(role);
    if (role === 'POSTULANTE') {
      setStep('postulante1');
    } else {
      setStep('empresa1');
    }
  };

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
      departamento: '',
    });
    setStep('postulante2');
  };

  const handlePostulanteStep2 = async (data: {
    email: string;
    password: string;
    telefono: string;
    departamento: string;
  }) => {
    if (!postulanteData) return;
    
    setLoading(true);
    setError('');

    try {
      // 1. Registrar usuario
      const authResponse = await authService.register({
        email: data.email,
        password: data.password,
        role: 'POSTULANTE',
      });

      // 2. ✅ GUARDAR AUTH PRIMERO (para que updateProfile tenga token)
      setAuth(authResponse.user, authResponse.accessToken, authResponse.refreshToken);

      // 3. Actualizar perfil (ahora sí tiene token)
      await postulanteService.updateProfile({
        nombres: postulanteData.nombres,
        apellidos: postulanteData.apellidos,
        telefono: data.telefono,
        ciudad: data.departamento,
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
    sector: string;
    tamaño: string;
    ciudad: string;
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

      // ✅ GUARDAR AUTH PRIMERO
      setAuth(authResponse.user, authResponse.accessToken, authResponse.refreshToken);

      await empresaService.updateProfile({
        razonSocial: empresaData.razonSocial,
        ruc: empresaData.ruc,
        sector: empresaData.sector,
        tamaño: empresaData.tamaño,
        ciudad: empresaData.ciudad,
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
    } else if (step === 'postulante1' || step === 'empresa1') {
      setStep('role');
      setSelectedRole(null);
    }
  };

  // Render según el paso actual
  if (step === 'role') {
    return <StepRoleSelection onSelectRole={handleSelectRole} onGoToLogin={goToLogin} />;
  }

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
    return <Step2Empresa onSubmit={handleEmpresaStep2} onBack={goBack} />;
  }
};

export default RegisterPage;