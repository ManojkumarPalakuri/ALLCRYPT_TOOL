import React, { useState, useRef } from 'react';
import api from '../api';
import { Lock, Unlock, UploadCloud, File as FileIcon, Check } from 'lucide-react';

const FileEncryptor = ({ globalKey }) => {
  const [mode, setMode] = useState('encrypt');
  const [file, setFile] = useState(null);
  const [iv, setIv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearForm = () => {
    setFile(null);
    setIv('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleProcess = async () => {
    if (!globalKey) return setError('Master key is required.');
    if (!file) return setError('Please select a file.');
    if (mode === 'decrypt' && !iv) return setError('IV is required for decryption.');

    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', globalKey);
    if (mode === 'decrypt') formData.append('iv', iv);

    try {
      const endpoint = mode === 'encrypt' ? '/crypto/encrypt-file' : '/crypto/decrypt-file';
      const response = await api.post(endpoint, formData, {
        responseType: 'blob', // Important for downloading files
      });

      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Determine filename
      let fileName = 'downloaded-file';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) { 
          fileName = matches[1].replace(/['"]/g, '');
        }
      } else {
        fileName = mode === 'encrypt' ? `${file.name}.enc` : file.name.replace('.enc', '') || 'decrypted_file';
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up memory

      // Show IV if encrypting
      if (mode === 'encrypt') {
        const returnedIv = response.headers['x-encryption-iv'];
        if (returnedIv) {
          setSuccess(`File encrypted successfully! Your Initialization Vector (IV) is: ${returnedIv}. Please save this IV to decrypt the file later.`);
        } else {
          setSuccess('File encrypted successfully, but IV could not be retrieved from headers.');
        }
      } else {
        setSuccess('File decrypted successfully!');
      }

      clearForm();
    } catch (err) {
      if (err.response && err.response.data instanceof Blob) {
        // Blob to JSON parsing if server sent an error message instead of file
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          setError(json.message || 'Operation failed');
        } catch(e) {
          setError('Operation failed');
        }
      } else {
        setError('Operation failed due to network error or server crash.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Secure File Transmutation</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem' }}>
        <button onClick={() => {setMode('encrypt'); clearForm();}} className={`btn ${mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`}><Lock size={16}/> Encrypt</button>
        <button onClick={() => {setMode('decrypt'); clearForm();}} className={`btn ${mode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}`}><Unlock size={16}/> Decrypt</button>
      </div>

      {error && <div className="badge badge-error" style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>}
      {success && <div className="badge badge-success" style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', fontSize: '0.875rem', lineHeight: '1.5' }}>{success}</div>}

      <div style={{ maxWidth: '600px' }}>
        <div style={{ 
          border: '2px dashed var(--border-glass)', 
          borderRadius: '16px', 
          padding: '3rem', 
          textAlign: 'center',
          backgroundColor: file ? 'rgba(59,130,246,0.05)' : 'transparent',
          transition: 'all 0.3s ease',
          marginBottom: '2rem'
        }}>
          {file ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <FileIcon size={48} className="text-primary" />
              <div>
                <h4 style={{ margin: 0 }}>{file.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button className="btn btn-secondary" onClick={() => clearForm()} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Remove File</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <UploadCloud size={48} style={{ color: 'var(--text-muted)' }} />
              <div>
                <h4 style={{ margin: 0 }}>Select a file to {mode}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Supports all file formats up to 50MB</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()} style={{ marginTop: '1rem' }}>Browse Files</button>
            </div>
          )}
        </div>

        {mode === 'decrypt' && (
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Initialization Vector (IV HEX)</label>
            <input 
              type="text" 
              className="input-field" 
              value={iv} 
              onChange={(e) => setIv(e.target.value)} 
              placeholder="Enter IV used during encryption" 
              style={{ fontFamily: 'monospace' }}
            />
          </div>
        )}

        <button 
          onClick={handleProcess} 
          disabled={loading || !file || (mode === 'decrypt' && !iv)} 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
        >
          {loading ? 'Processing cipher stream...' : mode === 'encrypt' ? 'Encrypt & Download' : 'Decrypt & Download'}
        </button>
      </div>
    </div>
  );
};

export default FileEncryptor;
