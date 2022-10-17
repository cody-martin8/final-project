import React from 'react';

export default class AssignExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patientExercise: null,
      sets: '',
      repetitions: '',
      hold: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`)
      .then(res => res.json())
      .then(exercise => this.setState({ exercise }));

    if (this.props.patientExerciseId !== null) {
      fetch(`/api/patientExercises/${this.props.patientId}/${this.props.exerciseId}`)
        .then(res => res.json())
        .then(patientExercise => {
          this.setState({
            patientExercise,
            sets: patientExercise.sets,
            repetitions: patientExercise.repetitions,
            hold: patientExercise.hold
          });
        });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const patientExercise = {
      patientId: this.props.patientId,
      exerciseId: this.props.exerciseId,
      sets: this.state.sets,
      repetitions: this.state.repetitions,
      hold: this.state.hold,
      feedback: ''
    };
    if (patientExercise.repetitions === '') {
      patientExercise.repetitions = 0;
    }
    if (patientExercise.hold === '') {
      patientExercise.hold = 0;
    }
    if (this.props.patientExerciseId !== null) {
      this.updatePatientExercise(patientExercise);
    } else {
      this.addPatientExercise(patientExercise);
    }
    this.setState({
      sets: '',
      repetitions: '',
      hold: ''
    });
  }

  addPatientExercise(patientExercise) {
    fetch('/api/patientExercises', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(patientExercise)
    })
      .then(res => {
        location.hash = `#patientProfile?patientId=${this.props.patientId}`;
      });
  }

  updatePatientExercise(patientExercise) {
    fetch(`/api/patientExercises/${this.props.patientExerciseId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(patientExercise)
    })
      .then(res => {
        location.hash = `patientProfile?patientId=${this.props.patientId}`;
      });
  }

  render() {
    if (!this.state.exercise) return null;
    const patientId = this.props.patientId;
    const exerciseId = this.props.exerciseId;
    const { name, targetArea, description } = this.state.exercise;
    let heading = 'Assign Exercise';
    let headingLink = `#chooseExercise?patientId=${this.props.patientId}`;
    let headingButton = 'Your Exercises';
    let submitButton = 'Assign Exercise';
    if (this.props.patientExerciseId !== null) {
      heading = 'Update Exercise';
      headingLink = `#exerciseAssignment?patientId=${patientId}&exerciseId=${exerciseId}&exercise=${this.props.exercise}`;
      headingButton = ' Exercise';
      submitButton = 'Submit Update';
    }

    return (
      <div className="container w-75">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-7 mb-5 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">{heading}</h1>
            </div>
            <a href={headingLink} className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1">{headingButton}</span>
            </a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7 col-xl-7 col-xxl-6 mb-5 p-lg-1">
            <div className="card">
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-3">{name}</h3>
                  </div>
                </div>
                <h5 className="card-subtitle ms-4 mb-5 text-muted">{targetArea}</h5>
                <h5 className="mb-1 text-decoration-underline">Description:</h5>
                <p className="card-text lead ms-4 mb-4">{description}</p>
                <form className="col-12" onSubmit={this.handleSubmit}>
                  <div className="row justify-content-sm-around mb-3">
                    <div className="col-7 col-sm-3 mb-3">
                      <label htmlFor="sets" className="form-label h5">Sets</label>
                      <input type="number" required className="form-control" id="sets" min="1" max="50" value={this.state.sets} onChange={this.handleChange} />
                    </div>
                    <div className="col-7 col-sm-3 mb-3">
                      <label htmlFor="repetitions" className="form-label h5">Reps</label>
                      <input type="number" className="form-control" id="repetitions" min="0" max="50" value={this.state.repetitions} onChange={this.handleChange} />
                    </div>
                    <div className="col-7 col-sm-5 col-md-4 col-lg-5 col-xl-4 mb-3">
                      <label htmlFor="hold" className="form-label h5">Hold (in sec.)</label>
                      <input type="number" className="form-control" id="hold" min="0" max="600" value={this.state.hold} onChange={this.handleChange} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <a href={headingLink} className="btn btn-danger ms-3 mb-2">
                      <span>Cancel</span>
                    </a>
                    <div>
                      <button type="submit" className="btn me-3 mb-2" style={{ backgroundColor: '#D78521', color: 'white' }}>{submitButton}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
