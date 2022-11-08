import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import ExerciseCards from '../components/exercise-cards';

export default class ChooseExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      patientExercises: [],
      targetArea: 'All',
      isLoading: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    switch (event.target.id) {
      case 'all':
        this.setState({ targetArea: 'All' });
        break;
      case 'ankleAndFoot':
        this.setState({ targetArea: 'Ankle and Foot' });
        break;
      case 'cervical':
        this.setState({ targetArea: 'Cervical' });
        break;
      case 'elbowAndHand':
        this.setState({ targetArea: 'Elbow and Hand' });
        break;
      case 'hipAndKnee':
        this.setState({ targetArea: 'Hip and Knee' });
        break;
      case 'lumbarThoracic':
        this.setState({ targetArea: 'Lumbar Thoracic' });
        break;
      case 'shoulder':
        this.setState({ targetArea: 'Shoulder' });
        break;
      case 'other':
        this.setState({ targetArea: 'Other' });
        break;
      default:
        this.setState({ targetArea: 'All' });
    }
  }

  componentDidMount() {
    fetch('/api/exercises', {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));

    fetch(`/api/patientExercises/${this.props.patientId}`, {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(patientExercises => this.setState({ patientExercises, isLoading: false }));
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    const { exercises, patientExercises, targetArea, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-5 load-container">
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      );
    }

    if (!exercises || !patientExercises) return null;

    const patientExercisesArray = [];
    for (let i = 0; i < patientExercises.length; i++) {
      patientExercisesArray.push(patientExercises[i].exerciseId);
    }
    const exercisesArray = [];
    for (let i = 0; i < exercises.length; i++) {
      if (!patientExercisesArray.includes(exercises[i].exerciseId)) {
        exercisesArray.push(exercises[i]);
      }
    }

    for (let i = 0; i < exercisesArray.length; i++) {
      targetArea === 'All'
        ? exercisesArray[i].view = 'd-block mb-3'
        : exercisesArray[i].targetArea === targetArea
          ? exercisesArray[i].view = 'd-block mb-3'
          : exercisesArray[i].view = 'd-none';
    }

    return (
      <div className="container px-4">
        <div className="row justify-content-center mb-2">
          <div className="d-flex align-items-center mb-2 col-12 col-sm-8 col-md-6 col-lg-4 col-xxl-4">
            <h2 className="me-3">Select Exercise</h2>
          </div>
          <div className="d-flex justify-content-between justify-content-sm-end align-items-center mb-3 col-12 col-sm-4 col-md-4 col-lg-3 col-xxl-2">
            <div>
              <a className="btn btn-sm btn-secondary ms-xl-1 ms-xxl-4 me-2"
                href={`#patientProfile?patientId=${this.props.patientId}`}>Cancel</a>
            </div>
            <div className="dropdown">
              <a className="btn btn-sm dropdown-toggle orange-button"
                href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">Target Area</a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="all" onClick={this.handleClick}>All</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="ankleAndFoot" onClick={this.handleClick}>Ankle and Foot</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="cervical" onClick={this.handleClick}>Cervical</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="elbowAndHand" onClick={this.handleClick}>Elbow and Hand</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="hipAndKnee" onClick={this.handleClick}>Hip and Knee</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="lumbarThoracic" onClick={this.handleClick}>Lumbar Thoracic</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="shoulder" onClick={this.handleClick}>Shoulder</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}`} id="other" onClick={this.handleClick}>Other</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <ExerciseCards exercises={exercisesArray} />
        </div>
      </div>
    );
  }
}
ChooseExercise.contextType = AppContext;
