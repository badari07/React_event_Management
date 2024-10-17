// src/components/auth/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/users/register', { name, email, password });
      toast.success('Registration successful! You can now log in.', {
        autoClose: 500, // Close after 2 seconds
        hideProgressBar: false, // Show progress bar
      });
      setTimeout(() => {
        navigate('/user/login');
      }, 1000); // 2000 milli
       // Redirect to login after successful registration
    } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.' , {
            autoClose: 2000, // Close after 2 seconds
            hideProgressBar: false, // Show progress bar
          });
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="register-container">
    <form  className="register-form"  onSubmit={handleRegister}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password"  minLength={8} maxLength={20} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
    <ToastContainer /> 
    </div>

  );
};

export default Register;
