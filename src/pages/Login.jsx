import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7078/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">Quadrant Connect</div>
        <h2>Sign in</h2>
        <p>
          Don’t have an account? <a href="/signup">Get started</a>
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
          <button type="submit" className="btn-primary">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
