import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNotAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const dni = localStorage.getItem('dni');
    if (!dni) {
      navigate('/'); 
    }
  }, [navigate]);
};