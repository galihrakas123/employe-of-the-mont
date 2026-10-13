import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLoginController = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin.sdm@bapenda.jabarprov.go.id');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bapenda_token', 'mock_jwt_token_12345');
    navigate('/');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
  };
};

export default useLoginController;
