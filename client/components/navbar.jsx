import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;

    return (
      <header className="mb-3">
        <nav className="navbar navbar-dark py-3" style={{ backgroundColor: '#5a7d7c' }}>
          <div className="container mx-2">
            <div className="col px-0 d-flex justify-content-between">
              <div>
                <a href="#menu" className="me-5" data-bs-toggle="offcanvas">
                  <i className="fa-solid fa-bars fa-2xl" style={{ color: '#FFC857' }} />
                </a>
                <div className="offcanvas offcanvas-start" id="menu">
                  <div className="offcanvas-header">
                    <h3 className="offcanvas-title" id="menuTitle">Menu</h3>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
                  </div>
                  <div className="offcanvas-body">
                    {user === null &&
                      <>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={() => { location.href = '#sign-in'; }}>Sign In</button>
                        </div>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={() => { location.href = '#sign-up'; }}>Sign Up</button>
                        </div>
                      </>
                    }
                    {(user !== null && user.accountType === 'therapist') &&
                      <>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={() => { location.href = '#'; }}>Patients</button>
                        </div>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={() => { location.href = '#newPatient'; }}>New Patient</button>
                        </div>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={() => { location.href = '#exercises'; }}>Exercises</button>
                        </div>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={() => { location.href = '#newExercise'; }}>New Exercise</button>
                        </div>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={handleSignOut}>Sign Out</button>
                        </div>
                      </>
                    }
                    {(user !== null && user.accountType === 'patient') &&
                      <>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={() => { location.href = '#'; }}>My Exercises</button>
                        </div>
                        <div className="mb-3">
                          <button className="lead border-0 bg-white" data-bs-dismiss="offcanvas" onClick={handleSignOut}>Sign Out</button>
                        </div>
                      </>
                    }
                  </div>
                </div>
                <a href="#" className="navbar-brand">
                  <i className="fa-solid fa-person-walking" style={{ color: '#FFC857' }} /> PT Connection
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}
Navbar.contextType = AppContext;
