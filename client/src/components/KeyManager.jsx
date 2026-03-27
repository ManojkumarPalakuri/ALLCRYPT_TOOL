import React from 'react';
import api from '../api';
import { Key } from 'lucide-react';

const KeyManager = ({ globalKey, setGlobalKey }) => {
  const generateKey = async () => {
    try {
      const { data } = await api.get('/crypto/generate-key');
      setGlobalKey(data.key);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1rem', borderRadius: '14px', color: 'var(--primary)' }}>
        <Key size={32} />
      </div>
      <div style={{ flex: '1 1 300px' }}>
        <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Master AES Key <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Required</span>
        </h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="input-field" 
            style={{ fontFamily: 'monospace', letterSpacing: '1px' }} 
            placeholder="Enter 32-byte HEX key or click generate"
            value={globalKey}
            onChange={(e) => setGlobalKey(e.target.value)}
          />
          <button onClick={generateKey} className="btn btn-secondary" style={{ flexShrink: 0 }}>
            Generate Secure Key
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Key operates purely on your session and is <strong>never</strong> permanently stored on our servers. Keep it safe.
        </p>
      </div>
    </div>
  );
};

export default KeyManager;
