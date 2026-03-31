import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Key, ArrowRight, ShieldAlert } from 'lucide-react';

const SecureRedirectAccess = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`http://localhost:5000/api/links/access/${token}`, {
        password
      });
      
      const { url } = response.data;
      if (url) {
        // Success redirect
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Access denied or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '450px', margin: '4rem auto' }}
    >
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(96, 165, 250, 0.1)', color: 'var(--primary)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <Lock size={48} />
        </div>
        
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: 'var(--text-main)' }}>
          Secure Link Protected
        </h2>
        <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          This payload is AES-encrypted at rest and requires a key-stream to unlock. Enter the password provided to you by the sender.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#ef4444', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <ShieldAlert size={18} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={16} /> Access Password
            </label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password..."
              required
              autoFocus
              style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.1em' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', alignItems: 'center', padding: '1rem', fontSize: '1.1rem' }}>
            {loading ? 'Decrypting Payload...' : <span>Unlock & Redirect <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }} /></span>}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default SecureRedirectAccess;
