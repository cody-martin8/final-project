import React from 'react';
import AppContext from '../lib/app-context';

export default class PatientTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('/api/patients', {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patients => this.setState({ patients, isLoading: false }));
  }

  render() {

    if (this.state.isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-5 offset-load-container">
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      );
    }

    if (!this.state.patients[0]) {
      return (
        <div className="row justify-content-center align-items-center mt-4">
          <div className="card col-12 col-md-9 col-lg-8 lead d-flex justify-content-center" style={{ backgroundColor: 'rgb(226, 226, 226)' }}>
            <div className="card-body">
              No patient profiles have been created on your account yet. You can create patient profiles by clicking &quot;New Patient&quot; above.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="col-9 col-md-4 col-lg-3">Patient Name</th>
                <th className="d-none d-md-table-cell col-lg-5">Injury / Ailment</th>
                <th className="col-auto ps-2">Status</th>
                <th className="d-none d-lg-table-cell" style={{ width: '9rem' }}>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.patients.map(patient => (
                  <tr key={patient.patientId}>
                    <Patient patient={patient} handleClick={this.handleClick} />
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class Patient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patientId: null,
      firstName: '',
      lastName: '',
      injuryAilment: '',
      isActive: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { patientId, firstName, lastName, injuryAilment, isActive } = this.props.patient;
    let isActiveBoolean = false;
    if (isActive === 'true' || isActive === true) {
      isActiveBoolean = true;
    }
    this.setState({
      patientId,
      firstName,
      lastName,
      injuryAilment,
      isActive: isActiveBoolean
    });
  }

  handleClick() {
    this.setState({ isActive: !this.state.isActive });
    const isActive = this.state.isActive !== true;
    const patient = {
      isActive
    };
    fetch(`/api/patients/markInactive/${this.state.patientId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'PATCH',
      body: JSON.stringify(patient)
    })
      .then(res => {
        location.hash = '#';
      });
  }

  render() {

    const { patientId, firstName, lastName, injuryAilment, isActive } = this.state;
    const name = `${firstName} ${lastName}`;
    let statusColor, isActiveStatus;
    if (isActive === true) {
      statusColor = '#86DEB7';
      isActiveStatus = 'Active';
    } else {
      statusColor = '#D78521';
      isActiveStatus = 'Inactive';
    }

    return (
      <>
        <td><p className="my-2 h6"><a href={`#patientProfile?patientId=${patientId}`} className="text-decoration-none patient-name-button">{name}</a></p></td>
        <td className="d-none d-sm-none d-md-table-cell"><p className="my-2">{ injuryAilment }</p></td>
        <td><span className="badge rounded-pill mt-2" style={{ backgroundColor: statusColor }}>{isActiveStatus}</span></td>
        <td className="d-none d-lg-table-cell"><button className="btn btn-outline-danger ms-4 mt-1" onClick={this.handleClick}><i className="fa-solid fa-check-to-slot"></i></button></td>
      </>
    );
  }
}
PatientTable.contextType = AppContext;
Patient.contextType = AppContext;
