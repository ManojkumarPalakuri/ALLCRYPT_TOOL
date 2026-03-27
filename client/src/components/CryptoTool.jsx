import React, { useState, useRef } from 'react';
import api from '../api';
import { Lock, Unlock, Key, Copy, Check, RefreshCw, ShieldAlert, FileText, UploadCloud, DownloadCloud, FormInput } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const CryptoTool = () => {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
  const [mode, setMode] = useState('encrypt');
  const [algorithm, setAlgorithm] = useState('AES-256');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Text State
  const [text, setText] = useState('');
  const [textResult, setTextResult] = useState('');
  const [copied, setCopied] = useState(false);

  // File State
  const [file, setFile] = useState(null);
  const [fileIv, setFileIv] = useState('');
  const [fileSuccess, setFileSuccess] = useState('');
  const fileInputRef = useRef(null);

  const algorithms = ['AES-256', 'AES-192', 'AES-128'];

  // Key Strength Meter Logic
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { label: '', color: 'transparent', width: '0%' };
    if (pass.length > 7) score++;
    if (pass.length >= 14) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score <= 2) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (score <= 4) return { label: 'Good', color: '#f59e0b', width: '66%' };
    return { label: 'Uncrackable 🔒', color: '#10b981', width: '100%' };
  };

  const strength = getPasswordStrength(password);

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

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    const link = document.createElement("a");
    link.download = "allcrypt_secure_qr.svg";
    link.href = url;
    link.click();
  };

  const handleTextProcess = async () => {
    if (!text || !password) return setError('Please enter both text and a secure key/password.');
    setError('');
    setTextResult('');
    setLoading(true);
    try {
      const endpoint = mode === 'encrypt' ? '/crypto/encrypt' : '/crypto/decrypt';
      const payload = mode === 'encrypt' ? { text, password, algorithm } : { encryptedText: text, password, algorithm };
      
      const { data } = await api.post(endpoint, payload);
      setTextResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileProcess = async () => {
    if (!password) return setError('Master password is required.');
    if (!file) return setError('Please select a file.');
    if (mode === 'decrypt' && !fileIv) return setError('IV is required to decrypt this file.');

    setError('');
    setFileSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('algorithm', algorithm);
    if (mode === 'decrypt') formData.append('iv', fileIv);

    try {
      const endpoint = mode === 'encrypt' ? '/crypto/encrypt-file' : '/crypto/decrypt-file';
      const response = await api.post(endpoint, formData, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      let fileName = mode === 'encrypt' ? `${file.name}.enc` : file.name.replace('.enc', '') || 'decrypted_file';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) fileName = matches[1].replace(/['"]/g, '');
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      if (mode === 'encrypt') {
        const returnedIv = response.headers['x-encryption-iv'];
        if (returnedIv) {
          setFileSuccess(`File encrypted! Automatically downloaded. Your Security IV is: ${returnedIv}. Save this IV to decrypt later.`);
        } else {
          setFileSuccess('File correctly encrypted & downloaded!');
        }
      } else {
        setFileSuccess('File decrypted successfully!');
      }

      setFile(null);
      setFileIv('');
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      setError('Operation failed. Check your password, IV, and algorithm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
          Open <span className="text-gradient">Encryption</span> Utility
        </motion.h1>
      </div>

      <motion.div className="glass-panel" style={{ padding: '2.5rem' }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button onClick={() => setActiveTab('text')} className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.75rem 2rem' }}>
            <FormInput size={18} /> Text Encryption
          </button>
          <button onClick={() => setActiveTab('file')} className={`btn ${activeTab === 'file' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.75rem 2rem' }}>
            <FileText size={18} /> File Encryption
          </button>
        </div>

        {/* Global Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="input-label">Operation Mode</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => {setMode('encrypt'); setTextResult(''); setFileSuccess('');}} className={`btn ${mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}><Lock size={16}/> Encrypt</button>
              <button onClick={() => {setMode('decrypt'); setTextResult(''); setFileSuccess('');}} className={`btn ${mode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}><Unlock size={16}/> Decrypt</button>
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
            {/* Strength Meter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ flex: 1, height: '4px', background: 'rgba(100,116,139,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: 'all 0.3s ease' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: strength.color, minWidth: '80px', textAlign: 'right' }}>{strength.label}</span>
            </div>
          </div>
        </div>

        {error && <div className="badge badge-error" style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert size={18}/> {error}</div>}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'text' ? (
            <motion.div key="text" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
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
                  
                  <button onClick={handleTextProcess} disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.125rem' }}>
                    {loading ? 'Processing...' : mode === 'encrypt' ? 'Auto-Encrypt Text' : 'Decrypt Message'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="input-label" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Output Terminal</label>
                  <div className="input-field" style={{ flexGrow: 1, minHeight: '16.5rem', wordBreak: 'break-all', backgroundColor: 'var(--terminal-bg)', position: 'relative', padding: '1.25rem', fontSize: '1rem', fontFamily: 'monospace', lineHeight: '1.5' }}>
                    {textResult ? (
                      <>
                        <div style={{ paddingBottom: '3rem', color: mode === 'encrypt' ? 'var(--primary)' : 'var(--text-main)' }}>{textResult}</div>
                        <button 
                          onClick={() => handleCopy(textResult)} 
                          className="btn btn-secondary" 
                          style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.5rem 1rem' }}
                        >
                          {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />} Copy
                        </button>
                      </>
                    ) : <span style={{ color: 'var(--text-muted)' }}>Conversion output will appear here...</span>}
                  </div>
                  
                  {/* QR Code Sharing */}
                  {textResult && mode === 'encrypt' && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ flex: 1, padding: '1rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                          <ShieldAlert size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }}/>
                          To decrypt, share the cipher text alongside the key: 
                          <strong style={{ color: 'var(--primary)', paddingLeft: '0.5rem', fontFamily: 'monospace' }}>{password}</strong>
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', border: '4px solid #fff' }}>
                          <QRCodeSVG value={textResult} size={64} id="qr-code-svg" />
                        </div>
                        <button onClick={downloadQRCode} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0.6rem', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}>
                          <DownloadCloud size={14} style={{ marginRight: '0.3rem' }}/> Save QR
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="file" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              {fileSuccess && <div className="badge badge-success" style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', fontSize: '1rem', lineHeight: '1.5' }}>{fileSuccess}</div>}
              
              <div style={{ 
                border: '2px dashed var(--border-glass)', 
                borderRadius: '16px', 
                padding: '3.5rem', 
                textAlign: 'center',
                backgroundColor: file ? 'var(--card-bg)' : 'transparent',
                transition: 'all 0.3s ease',
                marginBottom: '2rem'
              }}>
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <DownloadCloud size={48} className="text-primary" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{file.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setFile(null)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Remove</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <UploadCloud size={48} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.25rem' }}>Drag & Drop or Select File</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>All file formats supported. Encrypts locally via Streams.</p>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                    <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()} style={{ marginTop: '1rem' }}>Browse My Files</button>
                  </div>
                )}
              </div>

              {mode === 'decrypt' && (
                <div className="input-group" style={{ marginBottom: '2rem' }}>
                  <label className="input-label" style={{ fontSize: '1rem' }}>Original Initialization Vector (IV HEX)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={fileIv} 
                    onChange={(e) => setFileIv(e.target.value)} 
                    placeholder="Enter the 32-character IV provided during encryption..." 
                    style={{ fontFamily: 'monospace', padding: '1rem' }}
                  />
                </div>
              )}

              <button 
                onClick={handleFileProcess} 
                disabled={loading || !file || (mode === 'decrypt' && !fileIv)} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}
              >
                {loading ? 'Processing via AES Cipher Streams...' : mode === 'encrypt' ? 'Encrypt File & Download' : 'Decrypt File & Download'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default CryptoTool;
