import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      accountType: 'therapist',
      error: false
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
    const { action } = this.props;
    fetch(`/api/auth/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(result => {
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
        if (result.error === 'invalid login') {
          this.setState({ error: true });
        } else {
          this.setState({ error: false });
        }
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const { error } = this.state;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternateActionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register now';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const errorText = error
      ? 'alert alert-danger py-2 mb-3'
      : 'd-none';
    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className={errorText}>
            <p className="my-1">Your email or password was incorrect.</p>
            <p className="my-1">Please try again.</p>
          </div>
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
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            required
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            className="form-control bg-light" />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small>
            <a className="text-muted" href={alternateActionHref}>
              {alternateActionText}
            </a>
          </small>
          <button type="submit" className="btn" style={{ backgroundColor: '#282A3E', color: 'white' }}>
            {submitButtonText}
          </button>
        </div>
      </form>
    );
  }
}
AuthForm.contextType = AppContext;
