import React from 'react';
import Navbar from './components/Navbar';
import CryptoTool from './components/CryptoTool';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <CryptoTool />
      </div>
    </div>
  );
}

export default App;
