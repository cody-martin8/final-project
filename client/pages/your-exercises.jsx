import React from 'react';
import parseRoute from '../lib/parse-route';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import ExerciseCards from '../components/exercise-cards';

export default class YourExercises extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
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
      .then(exercises => this.setState({ exercises, isLoading: false }))
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

    const { exercises, isLoading, networkError } = this.state;
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

    for (let i = 0; i < exercises.length; i++) {
      targetArea === 'All'
        ? exercises[i].view = 'd-block mb-3'
        : exercises[i].targetArea === targetArea
          ? exercises[i].view = 'd-block mb-3'
          : exercises[i].view = 'd-none';
    }

    return (
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 mb-4 mb-lg-4 p-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h1 className="me-3">Your Exercises</h1>
              <i className="fa-regular fa-folder-open fa-2xl mb-1 d-none d-sm-block"></i>
            </div>
            <a href="#newExercise" className="btn dark-blue-button">New Exercise</a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7 mb-4 p-lg-1 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="me-3">{targetArea} Exercises</h4>
            </div>
            <div className="dropdown">
              <a className="btn dropdown-toggle orange-button"
                href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">Target Area</a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#exercises?targetArea=all" id="all" >All</a></li>
                <li><a className="dropdown-item" href="#exercises?targetArea=anklefoot" id="anklefoot" >Ankle and Foot</a></li>
                <li><a className="dropdown-item" href="#exercises?targetArea=cervical" id="cervical" >Cervical</a></li>
                <li><a className="dropdown-item" href="#exercises?targetArea=elbowhand" id="elbowhand" >Elbow and Hand</a></li>
                <li><a className="dropdown-item" href="#exercises?targetArea=hipknee" id="hipknee" >Hip and Knee</a></li>
                <li><a className="dropdown-item" href="#exercises?targetArea=lumbarthoracic" id="lumbarthoracic" >Lumbar Thoracic</a></li>
                <li><a className="dropdown-item" href="#exercises?targetArea=shoulder" id="shoulder" >Shoulder</a></li>
                <li><a className="dropdown-item" href="#exercises?targetArea=other" id="other" >Other</a></li>
              </ul>
            </div>
          </div>
          <div className="row justify-content-center mb-5">
            <ExerciseCards exercises={exercises} />
          </div>
        </div>
      </div>
    );
  }
}
YourExercises.contextType = AppContext;
