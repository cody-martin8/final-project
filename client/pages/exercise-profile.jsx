import React from 'react';

export default class ExerciseProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null
    };
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`)
      .then(res => res.json())
      .then(exercise => this.setState({ exercise }));
  }

  render() {
    if (!this.state.exercise) return null;
    const { name, targetArea, description } = this.state.exercise;

    return (
      <div className="container w-75">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7 mb-5 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Exercise Profile</h1>
              {/* <i className="fa-solid fa-user fa-2xl mb-1"></i> */}
            </div>
            <a href="#exercises" className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1">Your Exercises</span>
            </a>
            {/* Put the Edit icon here */}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 col-xl-7 col-xxl-6 mb-5 p-lg-1">
            <div className="card">
              <div className="card-body">
                <div className="mb-3 d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-3">{name}</h3>
                  </div>
                </div>
                <h5 className="card-subtitle ms-4 mb-5 text-muted">{targetArea}</h5>
                <h5 className="mb-1 text-decoration-underline">Description:</h5>
                <p className="card-text lead ms-4 mb-5">{description}</p>
                <a href="#exercises" className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
                  <span>Assign Exercise</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
