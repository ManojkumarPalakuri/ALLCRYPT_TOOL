import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <motion.div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <UserPlus size={40} className="text-primary" style={{ marginBottom: '1rem' }} />
          <h2>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Get started with IBM Encrypt</p>
        </div>
        
        {error && <div className="badge badge-error" style={{ padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <input type="text" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="johndoe" />
          </div>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
