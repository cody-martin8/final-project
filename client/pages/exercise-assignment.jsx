import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class ExerciseAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patient: null,
      patientExercise: null
    };
    this.deleteAssignment = this.deleteAssignment.bind(this);
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(exercise => this.setState({ exercise }));

    fetch(`/api/patients/${this.props.patientId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patient => this.setState({ patient }));

    fetch(`/api/patientExercises/${this.props.patientId}/${this.props.exerciseId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patientExercise => this.setState({ patientExercise }));
  }

  deleteAssignment() {
    const { patientExerciseId } = this.state.patientExercise;
    const { patientId } = this.state.patient;
    fetch(`/api/patientExercises/${patientExerciseId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'DELETE'
    })
      .then(res => {
        location.hash = `#patientProfile?patientId=${patientId}`;
      });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    if (!this.state.patientExercise) return null;
    if (!this.state.exercise) return null;
    if (!this.state.patient) return null;
    const { patientExerciseId, feedback } = this.state.patientExercise;
    const { exerciseId, name, description } = this.state.exercise;
    const { firstName, lastName, patientId } = this.state.patient;
    const patientName = `${firstName} ${lastName}`;

    return (
      <div className="container px-4">
        <div className="modal fade" id="deleteModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">Are You Sure?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <p>This exercise assignment will be permanently removed.</p>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={this.deleteAssignment}>Remove Assignment</button>
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-3 mb-md-5">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 mb-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Assigned Exercise</h1>
            </div>
            <a href={`#patientProfile?patientId=${patientId}`} className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1"> Patient</span>
            </a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 mb-5 p-lg-1">
            <div className="card">
              <div className="card-body">
                <h5 className="card-subtitle mb-1 text-muted">{patientName}</h5>
                <div className="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between mb-5">
                  <h3 className="mb-0 ms-2">{name}</h3>
                  <h4 className="card-subtitle text-muted mt-2 ms-2 pt-0">{this.props.exercise}</h4>
                </div>
                <h5 className="mb-1 text-decoration-underline">Description:</h5>
                <p className="card-text lead ms-4 mb-4">{description}</p>
                {(feedback) &&
                  <>
                    <h5 className="mb-1">Patient Feedback:</h5>
                    <p className="card-text lead ms-4 mb-5">{feedback}</p>
                  </>
                }
                <div className="d-flex justify-content-around">
                  <a href={`#assignExercise?patientExerciseId=${patientExerciseId}&exerciseId=${exerciseId}&patientId=${patientId}&exercise=${this.props.exercise}`} className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
                    <span>Update</span>
                  </a>
                  <button className="btn btn-danger my-2" data-bs-toggle="modal" data-bs-target="#deleteModal">
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ExerciseAssignment.contextType = AppContext;
