import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class AssignExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patientExercise: null,
      sets: '',
      repetitions: '',
      hold: '',
      isLoading: true,
      networkError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(exercise => this.setState({ exercise, isLoading: false }))
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });

    if (this.props.patientExerciseId !== null) {
      this.setState({ isLoading: true });
      fetch(`/api/patientExercises/${this.props.patientId}/${this.props.exerciseId}`, {
        headers: {
          'X-Access-Token': this.context.token
        }
      })
        .then(res => res.json())
        .then(patientExercise => {
          this.setState({
            patientExercise,
            sets: patientExercise.sets,
            repetitions: patientExercise.repetitions,
            hold: patientExercise.hold,
            isLoading: false
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
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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
    this.setState({ isLoading: true });
    fetch('/api/patientExercises', {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'POST',
      body: JSON.stringify(patientExercise)
    })
      .then(res => {
        this.setState({ isLoading: false });
        location.hash = `#patientProfile?patientId=${this.props.patientId}`;
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

  updatePatientExercise(patientExercise) {
    this.setState({ isLoading: true });
    fetch(`/api/patientExercises/${this.props.patientExerciseId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'PATCH',
      body: JSON.stringify(patientExercise)
    })
      .then(res => {
        this.setState({ isLoading: false });
        location.hash = `patientProfile?patientId=${this.props.patientId}`;
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

    const { exercise, sets, repetitions, hold, isLoading, networkError } = this.state;

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

    if (!exercise) return null;
    const { patientId, exerciseId } = this.props;
    const { name, targetArea, description } = exercise;
    let heading = 'Assign Exercise';
    let headingLink = `#chooseExercise?patientId=${this.props.patientId}`;
    let submitButton = 'Assign Exercise';
    if (this.props.pathway === '1') {
      headingLink = `#exerciseProfile?exerciseId=${exerciseId}`;
    }
    if (this.props.patientExerciseId !== null) {
      heading = 'Update Exercise';
      headingLink = `#exerciseAssignment?patientId=${patientId}&exerciseId=${exerciseId}&exercise=${this.props.exercise}`;
      submitButton = 'Submit';
    }

    return (
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-7 mb-4 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">{heading}</h1>
            </div>
            <a href={headingLink} className="btn my-2 orange-button">
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1">Back</span>
            </a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7 col-xl-6 col-xxl-6 mb-5 p-lg-1">
            <div className="card">
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-3">{name}</h3>
                  </div>
                </div>
                <h5 className="card-subtitle ms-4 mb-4 text-muted">{targetArea}</h5>
                <h5 className="mb-1 text-decoration-underline">Description:</h5>
                <p className="card-text lead ms-4 mb-4">{description}</p>
                <form className="col-12" onSubmit={this.handleSubmit}>
                  <div className="row justify-content-sm-around mb-3">
                    <div className="col-7 col-sm-3 mb-3">
                      <label htmlFor="sets" className="form-label h5">Sets</label>
                      <input
                        required
                        id="sets"
                        type="number"
                        name="sets"
                        min="1"
                        max="50"
                        value={sets}
                        onChange={this.handleChange}
                        className="form-control" />
                    </div>
                    <div className="col-7 col-sm-3 mb-3">
                      <label htmlFor="repetitions" className="form-label h5">Reps</label>
                      <input
                        type="number"
                        id="repetitions"
                        name="repetitions"
                        min="0"
                        max="50"
                        value={repetitions}
                        onChange={this.handleChange}
                        className="form-control" />
                    </div>
                    <div className="col-7 col-sm-5 col-md-4 col-lg-5 col-xl-4 mb-3">
                      <label htmlFor="hold" className="form-label h5">Hold (in sec.)</label>
                      <input
                        type="number"
                        id="hold"
                        name="hold"
                        min="0"
                        max="600"
                        value={hold}
                        onChange={this.handleChange}
                        className="form-control" />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <a href={headingLink} className="btn btn-danger ms-1 ms-sm-2 ms-xl-3 mb-2">
                      <span>Cancel</span>
                    </a>
                    <div>
                      <button type="submit" className="btn me-1 me-sm-2 me-xl-3 mb-2 orange-button">{submitButton}</button>
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
AssignExercise.contextType = AppContext;
