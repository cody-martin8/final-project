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
      emailSignUp: false,
      isLoading: true,
      networkError: false
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
        this.setState({ patients, isLoading: false });
      })
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
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
        })
        .catch(error => {
          if (error) {
            this.setState({
              networkError: true
            });
          }
        });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === 'isActive') {
      this.setState({
        isActive: !this.state.isActive
      });
    } else if (name === 'emailSignUp') {
      this.setState({
        emailSignUp: !this.state.emailSignUp
      });
    } else {
      this.setState({ [name]: value });
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
    this.setState({ isLoading: true });
    fetch('/api/patients', {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'POST',
      body: JSON.stringify(patient)
    })
      .then(res => res.json())
      .then(patient => {
        this.setState({ isLoading: false });
        location.hash = '#';
        const name = `${patient.firstName} ${patient.lastName}`;
        const patientEmailDetails = {
          patientName: name,
          patientEmail: patient.email,
          patientId: patient.patientId
        };
        fetch('/api/patient-sign-up', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(patientEmailDetails)
        });
      })
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });
  }

  editPatient(patient) {
    this.setState({ isLoading: true });
    fetch(`/api/patients/${patient.patientId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'PATCH',
      body: JSON.stringify(patient)
    })
      .then(res => {
        this.setState({ isLoading: false });
        location.hash = `#patientProfile?patientId=${patient.patientId}`;
      })
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });

    const patientEmailDetails = {
      patientEmail: patient.patientEmail,
      patientId: patient.patientId
    };
    if (this.state.emailSignUp === true) {
      fetch('/api/patient-sign-up', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(patientEmailDetails)
      });
    }
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const { patients, firstName, lastName, patientEmail, age, injuryAilment, notes, isLoading, networkError } = this.state;

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-5 load-container">
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      );
    }

    if (networkError) {
      return (
        <div className="d-flex justify-content-center mt-5 px-4">
          <div className="card mt-3">
            <div className="card-header">
              Error
            </div>
            <div className="card-body">
              <h5 className="card-title">Network Error</h5>
              <p className="card-text">It looks like there was an error connecting to the network. Please check your internet connection and try again.</p>
            </div>
          </div>
        </div>
      );
    }

    const emailArray = [];
    for (let i = 0; i < patients.length; i++) {
      emailArray.push(patients[i].email);
    }

    let formHeader, existingPatient, isTaken;
    if (this.props.patientId === null) {
      isTaken = emailArray.includes(patientEmail);
      formHeader = 'New Patient';
      existingPatient = 'd-none';
    } else {
      formHeader = 'Edit Patient';
      existingPatient = 'form-check form-switch mb-4';
    }

    let emailExists;
    isTaken ? emailExists = 'alert alert-danger mb-3' : emailExists = 'd-none';

    return (
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 mb-3">
            <div className="d-flex align-items-center">
              <h1 className="me-3">{formHeader}</h1>
              <i className="fa-solid fa-user-plus fa-2xl mb-2"></i>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <form className="col-12 col-md-10 col-lg-6" onSubmit={this.handleSubmit}>
            <div className={emailExists}>A patient profile with this email already exists</div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                required
                id="firstName"
                type="text"
                name="firstName"
                value={firstName}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                required
                id="lastName"
                type="text"
                name="lastName"
                value={lastName}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="patientEmail" className="form-label">Email Address</label>
              <input
                required
                id="patientEmail"
                type="email"
                name="patientEmail"
                value={patientEmail}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col-3 col-lg-2 mb-3">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                required
                id="age"
                type="number"
                name="age"
                min="1"
                max="130"
                value={age}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="injuryAilment" className="form-label">Injury / Ailment</label>
              <input
                required
                id="injuryAilment"
                type="text"
                name="injuryAilment"
                value={injuryAilment}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea
                id="notes"
                type="textarea"
                name="notes"
                rows="3"
                value={notes}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className={existingPatient}>
              <label className="form-check-label" htmlFor="isActive">Is this patient no longer active?</label>
              <input
                role="switch"
                id="isActive"
                type="checkbox"
                name="isActive"
                onChange={this.handleChange}
                className="form-check-input" />
            </div>
            <div className={existingPatient}>
              <label className="form-check-label" htmlFor="isActive">Send Patient Account Sign-Up Email?</label>
              <input
                role="switch"
                id="emailSignUp"
                type="checkbox"
                name="emailSignUp"
                onChange={this.handleChange}
                className="form-check-input" />
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <a href="#" className="btn btn-secondary">
                  Cancel
                </a>
              </div>
              <div>
                <button type="submit" className="btn orange-button">
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
NewPatientForm.contextType = AppContext;
