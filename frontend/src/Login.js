import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; // Your API utility
import { toast } from 'react-toastify';
import { UserContext } from './userContext.js'; // Import your User Context

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Use context to set user

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { username, password });
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      setUser(response.data.user); // Update user context
      toast.success('Login Successful'); // Show success message
      navigate('/companies'); // Redirect to companies management page
    } catch (error) {
      console.error('Error logging in:', error); // Log error to console
      toast.error('Login Failed'); // Show error message
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
