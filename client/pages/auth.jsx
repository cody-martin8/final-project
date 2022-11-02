import React from 'react';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';

export default class AuthPage extends React.Component {
  render() {

    const { user, route, handleSignIn } = this.context;
    const { patientId, email } = this.props;

    if (user) return <Redirect to="" />;

    const welcomeMessage = route.path === 'sign-in'
      ? 'Please sign in to continue'
      : 'Create an account to get started!';
    return (
      <div className="container">
        <div className="row pt-5 align-items-center">
          <div className="col-10 col-sm-9 col-md-7 col-lg-6 col-xl-5 ms-auto me-auto">
            <header className="text-center">
              <h3 className="mb-2 me-2">
                <i className="fa-solid fa-person-walking me-2" style={{ color: '#FFC857' }} />
                Welcome to PT Connection
              </h3>
              <p className="text-muted mb-4">{welcomeMessage}</p>
            </header>
          </div>
        </div>
        <div className="row pt-3 align-items-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 ms-auto me-auto">
            <div className="card p-3" style={{ backgroundColor: '#E7E6E6' }}>
              <AuthForm
                key={route.path}
                action={route.path}
                onSignIn={handleSignIn}
                patientId={patientId}
                email={email} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
AuthPage.contextType = AppContext;
