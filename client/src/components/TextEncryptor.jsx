import React, { useState } from 'react';
import api from '../api';
import { Lock, Unlock, Copy, Check } from 'lucide-react';

const TextEncryptor = ({ globalKey }) => {
  const [mode, setMode] = useState('encrypt');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [iv, setIv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = async () => {
    if (!globalKey) return setError('Master key is required. Please generate or enter one above.');
    setError('');
    setLoading(true);
    try {
      if (mode === 'encrypt') {
        const { data } = await api.post('/crypto/encrypt-text', { text: input, key: globalKey });
        setOutput(data.encryptedData);
        setIv(data.iv);
      } else {
        if (!iv) return setError('IV is required for decryption.');
        const { data } = await api.post('/crypto/decrypt-text', { encryptedData: input, key: globalKey, iv });
        setOutput(data.decryptedText);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Text Encryption Toolkit</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem' }}>
        <button onClick={() => {setMode('encrypt'); setOutput(''); setIv('');}} className={`btn ${mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`}><Lock size={16}/> Encrypt</button>
        <button onClick={() => {setMode('decrypt'); setOutput(''); setIv('');}} className={`btn ${mode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}`}><Unlock size={16}/> Decrypt</button>
      </div>

      {error && <div className="badge badge-error" style={{ padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '8px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div>
          <label className="input-label">{mode === 'encrypt' ? 'Plain Text Input' : 'Ciphertext (HEX)'}</label>
          <textarea 
            className="input-field" 
            rows="8" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Type your secret message here...' : 'Paste encrypted hex string...'}
            style={{ resize: 'vertical' }}
          ></textarea>
          
          {mode === 'decrypt' && (
            <div className="input-group" style={{ marginTop: '1.5rem' }}>
              <label className="input-label">Initialization Vector (IV HEX)</label>
              <input type="text" className="input-field" value={iv} onChange={(e) => setIv(e.target.value)} placeholder="Paste IV here..." />
            </div>
          )}
          
          <button onClick={handleProcess} disabled={loading || !input} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>
            {loading ? 'Processing cipher...' : mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
          </button>
        </div>

        <div>
          <label className="input-label">Output Result</label>
          <div className="input-field" style={{ minHeight: '12rem', wordBreak: 'break-all', backgroundColor: 'rgba(0,0,0,0.3)', position: 'relative' }}>
            {output ? (
              <>
                <div style={{ paddingBottom: '2rem' }}>{output}</div>
                <button 
                  onClick={() => handleCopy(output)} 
                  className="btn btn-secondary" 
                  style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />} Copy
                </button>
              </>
            ) : <span style={{ color: 'var(--text-muted)' }}>Result will be displayed here...</span>}
          </div>
          
          {mode === 'encrypt' && iv && (
            <div style={{ marginTop: '1.5rem' }}>
              <label className="input-label">Generated Initialization Vector (IV)</label>
              <div className="input-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', letterSpacing: '1px' }}>{iv}</span>
                <button onClick={() => handleCopy(iv)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }} title="Copy IV">
                  {copied ? <Check size={18} className="text-success" /> : <Copy size={18}/>}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Save this IV! You will need both the Master Key and IV to decrypt this message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEncryptor;
