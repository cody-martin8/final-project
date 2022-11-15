import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class NewExerciseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      initialName: '',
      name: '',
      targetArea: '',
      description: '',
      isLoading: true,
      networkError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.editExercise = this.editExercise.bind(this);
  }

  componentDidMount() {
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

    if (this.props.exerciseId !== null) {
      fetch(`/api/exercises/${this.props.exerciseId}`, {
        headers: {
          'X-Access-Token': this.context.token
        }
      })
        .then(res => res.json())
        .then(editExercise => {
          this.setState({
            initialName: editExercise.name,
            name: editExercise.name,
            targetArea: editExercise.targetArea,
            description: editExercise.description
          });
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
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const exercise = {
      name: this.state.name,
      targetArea: this.state.targetArea,
      description: this.state.description
    };
    if (this.props.exerciseId === null) {
      this.addExercise(exercise);
    } else {
      exercise.exerciseId = this.props.exerciseId;
      this.editExercise(exercise);
    }
    this.setState({
      name: '',
      targetArea: '',
      description: ''
    });
  }

  addExercise(newExercise) {
    this.setState({ isLoading: true });
    fetch('/api/exercises', {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'POST',
      body: JSON.stringify(newExercise)
    })
      .then(res => {
        this.setState({ isLoading: false });
        location.hash = '#exercises';
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

  editExercise(exercise) {
    this.setState({ isLoading: true });
    fetch(`/api/exercises/${exercise.exerciseId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.context.token
      },
      method: 'PATCH',
      body: JSON.stringify(exercise)
    })
      .then(res => {
        this.setState({ isLoading: false });
        location.hash = `#exerciseProfile?exerciseId=${exercise.exerciseId}`;
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

    const { exercises, name, initialName, targetArea, description, isLoading, networkError } = this.state;

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

    const nameArray = [];
    for (let i = 0; i < exercises.length; i++) {
      nameArray.push(exercises[i].name);
    }

    let isTaken, formHeader;
    if (this.props.exerciseId === null) {
      isTaken = nameArray.includes(name);
      formHeader = 'New Exercise';
    } else {
      isTaken = (nameArray.includes(name) && name !== initialName);
      formHeader = 'Edit Exercise';
    }

    let exerciseExists;
    isTaken ? exerciseExists = 'alert alert-danger mb-3' : exerciseExists = 'd-none';

    return (
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 mb-3">
            <div className="d-flex align-items-center">
              <h1 className="me-3">{formHeader}</h1>
              <i className="fa-solid fa-folder-plus fa-2xl"></i>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <form className="col-10 col-lg-6" onSubmit={this.handleSubmit}>
            <div className={exerciseExists} role="alert">An exercise with this name already exists</div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                required
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="targetArea" className="form-label">Target Area</label>
              <select required id="targetArea" name="targetArea" value={targetArea} onChange={this.handleChange} className="form-select" >
                <option>Select the target area for this exercise</option>
                <option value="Ankle and Foot" >Ankle and Foot</option>
                <option value="Cervical" >Cervical</option>
                <option value="Elbow and Hand" >Elbow and Hand</option>
                <option value="Hip and Knee" >Hip and Knee</option>
                <option value="Lumbar Thoracic" >Lumbar Thoracic</option>
                <option value="Shoulder" >Shoulder</option>
                <option value="Other" >Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                type="textarea"
                rows="3"
                value={description}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <a href="#exercises" className="btn btn-secondary">Cancel</a>
              </div>
              <div>
                <button type="submit" className="btn orange-button">Save Exercise</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
NewExerciseForm.contextType = AppContext;
