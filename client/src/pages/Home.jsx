import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, FileKey } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="animate-fade" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
          Secure Your Data with <br/><span className="text-gradient">IBM Encrypt Tool</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
          Industry-standard AES-256 encryption for your texts and files. Protect your sensitive information with a visually stunning, easy-to-use platform.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Start Encrypting Now
          </Link>
          <a href="#features" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Learn More
          </a>
        </div>
      </motion.div>

      <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem', textAlign: 'left' }}>
        <motion.div className="glass-panel" style={{ padding: '2rem' }} whileHover={{ y: -5 }}>
          <ShieldAlert size={48} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Military-Grade Security</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>Utilizing AES-256-CBC algorithm to ensure your data remains completely impenetrable to unauthorized access.</p>
        </motion.div>
        
        <motion.div className="glass-panel" style={{ padding: '2rem' }} whileHover={{ y: -5 }}>
          <Lock size={48} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Text Encryption</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>Securely encrypt passwords, notes, and private messages instantly before sharing them on insecure channels.</p>
        </motion.div>
        
        <motion.div className="glass-panel" style={{ padding: '2rem' }} whileHover={{ y: -5 }}>
          <FileKey size={48} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>File Security</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>Upload any file and securely encrypt it. Download the encrypted version instantly—no data is retained on our servers.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
