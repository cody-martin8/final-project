import React from 'react';

export default function Navbar(props) {
  return (
    <header className="mb-4">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <div className="col px-0">
            {/* this anchor should go back to the catalog at '#' */}
            <a href="#" className="navbar-brand">
              <i className="" /> Physical Therapy
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
