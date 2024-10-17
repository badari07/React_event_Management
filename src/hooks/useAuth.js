// src/hooks/useAuth.js
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decodedToken.exp < currentTime) {
            logout();
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          logout();
        }
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/user/login');
    };

    // Check token on initial render and every minute
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  return { isLoggedIn, setIsLoggedIn };
};

export default useAuth;
