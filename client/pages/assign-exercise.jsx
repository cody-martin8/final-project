import React from 'react';

export default class AssignExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch(`/api/exercises/${this.props.exerciseId}`)
      .then(res => res.json())
      .then(exercise => this.setState({ exercise }));
  }

  handleChange() {
    // console.log('Change');
  }

  handleSubmit() {
    // console.log('Submit');
  }

  render() {
    if (!this.state.exercise) return null;
    const { name, targetArea, description } = this.state.exercise;
    // put exerciseId back in above line

    return (
      <div className="container w-75">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7 mb-5 mb-lg-4 p-0 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="me-2">Assign Exercise</h1>
            </div>
            <a href={`#chooseExercise?patientId=${this.props.patientId}`} className="btn my-2" style={{ backgroundColor: '#D78521', color: 'white' }}>
              <i className="fa-solid fa-angle-left fa-sm"></i>
              <span className="ms-1">Your Exercises</span>
            </a>
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
                <div className="">
                  <form className="col-12" onSubmit={this.handleSubmit}>
                    <div className="d-flex justify-content-around mb-4">
                      <div className="col-3 mb-3">
                        <label htmlFor="sets" className="form-label h5">Sets</label>
                        <input type="number" required className="form-control" id="sets" min="1" max="50" value={this.state.sets} onChange={this.handleChange} />
                      </div>
                      <div className="col-3 mb-3">
                        <label htmlFor="repetitions" className="form-label h5">Repetitions</label>
                        <input type="number" className="form-control" id="repetitions" min="1" max="50" value={this.state.repetitions} onChange={this.handleChange} />
                      </div>
                      <div className="col-3 mb-3">
                        <label htmlFor="hold" className="form-label h5">Hold (in sec.)</label>
                        <input type="number" className="form-control" id="hold" min="1" max="600" value={this.state.hold} onChange={this.handleChange} />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div>
                        <button type="submit" className="btn" style={{ backgroundColor: '#D78521', color: 'white' }}>Assign Exercise</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
