import React, { useState } from 'react';
import api from '../api';
import { Lock, Unlock, Key, Copy, Check, RefreshCw, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const CryptoTool = () => {
  const [mode, setMode] = useState('encrypt');
  const [algorithm, setAlgorithm] = useState('AES-256');
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const algorithms = ['AES-256', 'AES-192', 'AES-128', 'DES'];

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let pass = '';
    for (let i = 0; i < 16; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = async () => {
    if (!text || !password) return setError('Please enter both text and a secure key/password.');
    setError('');
    setResult('');
    setLoading(true);
    try {
      const endpoint = mode === 'encrypt' ? '/crypto/encrypt' : '/crypto/decrypt';
      const payload = mode === 'encrypt' ? { text, password, algorithm } : { encryptedText: text, password, algorithm };
      
      const { data } = await api.post(endpoint, payload);
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>
          Open <span className="text-gradient">Encryption</span> Utility
        </motion.h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Securely encrypt your text using industry standard algorithms. Generate a key, encrypt your message, and share it securely without any accounts or logins.
        </p>
      </div>

      <motion.div className="glass-panel" style={{ padding: '2.5rem' }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        {/* Top Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="input-label">Operation Mode</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => {setMode('encrypt'); setResult('');}} className={`btn ${mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}><Lock size={16}/> Encrypt</button>
              <button onClick={() => {setMode('decrypt'); setResult('');}} className={`btn ${mode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}><Unlock size={16}/> Decrypt</button>
            </div>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label className="input-label">Algorithm</label>
            <select className="input-field" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} style={{ padding: '0.875rem' }}>
              {algorithms.map(alg => <option key={alg} value={alg}>{alg}</option>)}
            </select>
          </div>

          <div style={{ flex: '2 1 300px' }}>
            <label className="input-label">Secret Key / Password</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem', fontFamily: 'monospace', letterSpacing: '1px' }} 
                  placeholder="Enter or generate a key..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button onClick={generatePassword} className="btn btn-secondary" title="Generate Random Key"><RefreshCw size={18}/></button>
            </div>
          </div>
        </div>

        {error && <div className="badge badge-error" style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert size={18}/> {error}</div>}

        {/* Text Areas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
          <div>
            <label className="input-label" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
              {mode === 'encrypt' ? 'Enter Plain Text to Encrypt' : 'Paste Encrypted Ciphertext'}
            </label>
            <textarea 
              className="input-field" 
              rows="12" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={mode === 'encrypt' ? 'Type your secret message here...' : 'Format should be IV:Ciphertext...'}
              style={{ resize: 'vertical', fontSize: '1rem', lineHeight: '1.5' }}
            ></textarea>
            
            <button onClick={handleProcess} disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.125rem' }}>
              {loading ? 'Processing...' : mode === 'encrypt' ? 'Auto-Encrypt Data' : 'Decrypt Message'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="input-label" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Output Terminal</label>
            <div 
              className="input-field" 
              style={{ 
                flexGrow: 1,
                minHeight: '16.5rem', 
                wordBreak: 'break-all', 
                backgroundColor: 'rgba(0,0,0,0.4)', 
                position: 'relative',
                padding: '1.25rem',
                fontSize: '1rem',
                fontFamily: 'monospace',
                lineHeight: '1.5'
              }}
            >
              {result ? (
                <>
                  <div style={{ paddingBottom: '3rem', color: mode === 'encrypt' ? '#60a5fa' : 'var(--text-main)' }}>{result}</div>
                  <button 
                    onClick={() => handleCopy(result)} 
                    className="btn btn-secondary" 
                    style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.5rem 1rem' }}
                  >
                    {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />} Copy output
                  </button>
                </>
              ) : <span style={{ color: 'var(--text-muted)' }}>Conversion output will appear here...</span>}
            </div>
            {result && mode === 'encrypt' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  <ShieldAlert size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }}/>
                  To decrypt this message, share the cipher text and this key with the recipient: 
                  <strong style={{ color: '#60a5fa', marginLeft: '0.5rem', fontFamily: 'monospace', letterSpacing: '1px' }}>{password}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default CryptoTool;
