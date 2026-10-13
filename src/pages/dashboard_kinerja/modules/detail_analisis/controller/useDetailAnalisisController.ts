import { useNavigate } from 'react-router-dom';

export const useDetailAnalisisController = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/beranda');
  };

  return {
    handleBack,
  };
};

export default useDetailAnalisisController;
