// src/utils/axiosConfig.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Your API base URL
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate();
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid
      localStorage.removeItem('token'); // Clear token

      toast.error('Your session has expired. You are being logged out.', {
        autoClose: 1000, // Show for 5 seconds
      });

      setTimeout(() => {
        navigate('/user/login');
      }, 1500); 
       // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
