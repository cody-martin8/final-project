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
              <th className="col-9 col-md-4 col-lg-3">Patient Name</th>
              <th className="d-none d-sm-none d-md-table-cell col-lg-5">Injury / Ailment</th>
              <th className="col-auto ps-2">Status</th>
              <th className="d-none d-lg-table-cell" style={{ width: '9rem' }}>Mark as Inactive</th>
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
  const { patientId, firstName, lastName, injuryAilment, isActive } = props.patient;
  const name = `${firstName} ${lastName}`;
  let statusColor, isActiveStatus;
  if (isActive === 'true') {
    statusColor = '#86DEB7';
    isActiveStatus = 'Active';
  } else {
    statusColor = '#D78521';
    isActiveStatus = 'Inactive';
  }

  return (
    <>
      <td><a href={`#patientProfile?patientId=${patientId}`} className="text-decoration-none" style={{ color: 'black' }}><p className="my-2 h6">{name}</p></a></td>
      <td className="d-none d-sm-none d-md-table-cell"><p className="my-2">{ injuryAilment }</p></td>
      <td><span className="badge rounded-pill mt-2" style={{ backgroundColor: statusColor }}>{isActiveStatus}</span></td>
      <td className="d-none d-lg-table-cell"><i className="fa-solid fa-check-to-slot ms-5 mt-2"></i></td>
    </>
  );
}
