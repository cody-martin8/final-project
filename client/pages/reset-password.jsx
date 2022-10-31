import React from 'react';

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      email: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { userId, email } = this.props;
    this.setState({
      userId,
      email
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const userId = {
      userId: this.state.userId
    };
    fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(result => {
        window.location.hash = 'sign-in';
      });
  }

  render() {

    const { handleChange, handleSubmit } = this;

    return (
      <div className="container">
        <div className="row pt-4 align-items-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-5 ms-auto me-auto">
            <header className="">
              <h3 className="mb-2 me-2">
                Reset Password
              </h3>
              <p className="text-muted mb-4">Please enter a new password below</p>
            </header>
          </div>
        </div>
        <div className="row pt-3 align-items-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-5 ms-auto me-auto">
            <div className="card p-3" style={{ backgroundColor: '#E7E6E6' }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    required
                    autoFocus
                    id="password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    className="form-control bg-light" />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <a href="#sign-in" className="btn btn-secondary">
                    Cancel
                  </a>
                  <button type="submit" className="btn" style={{ backgroundColor: '#FFC857', color: 'white' }}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
