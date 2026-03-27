import React from 'react';
import { Shield } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand">
          <Shield style={{ color: 'var(--primary)' }} size={28} />
          <span>ALLCRYPT</span>
        </div>
        <nav className="navbar-nav">
          <a href="#" className="btn btn-secondary" onClick={(e) => e.preventDefault()}>About</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
