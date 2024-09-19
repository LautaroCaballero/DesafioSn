import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const dni = localStorage.getItem('dni');
    if (dni) {
      navigate('/table'); 
    }
  }, [navigate]);
};