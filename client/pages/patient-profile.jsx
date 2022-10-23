import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import ExerciseCards from '../components/exercise-cards';

export default class PatientProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patientExercises: [],
      exercises: [],
      patient: null
    };
    this.deleteProfile = this.deleteProfile.bind(this);
  }

  componentDidMount() {
    fetch(`/api/patientExercises/${this.props.patientId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patientExercises => this.setState({ patientExercises }));

    fetch('/api/exercises', {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));

    fetch(`/api/patients/${this.props.patientId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patient => this.setState({ patient }));
  }

  deleteProfile() {
    fetch(`/api/patients/${this.props.patientId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'DELETE'
    })
      .then(res => {
        location.hash = '#';
      });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    if (!this.state.patient) return null;
    if (!this.state.patientExercises) return null;
    const { patientId, firstName, lastName, age, injuryAilment, notes } = this.state.patient;
    const name = `${firstName} ${lastName}`;

    let notesSection;
    notes ? notesSection = notes : notesSection = 'None';

    const exerciseLibrary = this.state.exercises;
    const patientExercises = [];
    for (let i = 0; i < this.state.patientExercises.length; i++) {
      patientExercises.push(this.state.patientExercises[i].exerciseId);
    }
    const exercises = [];
    for (let i = 0; i < exerciseLibrary.length; i++) {
      if (patientExercises.includes(exerciseLibrary[i].exerciseId)) {
        exercises.push(exerciseLibrary[i]);
      }
    }

    for (let i = 0; i < exercises.length; i++) {
      exercises[i].view = 'd-block mb-3';
    }

    return (
      <div className="container w-75">
        <div className="modal fade" id="editModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">Make Changes to Profile?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                A patient can be marked as Inactive in Edit Profile.
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button className="btn text-light" style={{ backgroundColor: '#D78521' }} data-bs-dismiss="modal" onClick={() => { location.href = `#newPatient?patientId=${patientId}`; }}>Edit Profile</button>
                <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete Profile</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="deleteModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">Are You Sure?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <p>This patient profile will be permanently deleted.</p>
                <p className="mb-0"><b>Reminder</b> - A patient can be marked as inactive in Edit Profile</p>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={this.deleteProfile}>Confirm Delete</button>
                <button className="btn text-light" style={{ backgroundColor: '#D78521' }} data-bs-toggle="modal" data-bs-target="#editModal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8 col-xxl-7 mb-5 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Patient Profile</h1>
              <i className="fa-solid fa-user fa-2xl mb-1 d-none d-sm-block"></i>
            </div>
            <a href="#" className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span> Patients</span>
            </a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 mb-5 p-lg-1">
            <div className="card">
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
                  <div className="d-flex align-items-center justify-content-between">
                    <h3 className="mb-0 me-3">{ name }</h3>
                    <i className="btn fa-solid fa-pen-to-square fa-xl" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                  </div>
                  <div className="d-flex d-none d-sm-block align-items-center">
                    <h5 className="mt-2">Age: { age }</h5>
                  </div>
                </div>
                <h5 className="card-subtitle mb-5 text-muted">{ injuryAilment }</h5>
                <h6 className="mb-1 text-decoration-underline">Notes:</h6>
                <p className="card-text mb-2">{ notesSection }</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-3">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 mb-2 p-lg-1 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="me-3">Exercises</h4>
            </div>
            <a href={`#chooseExercise?patientId=${patientId}`} className="btn my-1" style={{ backgroundColor: '#D78521', color: 'white' }}>Add Exercise</a>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <ExerciseCards exercises={exercises} patientExercises={this.state.patientExercises} />
        </div>
      </div>
    );
  }
}
PatientProfile.contextType = AppContext;
