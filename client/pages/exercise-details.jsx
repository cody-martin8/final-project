import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class ExerciseDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patientExercise: null,
      feedback: ''
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
      .then(exercise => this.setState({ exercise }));

    fetch(`/api/patientExercises/${this.context.user.patientId}/${this.props.exerciseId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patientExercise => {
        if (patientExercise.feedback) {
          this.setState({
            patientExercise,
            feedback: patientExercise.feedback
          });
        } else {
          this.setState({ patientExercise });
        }
      });
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ feedback: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { sets, repetitions, hold } = this.state.patientExercise;
    const exerciseFeedback = {
      sets,
      repetitions,
      hold,
      feedback: this.state.feedback
    };
    fetch(`/api/patientExercises/${this.props.patientExerciseId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'PATCH',
      body: JSON.stringify(exerciseFeedback)
    })
      .then(res => {
        location.hash = '#';
      });
    this.setState({ feedback: '' });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    if (!this.state.exercise) return null;
    const { name, description } = this.state.exercise;

    return (
      <div className="container px-4">
        <div className="row justify-content-center mb-3 mb-md-5">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Exercise Details</h1>
            </div>
            <a href='#' className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1"> My Exercises</span>
            </a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="card col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 mb-5 p-lg-1">
            <div className="card-body">
              <div className="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between mb-5">
                <h3 className="mb-0 ms-2">{name}</h3>
                <h4 className="card-subtitle text-muted mt-2 ms-2 pt-0">{this.props.exercise}</h4>
              </div>
              <h5 className="mb-3 ms-2 text-decoration-underline">Description:</h5>
              <p className="card-text lead mx-3 mb-5">{description}</p>
              <div className="row justify-content-center">
                <form className="px-4 mb-3" onSubmit={this.handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="exerciseFeedback" className="form-label lead">Exercise Feedback</label>
                    <textarea type="textarea" className="form-control" id="exerciseFeedback" rows="3" value={this.state.feedback} onChange={this.handleChange} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <a href="#" className="btn btn-secondary">Return</a>
                    </div>
                    <div>
                      <button type="submit" className="btn" style={{ backgroundColor: '#D78521', color: 'white' }}>Save Feedback</button>
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
ExerciseDetails.contextType = AppContext;
