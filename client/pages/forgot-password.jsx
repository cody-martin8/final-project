import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.state.email;
    fetch(`/api/users/${email}`)
      .then(res => res.json())
      .then(result => {
        if (result.user) {
          const user = result.user;
          fetch('/api/forgot-password', {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(user)
          });
        }
      });
  }

  render() {

    const { user } = this.context;
    const { handleChange, handleSubmit } = this;

    if (user) return <Redirect to="" />;

    return (
      <div className="container">
        <div className="row pt-4 align-items-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-5 ms-auto me-auto">
            <header className="">
              <h3 className="mb-2 me-2">
                Forgot your password?
              </h3>
              <p className="text-muted mb-4">Please enter the email address used with your PT Connection account</p>
            </header>
          </div>
        </div>
        <div className="row pt-3 align-items-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-5 ms-auto me-auto">
            <div className="card p-3" style={{ backgroundColor: '#E7E6E6' }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    required
                    autoFocus
                    id="email"
                    type="email"
                    name="email"
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
ForgotPassword.contextType = AppContext;
