import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class NewPatientForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      patientEmail: '',
      age: '',
      injuryAilment: '',
      notes: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newPatient = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      patientEmail: this.state.patientEmail,
      age: this.state.age,
      injuryAilment: this.state.injuryAilment,
      notes: this.state.notes
    };
    this.props.onSubmit(newPatient);
    this.setState({
      firstName: '',
      lastName: '',
      patientEmail: '',
      age: '',
      injuryAilment: '',
      notes: ''
    });
  }

  render() {

    return (
      <div className="container w-75">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 mb-3">
            <h1>New Patient</h1>
          </div>
        </div>
        <div className="row justify-content-center">
          <form className="col-10 col-lg-6" onSubmit={this.handleSubmit}>
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
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea type="textarea" className="form-control" id="notes" rows="3" value={this.state.notes} onChange={this.handleChange} />
            </div>
            <div className="d-flex justify-content-between">
              <div className="">
                <a href="#"><button type="button" className="btn btn-secondary">Cancel</button></a>
              </div>
              <div className="">
                <button type="submit" className="btn btn-primary">Save Profile</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
