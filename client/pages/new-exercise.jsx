import React from 'react';

export default class NewExerciseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      name: '',
      targetArea: '',
      description: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/exercises')
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newExercise = {
      name: this.state.name,
      targetArea: this.state.targetArea,
      description: this.state.description
    };
    this.props.onSubmit(newExercise);
    this.setState({
      name: '',
      targetArea: '',
      description: ''
    });
  }

  render() {
    const nameArray = [];
    for (let i = 0; i < this.state.exercises.length; i++) {
      nameArray.push(this.state.exercises[i].name);
    }
    const isTaken = nameArray.includes(this.state.name);

    let exerciseExists;
    isTaken ? exerciseExists = 'text-danger mb-3' : exerciseExists = 'd-none';

    return (
      <div className="container w-75">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 mb-3">
            <div className="d-flex align-items-center">
              <h1 className="me-3">New Exercise</h1>
              <i className="fa-solid fa-user-plus fa-2xl mb-2"></i>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <form className="col-10 col-lg-6" onSubmit={this.handleSubmit}>
            <div className={exerciseExists}>An exercise with this name already exists</div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" required className="form-control" id="name" value={this.state.name} onChange={this.handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="targetArea" className="form-label">Target Area</label>
              <select required className="form-select" id="targetArea" value={this.state.targetArea} onChange={this.handleChange}>
                <option>Select the target area for this exercise</option>
                <option value="Ankle and Foot">Ankle and Foot</option>
                <option value="Cervical">Cervical</option>
                <option value="Elbow and Hand">Elbow and Hand</option>
                <option value="Hip and Knee">Hip and Knee</option>
                <option value="Lumbar Thoracic">Lumbar Thoracic</option>
                <option value="Shoulder">Shoulder</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea type="textarea" className="form-control" id="description" rows="3" value={this.state.description} onChange={this.handleChange} />
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <a href="#" className="btn btn-secondary">Cancel</a>
              </div>
              <div>
                <button type="submit" className="btn" style={{ backgroundColor: '#D78521', color: 'white' }}>Save Exercise</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
