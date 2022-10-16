import React from 'react';

export default class ExerciseAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patient: null,
      patientExercise: null
    };
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`)
      .then(res => res.json())
      .then(exercise => this.setState({ exercise }));

    fetch(`/api/patients/${this.props.patientId}`)
      .then(res => res.json())
      .then(patient => this.setState({ patient }));

    fetch(`/api/patientExercises/${this.props.patientId}/${this.props.exerciseId}`)
      .then(res => res.json())
      .then(patientExercise => this.setState({ patientExercise }));
  }

  render() {
    if (!this.state.patientExercise) return null;
    if (!this.state.exercise) return null;
    if (!this.state.patient) return null;
    const patientExerciseId = this.state.patientExercise.patientExerciseId;
    const { exerciseId, name, description } = this.state.exercise;
    const { firstName, lastName, patientId } = this.state.patient;
    const patientName = `${firstName} ${lastName}`;

    return (
      <div className="container w-75">
        {/* <div className="modal fade" id="deleteModal">
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
        </div> */}
        <div className="row justify-content-center mb-3 mb-md-5">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 mb-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Exercise Assignment</h1>
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
                  {/* <i className="btn fa-solid fa-pen-to-square fa-xl" data-bs-toggle="modal" data-bs-target="#editModal"></i> */}
                </div>
                <h5 className="mb-1 text-decoration-underline">Description:</h5>
                <p className="card-text lead ms-4 mb-5">{description}</p>
                <div className="d-flex justify-content-around">
                  <a href={`#assignExercise?patientExerciseId=${patientExerciseId}&exerciseId=${exerciseId}&patientId=${patientId}&exercise=${this.props.exercise}`} className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
                    <span>Update</span>
                  </a>
                  <button className="btn btn-danger my-2">
                    <span>Remove</span>
                    {/* Move modal here, use to confirm Delete request */}
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
