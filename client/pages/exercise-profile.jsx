import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import PatientDropdown from '../components/patient-dropdown';

export default class ExerciseProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patients: [],
      patientExercises: [],
      isLoading: true,
      networkError: false
    };
    this.deleteProfile = this.deleteProfile.bind(this);
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(exercise => this.setState({ exercise }))
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });

    fetch('/api/activePatients', {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patients => this.setState({ patients }))
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });

    fetch(`/api/exercisePatients/${this.props.exerciseId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patientExercises => this.setState({ patientExercises, isLoading: false }))
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });
  }

  deleteProfile(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    fetch(`/api/patientExercises/exercise/${this.props.exerciseId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'DELETE'
    })
      .then(res => {
        fetch(`/api/exercises/${this.props.exerciseId}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Token': this.context.token
          },
          method: 'DELETE'
        })
          .then(res => {
            this.setState({ isLoading: false });
            location.hash = '#exercises';
          })
          .catch(error => {
            if (error) {
              this.setState({
                isLoading: false,
                networkError: true
              });
            }
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

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const { patients, exercise, patientExercises, isLoading, networkError } = this.state;

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-5 load-container">
          <div className="lds-ellipsis d-block"><div></div><div></div><div></div><div></div></div>
        </div>
      );
    }

    if (networkError) {
      return (
        <div className="d-flex justify-content-center mt-5 px-4">
          <div className="card mt-3 d-block">
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

    if (!exercise || !patients || !patientExercises) return null;
    const { exerciseId, name, targetArea, description } = exercise;

    const patientExercisesArray = [];
    for (let i = 0; i < patientExercises.length; i++) {
      patientExercisesArray.push(patientExercises[i].patientId);
    }
    const patientsArray = [];
    for (let i = 0; i < patients.length; i++) {
      if (!patientExercisesArray.includes(patients[i].patientId)) {
        patientsArray.push(patients[i]);
      }
    }

    return (
      <div className="container px-4">
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
                <button className="btn orange-button" data-bs-dismiss="modal" onClick={() => { location.href = `#newExercise?exerciseId=${exerciseId}`; }}>Edit Exercise</button>
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
          <div className="col-12 col-lg-8 col-xl-7 mb-4 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Exercise Profile</h1>
            </div>
            <a href="#exercises" className="btn my-2 my-xl-3 orange-button">
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1">Back</span>
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
                    <i className="btn edit-button fa-solid fa-pen-to-square fa-xl" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                  </div>
                </div>
                <h5 className="card-subtitle ms-4 mb-5 text-muted">{targetArea}</h5>
                <h5 className="mb-1 text-decoration-underline">Description:</h5>
                <p className="card-text lead ms-4 mb-5">{description}</p>
                <div className="d-flex justify-content-between">
                  <a href="#patientSelect" className="btn my-2 orange-button" data-bs-toggle="collapse">
                    <span>Assign Exercise</span>
                  </a>
                  <div className="collapse" id="patientSelect">
                    <div className="dropdown">
                      <a className="btn btn-secondary dropdown-toggle my-2" href="#" id="patients" data-bs-toggle="dropdown">
                        <span>Select Patient</span>
                      </a>
                      <PatientDropdown patients={patientsArray} exerciseId={exerciseId} />
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
ExerciseProfile.contextType = AppContext;
