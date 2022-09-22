import React from 'react';
import PatientTable from '../components/patient-table';

export default function Home(props) {

  return (
    <div className="container w-75">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 mb-3 p-0 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <h1 className="me-3">Your Patients</h1>
            <i className="fa-solid fa-users fa-2xl mb-2"></i>
          </div>
          <a href="#newPatient" className="btn mb-3" style={{ backgroundColor: '#282A3E', color: 'white' }}>New Patient</a>
        </div>
      </div>
      <PatientTable />
    </div>
  );
}
