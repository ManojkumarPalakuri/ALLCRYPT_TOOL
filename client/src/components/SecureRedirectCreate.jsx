import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Lock, Key, Clock, Share2, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const SecureRedirectCreate = () => {
  const [password, setPassword] = useState('');
  const [expiresInMinutes, setExpiresInMinutes] = useState('');
  const [isOneTime, setIsOneTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultToken, setResultToken] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Re-declare useState directly below since I made a typo above.
  const [targetUrl, setTargetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUrl || !password) {
      setError('URL and Password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/links/create', {
        url: targetUrl,
        password,
        expiresInMinutes: expiresInMinutes ? parseInt(expiresInMinutes) : null,
        isOneTime
      });
      
      setResultToken(response.data.token);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create secure link');
    } finally {
      setLoading(false);
    }
  };

  const shortLink = resultToken ? `${window.location.origin}/s/${resultToken}` : '';

  const handleCopy = () => {
    if (!shortLink) return;
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '700px', margin: '0 auto' }}
    >
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '12px', display: 'flex' }}>
            <LinkIcon size={24} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.75rem', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Secure URL Redirect
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Create a password-protected short link.</p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#ef4444', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span> {error}
          </div>
        )}

        {!resultToken ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={16} /> Destination URL
              </label>
              <input 
                type="url" 
                className="form-control" 
                value={targetUrl} 
                onChange={(e) => setTargetUrl(e.target.value)} 
                placeholder="https://example.com/secret-document"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={16} /> Password Protection
              </label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter a strong password"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} /> Expiration (Minutes)
                </label>
                <input 
                  type="number" 
                  min="1"
                  className="form-control" 
                  value={expiresInMinutes} 
                  onChange={(e) => setExpiresInMinutes(e.target.value)} 
                  placeholder="Leave empty for no expiry"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--text-main)', userSelect: 'none' }}>
                  <input 
                    type="checkbox" 
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                  />
                  One-time access (burn after reading)
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', alignItems: 'center', padding: '1rem' }}>
              <Lock size={20} />
              {loading ? 'Securing Link...' : 'Create Secure Link'}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '2rem 0' }}
          >
            <div style={{ display: 'inline-flex', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Check size={40} />
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Link Secured!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Share this link and the password with your intended audience.</p>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--primary)', wordBreak: 'break-all', textAlign: 'left', fontWeight: '500' }}>
                {shortLink}
              </span>
              <button 
                onClick={handleCopy}
                className="btn btn-secondary" 
                style={{ marginLeft: '1rem', minWidth: '120px', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
              >
                {copied ? <><Check size={18} /> Copied</> : <><Copy size={18} /> Copy URL</>}
              </button>
            </div>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '2rem' }}>
              <QRCodeSVG value={shortLink} size={150} level="H" />
            </div>

            <div>
              <button 
                onClick={() => {
                  setResultToken('');
                  setTargetUrl('');
                  setPassword('');
                }}
                className="btn btn-secondary"
              >
                Create Another Link
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SecureRedirectCreate;
