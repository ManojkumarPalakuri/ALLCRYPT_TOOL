import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CryptoTool from './components/CryptoTool';
import SecureRedirectCreate from './components/SecureRedirectCreate';
import SecureRedirectAccess from './components/SecureRedirectAccess';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Routes>
          <Route path="/" element={<CryptoTool />} />
          <Route path="/redirect-tool" element={<SecureRedirectCreate />} />
          <Route path="/s/:token" element={<SecureRedirectAccess />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
