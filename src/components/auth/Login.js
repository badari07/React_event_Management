import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true); 
      toast.success('Login successful!', {
        autoClose: 500, // Close after 2 seconds
        hideProgressBar: false, // Show progress bar
      });
      setTimeout(() => {
        navigate('/events'); 
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.' , {
        autoClose: 2000, // Close after 2 seconds
        hideProgressBar: false, // Show progress bar
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
    <form  className="login-form" onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        minLength={8} 
        maxLength={20} 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
    <ToastContainer /> 
    </div>
  );
};

export default Login;
