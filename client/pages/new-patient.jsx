import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

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
      isActive: true,
      emailSignUp: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addPatient = this.addPatient.bind(this);
  }

  componentDidMount() {
    fetch('/api/patients', {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patients => {
        this.setState({ patients });
      });
    if (this.props.patientId !== null) {
      fetch(`/api/patients/${this.props.patientId}`, {
        headers: {
          'X-Access-Token': this.context.token
        }
      })
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
    } else if (event.target.id === 'emailSignUp') {
      this.setState({
        emailSignUp: !this.state.emailSignUp
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
      this.addPatient(patient);
    } else {
      patient.isActive = this.state.isActive;
      patient.patientId = this.props.patientId;
      this.editPatient(patient);
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

  addPatient(patient) {
    fetch('/api/patients', {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'POST',
      body: JSON.stringify(patient)
    })
      .then(res => {
        location.hash = '#';
      });

    const patientEmail = {
      patientEmail: patient.patientEmail
    };
    fetch('/api/patient-sign-up', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(patientEmail)
    });
  }

  editPatient(patient) {
    fetch(`/api/patients/${patient.patientId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'PATCH',
      body: JSON.stringify(patient)
    })
      .then(res => {
        location.hash = `#patientProfile?patientId=${patient.patientId}`;
      });

    const patientEmail = {
      patientEmail: patient.patientEmail
    };
    if (this.state.emailSignUp === true) {
      fetch('/api/patient-sign-up', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(patientEmail)
      });
    }
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const emailArray = [];
    for (let i = 0; i < this.state.patients.length; i++) {
      emailArray.push(this.state.patients[i].email);
    }

    let formHeader, existingPatient, isTaken;
    if (this.props.patientId === null) {
      isTaken = emailArray.includes(this.state.patientEmail);
      formHeader = 'New Patient';
      existingPatient = 'd-none';
    } else {
      formHeader = 'Edit Patient';
      existingPatient = 'form-check form-switch mb-4';
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
              <input type="number" required className="form-control" id="age" min="1" max="130" value={this.state.age} onChange={this.handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="injuryAilment" className="form-label">Injury / Ailment</label>
              <input type="text" required className="form-control" id="injuryAilment" value={this.state.injuryAilment} onChange={this.handleChange} />
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea type="textarea" className="form-control" id="notes" rows="3" value={this.state.notes} onChange={this.handleChange} />
            </div>
            <div className={existingPatient}>
              <label className="form-check-label" htmlFor="isActive">Is this patient no longer active?</label>
              <input className="form-check-input" type="checkbox" role="switch" id="isActive" onChange={this.handleChange} />
            </div>
            <div className={existingPatient}>
              <label className="form-check-label" htmlFor="isActive">Send Patient Account Sign-Up Email?</label>
              <input className="form-check-input" type="checkbox" role="switch" id="emailSignUp" onChange={this.handleChange} />
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
NewPatientForm.contextType = AppContext;
