import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class ExerciseDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      patientExercise: null,
      feedback: '',
      isLoading: true
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
            feedback: patientExercise.feedback,
            isLoading: false
          });
        } else {
          this.setState({
            patientExercise,
            isLoading: false
          });
        }
      });
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ feedback: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
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
        this.setState({ isLoading: false });
        location.hash = '#';
      });
    this.setState({ feedback: '' });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const { exercise, feedback, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-5 load-container">
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      );
    }

    if (!exercise) return null;
    const { name, description } = this.state.exercise;

    return (
      <div className="container px-4">
        <div className="row justify-content-center mb-4 mb-md-5">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 p-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h1 className="me-2 mb-0">Exercise Details</h1>
            </div>
            <a href='#' className="btn px-2 py-1 orange-button">
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <h6 className="d-inline ms-1"> Back</h6>
            </a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="card col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 mb-5 p-0 p-lg-1">
            <div className="card-body px-2">
              <div className="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between mb-5">
                <h2 className="mb-0 ms-2 me-5">{name}</h2>
                <h4 className="card-subtitle text-muted mt-2 ms-2 pt-0">{this.props.exercise}</h4>
              </div>
              <h5 className="mb-3 ms-2 text-decoration-underline">Description:</h5>
              <p className="card-text lead mx-3 mb-5">{description}</p>
              <div className="row justify-content-center">
                <form className="px-4 mb-3" onSubmit={this.handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="exerciseFeedback" className="form-label lead"><h5 className="m-0">Exercise Feedback</h5></label>
                    <textarea type="textarea" className="form-control" id="exerciseFeedback" rows="3" value={feedback} onChange={this.handleChange} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <a href="#" className="btn btn-secondary">Return</a>
                    </div>
                    <div>
                      <button type="submit" className="btn orange-button">Save Feedback</button>
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
