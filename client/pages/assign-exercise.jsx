import React from 'react';
import ExerciseCards from '../components/exercise-cards';

export default class AssignExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      selectedExercise: [],
      patient: null
    };
  }

  componentDidMount() {
    fetch('/api/exercises')
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));

    fetch(`/api/patients/${this.props.patientId}`)
      .then(res => res.json())
      .then(patient => this.setState({ patient }));
  }

  render() {
    if (!this.state.patient) return null;
    if (!this.state.exercises) return null;
    const exercises = this.state.exercises;

    for (let i = 0; i < exercises.length; i++) {
      exercises[i].view = 'd-block mb-3';
    }

    return (
      <div className="container w-75">
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-7 col-xl-7 col-xxl-6 mb-2 p-lg-1 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="me-3">Choose Exercise for {this.state.patient.firstName} {this.state.patient.lastName}</h4>
            </div>
          </div>
          <ExerciseCards exercises={exercises} />
        </div>
      </div>
    );
  }
}
