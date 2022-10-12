import React from 'react';
import PatientDropdown from '../components/patient-dropdown';

export default class ExerciseProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patients: []
    };
    this.deleteProfile = this.deleteProfile.bind(this);
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`)
      .then(res => res.json())
      .then(exercise => this.setState({ exercise }));

    fetch('/api/activePatients')
      .then(res => res.json())
      .then(patients => this.setState({ patients }));
  }

  deleteProfile() {
    fetch(`/api/exercises/${this.props.exerciseId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    })
      .then(res => {
        location.hash = '#exercises';
      });
  }

  render() {
    if (!this.state.exercise) return null;
    const { exerciseId, name, targetArea, description } = this.state.exercise;

    return (
      <div className="container w-75">
        <div className="modal fade" id="editModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">Make Changes to Exercise?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                You can change the name, target area, and description of an exercise in Edit Exercise.
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button className="btn text-light" style={{ backgroundColor: '#D78521' }} data-bs-dismiss="modal" onClick={() => { location.href = `#newExercise?exerciseId=${exerciseId}`; }}>Edit Exercise</button>
                <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete Exercise</button>
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
                <p>This exercise will be permanently deleted.</p>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={this.deleteProfile}>Confirm Delete</button>
                <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editModal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7 mb-5 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Exercise Profile</h1>
            </div>
            <a href="#exercises" className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1">Your Exercises</span>
            </a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 col-xl-7 col-xxl-6 mb-5 p-lg-1">
            <div className="card">
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-3">{name}</h3>
                    <i className="btn fa-solid fa-pen-to-square fa-xl" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                  </div>
                </div>
                <h5 className="card-subtitle ms-4 mb-5 text-muted">{targetArea}</h5>
                <h5 className="mb-1 text-decoration-underline">Description:</h5>
                <p className="card-text lead ms-4 mb-5">{description}</p>
                <div className="d-flex justify-content-between">
                  <a href="#patientSelect" className="btn my-2" data-bs-toggle="collapse" style={{ backgroundColor: '#D78521', color: 'white' }}>
                    <span>Assign Exercise</span>
                  </a>
                  <div className="collapse" id="patientSelect">
                    <div className="dropdown">
                      <a className="btn btn-secondary dropdown-toggle my-2" href="#" id="patients" data-bs-toggle="dropdown">
                        <span>Select Patient</span>
                      </a>
                      <PatientDropdown patients={this.state.patients} exerciseId={exerciseId} />
                      {/* create new component for rendering the ul with patient names  */}
                      {/* <ul class="dropdown-menu" aria-labelledby="patients">
                        <li><a class="dropdown-item" href="#exercises">Action</a></li>
                        <li><a class="dropdown-item" href="#exercises">Another action</a></li>
                        <li><a class="dropdown-item" href="#exercises">Something else here</a></li>
                      </ul> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
