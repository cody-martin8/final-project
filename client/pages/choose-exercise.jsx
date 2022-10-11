import React from 'react';
import ExerciseCards from '../components/exercise-cards';

export default class ChooseExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      selectedExercise: null,
      patient: null,
      targetArea: 'All'
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
    const targetArea = this.state.targetArea;

    for (let i = 0; i < exercises.length; i++) {
      targetArea === 'All'
        ? exercises[i].view = 'd-block mb-3'
        : exercises[i].targetArea === targetArea
          ? exercises[i].view = 'd-block mb-3'
          : exercises[i].view = 'd-none';
    }

    return (
      <div className="container w-75">
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-7 col-xl-7 col-xxl-6 mb-2 p-lg-1 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="me-3">Choose Exercise for {this.state.patient.firstName} {this.state.patient.lastName}</h4>
            </div>
            <div className="dropdown">
              <a className="btn dropdown-toggle"
                style={{ backgroundColor: '#D78521', color: 'white' }}
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
          <ExerciseCards exercises={exercises} />
        </div>
      </div>
    );
  }
}
