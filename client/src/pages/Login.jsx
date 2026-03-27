import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <motion.div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <LogIn size={40} className="text-primary" style={{ marginBottom: '1rem' }} />
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue to IBM Encrypt</p>
        </div>
        
        {error && <div className="badge badge-error" style={{ padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login securely
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
