import React from 'react';
import ExerciseCards from '../components/exercise-cards';

export default class PatientProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      patient: null
    };
  }

  componentDidMount() {
    fetch('/api/exercises')
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));

    fetch(`/api/patients/${this.props.patientId}`)
      .then(res => res.json())
      .then(patient => this.setState({ patient }));
  }

  render() {
    if (!this.state.patient) return null;
    if (!this.state.exercises) return null;
    const exercises = this.state.exercises;
    const { firstName, lastName, age, injuryAilment, notes } = this.state.patient;
    const name = `${firstName} ${lastName}`;

    let notesSection;
    notes ? notesSection = notes : notesSection = 'None';

    for (let i = 0; i < exercises.length; i++) {
      exercises[i].view = 'd-block mb-3';
    }

    return (
      <div className="container w-75">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7 mb-5 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Patient Profile</h1>
              <i className="fa-solid fa-user fa-2xl mb-1"></i>
            </div>
            <a href="#" className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="">Your Patients</span>
            </a>
            {/* Put the Edit icon here */}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 col-xl-7 col-xxl-6 mb-5 p-lg-1">
            <div className="card">
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-3">{ name }</h3>
                  </div>
                  <div className="d-flex align-items-center">
                    <h5 className="mt-2">Age: { age }</h5>
                  </div>
                </div>
                <h5 className="card-subtitle mb-5 text-muted">{ injuryAilment }</h5>
                <h6 className="mb-1 text-decoration-underline">Notes:</h6>
                <p className="card-text">{ notesSection }</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-7 col-xl-7 col-xxl-6 mb-2 p-lg-1 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="me-3">Exercises</h4>
            </div>
            <a href="#patientProfile" className="btn my-1" style={{ backgroundColor: '#D78521', color: 'white' }}>Add Exercise</a>
          </div>
          <ExerciseCards exercises={this.state.exercises} />
        </div>
      </div>
    );
  }
}
