import React, { useState } from 'react';
import { FileText, File, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import KeyManager from '../components/KeyManager';
import TextEncryptor from '../components/TextEncryptor';
import FileEncryptor from '../components/FileEncryptor';
import HistoryLog from '../components/HistoryLog';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [globalKey, setGlobalKey] = useState('');

  const renderContent = () => {
    switch(activeTab) {
      case 'text': return <TextEncryptor globalKey={globalKey} />;
      case 'file': return <FileEncryptor globalKey={globalKey} />;
      case 'history': return <HistoryLog />;
      default: return null;
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 250px) 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <motion.div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '100px' }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--primary)' }}>
            <ShieldCheck size={32} />
            <h3 style={{ margin: 0 }}>Dashboard</h3>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => setActiveTab('text')} className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
              <FileText size={18} /> Text Encryption
            </button>
            <button onClick={() => setActiveTab('file')} className={`btn ${activeTab === 'file' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
              <File size={18} /> File Encryption
            </button>
            <button onClick={() => setActiveTab('history')} className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
              <Clock size={18} /> Activity Logs
            </button>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
          <KeyManager globalKey={globalKey} setGlobalKey={setGlobalKey} />
          
          <motion.div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }} 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
