import React from 'react';

export default class PatientTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: []
    };
  }

  componentDidMount() {
    fetch('/api/patients')
      .then(res => res.json())
      .then(patients => this.setState({ patients }));
  }

  render() {

    return (
      <div className="row justify-content-center">
        <table className="table table-striped w-75">
          <thead>
            <tr>
              <th className="col-9 col-md-6 col-lg-3">Patient Name</th>
              <th className="d-none d-sm-none d-md-table-cell col-lg-3">Exercises</th>
              <th className="col-3">Status</th>
              <th className="d-none d-lg-table-cell col-lg-3">Mark as Inactive</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.patients.map(patient => (
                <tr key={patient.patientId}>
                  <Patient patient={patient} />
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

function Patient(props) {
  const { firstName, lastName, isActive } = props.patient;
  const name = `${firstName} ${lastName}`;
  let statusColor;
  isActive ? statusColor = '#86DEB7' : statusColor = '#D78521';

  return (
    <>
      <td>{ name }</td>
      <td className="d-none d-sm-none d-md-table-cell"><i className="fa-solid fa-person-walking ms-4" style={{ transform: 'scaleX(-1)' }}></i></td>
      <td><span className="badge rounded-pill" style={{ backgroundColor: statusColor }}>Active</span></td>
      <td className="d-none d-lg-table-cell"><i className="fa-solid fa-check-to-slot ms-5"></i></td>
    </>
  );
}
