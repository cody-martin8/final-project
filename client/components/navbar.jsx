import React from 'react';

export default function Navbar(props) {

  return (
    <header className="mb-4">
      <nav className="navbar navbar-dark py-3" style={{ backgroundColor: '#5a7d7c' }}>
        <div className="container mx-5">
          <div className="col px-0">
            <a href="#menu" className="me-5" data-bs-toggle="offcanvas">
              <i className="fa-solid fa-bars fa-2xl" style={{ color: '#FFC857' }}/>
            </a>
            <div className="offcanvas offcanvas-start" id="menu">
              <div className="offcanvas-header">
                <h3 className="offcanvas-title" id="menuTitle">Menu</h3>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
              </div>
              <div className="offcanvas-body">
                <div className="mb-3">
                  <a href="#" className="text-decoration-none">Patients</a>
                </div>
                <div className="mb-3">
                  <a href="#newPatient" className="text-decoration-none">New Patient</a>
                </div>
                <div className="mb-3">
                  <a href="#" className="text-decoration-none">Exercises</a>
                </div>
                <div className="mb-3">
                  <a href="#" className="text-decoration-none">New Exercise</a>
                </div>
              </div>
            </div>
            <a href="#" className="navbar-brand">
              <i className="fa-solid fa-person-walking" style={{ color: '#FFC857' }}/> PT Connection
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
