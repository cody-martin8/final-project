import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import PatientExerciseCards from '../components/patient-exercise-cards';

export default class MyExercises extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patientExercises: [],
      exercises: [],
      isLoading: true,
      networkError: false
    };
  }

  componentDidMount() {
    fetch(`/api/patientExercises/${this.context.user.patientId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patientExercises => {
        this.setState({ patientExercises, isLoading: false });
        if (patientExercises[0]) {
          const userId = patientExercises[0].userId;
          fetch('/api/exercises', {
            headers: {
              'X-Access-Token': this.context.token,
              'user-id': userId
            }
          })
            .then(res => res.json())
            .then(exercises => this.setState({ exercises }));
        }
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

    const { exercises, patientExercises, isLoading, networkError } = this.state;

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

    const exerciseLibrary = exercises;
    const patientExercisesArray = [];
    for (let i = 0; i < patientExercises.length; i++) {
      patientExercisesArray.push(patientExercises[i].exerciseId);
    }
    const exercisesArray = [];
    for (let i = 0; i < exerciseLibrary.length; i++) {
      if (patientExercisesArray.includes(exerciseLibrary[i].exerciseId)) {
        exercisesArray.push(exerciseLibrary[i]);
      }
    }

    return (
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8 col-xxl-6 mb-3 mb-lg-2 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1>
                <span className="me-3">My Exercises</span>
                <i className="fa-solid fa-user mb-1"></i>
              </h1>
            </div>
          </div>
        </div>
        <PatientExerciseCards exercises={exercisesArray} patientExercises={patientExercises} />
      </div>
    );
  }
}
MyExercises.contextType = AppContext;
