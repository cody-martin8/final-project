import React from 'react';

export default class NewPatientForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      firstName: '',
      lastName: '',
      patientEmail: '',
      age: '',
      injuryAilment: '',
      notes: '',
      isActive: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/patients')
      .then(res => res.json())
      .then(patients => {
        this.setState({ patients });
      });
    if (this.props.patientId !== null) {
      fetch(`/api/patients/${this.props.patientId}`)
        .then(res => res.json())
        .then(editPatient => {
          this.setState({
            firstName: editPatient.firstName,
            lastName: editPatient.lastName,
            patientEmail: editPatient.email,
            age: editPatient.age,
            injuryAilment: editPatient.injuryAilment,
            notes: editPatient.notes
          });
        });
    }
  }

  handleChange(event) {
    if (event.target.id === 'isActive') {
      this.setState({
        isActive: !this.state.isActive
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const patient = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      patientEmail: this.state.patientEmail,
      age: this.state.age,
      injuryAilment: this.state.injuryAilment,
      notes: this.state.notes
    };
    if (this.props.patientId === null) {
      this.props.newPatient(patient);
    } else {
      patient.isActive = this.state.isActive;
      patient.patientId = this.props.patientId;
      this.props.editPatient(patient);
    }
    this.setState({
      firstName: '',
      lastName: '',
      patientEmail: '',
      age: '',
      injuryAilment: '',
      notes: '',
      isActive: true
    });
  }

  render() {

    const emailArray = [];
    for (let i = 0; i < this.state.patients.length; i++) {
      emailArray.push(this.state.patients[i].email);
    }

    let formHeader, isActiveSwitch, isTaken;
    if (this.props.patientId === null) {
      isTaken = emailArray.includes(this.state.patientEmail);
      formHeader = 'New Patient';
      isActiveSwitch = 'd-none';
    } else {
      formHeader = 'Edit Patient';
      isActiveSwitch = 'form-check form-switch mb-4';
    }

    let emailExists;
    isTaken ? emailExists = 'alert alert-danger mb-3' : emailExists = 'd-none';

    return (
      <div className="container w-75">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 mb-3">
            <div className="d-flex align-items-center">
              <h1 className="me-3">{formHeader}</h1>
              <i className="fa-solid fa-user-plus fa-2xl mb-2"></i>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <form className="col-10 col-lg-6" onSubmit={this.handleSubmit}>
            <div className={emailExists}>A patient profile with this email already exists</div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input type="text" required className="form-control" id="firstName" value={this.state.firstName} onChange={this.handleChange}/>
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input type="text" required className="form-control" id="lastName" value={this.state.lastName} onChange={this.handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="patientEmail" className="form-label">Email Address</label>
              <input type="email" required className="form-control" id="patientEmail" value={this.state.patientEmail} onChange={this.handleChange} />
            </div>
            <div className="col-3 col-lg-2 mb-3">
              <label htmlFor="age" className="form-label">Age</label>
              <input type="number" required className="form-control" id="age" min="1" value={this.state.age} onChange={this.handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="injuryAilment" className="form-label">Injury / Ailment</label>
              <input type="text" required className="form-control" id="injuryAilment" value={this.state.injuryAilment} onChange={this.handleChange} />
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea type="textarea" className="form-control" id="notes" rows="3" value={this.state.notes} onChange={this.handleChange} />
            </div>
            <div className={isActiveSwitch}>
              <label className="form-check-label" htmlFor="isActive">Is this patient no longer active?</label>
              <input className="form-check-input" type="checkbox" role="switch" id="isActive" value={this.state.isActive} onChange={this.handleChange} />
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <a href="#" className="btn btn-secondary">Cancel</a>
              </div>
              <div>
                <button type="submit" className="btn" style={{ backgroundColor: '#D78521', color: 'white' }}>Save Profile</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
