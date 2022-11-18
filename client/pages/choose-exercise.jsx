import React from 'react';
import parseRoute from '../lib/parse-route';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import ExerciseCards from '../components/exercise-cards';

export default class ChooseExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      patientExercises: [],
      route: parseRoute(window.location.hash),
      isLoading: true,
      networkError: false
    };
  }

  componentDidMount() {
    addEventListener('hashchange', event => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    fetch('/api/exercises', {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }))
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });

    fetch(`/api/patientExercises/${this.props.patientId}`, {
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

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    const { exercises, patientExercises, isLoading, networkError } = this.state;
    const { params } = this.state.route;

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

    let targetArea;
    const targetParameter = params.get('targetArea');
    switch (targetParameter) {
      case 'all':
        targetArea = 'All';
        break;
      case 'anklefoot':
        targetArea = 'Ankle and Foot';
        break;
      case 'cervical':
        targetArea = 'Cervical';
        break;
      case 'elbowhand':
        targetArea = 'Elbow and Hand';
        break;
      case 'hipknee':
        targetArea = 'Hip and Knee';
        break;
      case 'lumbarthoracic':
        targetArea = 'Lumbar Thoracic';
        break;
      case 'shoulder':
        targetArea = 'Shoulder';
        break;
      case 'other':
        targetArea = 'Other';
        break;
      default:
        targetArea = 'All';
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
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=all`} id="all" >All</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=anklefoot`} id="anklefoot" >Ankle and Foot</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=cervical`} id="cervical" >Cervical</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=elbowhand`} id="elbowhand" >Elbow and Hand</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=hipknee`} id="hipknee" >Hip and Knee</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=lumbarthoracic`} id="lumbarthoracic" >Lumbar Thoracic</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=shoulder`} id="shoulder" >Shoulder</a></li>
                <li><a className="dropdown-item" href={`#chooseExercise?patientId=${this.props.patientId}&targetArea=other`} id="other" >Other</a></li>
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
