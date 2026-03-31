import React, { useState, useEffect } from 'react';
import { Shield, X, Info, Moon, Sun, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') setShowAbout(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-content">
          <div className="navbar-brand">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield style={{ color: 'var(--primary)' }} size={28} />
              <span>ALLCRYPT</span>
            </Link>
          </div>
          <nav className="navbar-nav" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/redirect-tool" className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.625rem 1rem', textDecoration: 'none' }}>
              <LinkIcon size={18} /> Secure URL
            </Link>
            <button className="btn btn-secondary" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', padding: '0.625rem 0.75rem', borderRadius: '50%' }} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAbout(true)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.625rem 1rem' }}>
              <Info size={18} /> About
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {showAbout && (
          <div 
            id="modal-backdrop"
            onClick={handleBackdropClick}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'var(--modal-bg)', 
              backdropFilter: 'blur(8px)', 
              zIndex: 100, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '1rem' 
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel"
              style={{ padding: '2.5rem', maxWidth: '650px', width: '100%', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}
            >
              <button 
                onClick={() => setShowAbout(false)} 
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '50%', padding: '0.5rem', display: 'flex' }}
                title="Close"
              >
                <X size={20} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--primary)' }}>
                <Shield size={36} />
                <h2 style={{ margin: 0, fontSize: '2rem' }}>About ALLCRYPT</h2>
              </div>
              
              <div style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                  <strong>ALLCRYPT</strong> is a secure, open-access cryptographic utility designed to protect your sensitive information using military-grade mathematical algorithms. It was developed to ensure seamless and password-based text encryption without the friction of user accounts.
                </p>

                <h4 style={{ color: '#60a5fa', marginBottom: '1rem', marginTop: '2rem', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>How It Works</h4>
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.5rem' }}>
                  <li><strong style={{ color: 'var(--text-main)' }}>1. Input Data:</strong> Paste or type any plain text you wish to conceal.</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>2. Select Algorithm:</strong> Choose between robust algorithms like AES-256 or AES-128.</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>3. Secure Key:</strong> Type a memorable password or auto-generate a random 16-character key.</li>
                  <li><strong style={{ color: 'var(--text-main)' }}>4. Encrypt & Share:</strong> Share the generated ciphertext block and the exact key with your recipient. Without both factors (Key + Ciphertext), the message remains mathematically impossible to read.</li>
                </ul>

                <h4 style={{ color: '#60a5fa', marginBottom: '1rem', marginTop: '2.5rem', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Core Features</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀</div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem', fontSize: '1rem' }}>Frictionless Access</strong>
                    No logins required. Open the site and instantly encrypt data.
                  </div>
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem', fontSize: '1rem' }}>AES-256 Default</strong>
                    Features the industry maximum security standard for data at rest.
                  </div>
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💻</div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem', fontSize: '1rem' }}>scrypt Key Derivation</strong>
                    Passwords are safely hashed into exact cryptographic byte-length streams automatically.
                  </div>
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎨</div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem', fontSize: '1rem' }}>Premium UX</strong>
                    High-end glassmorphism design with responsive elements and smooth animations.
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={() => setShowAbout(false)} style={{ padding: '0.75rem 2.5rem' }}>
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
