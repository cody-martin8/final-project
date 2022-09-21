import React from 'react';
import Navbar from './components/navbar';
import Home from './pages/home';
import NotFound from './pages/not-found';
import NewPatientForm from './pages/new-patient';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
    this.addPatient = this.addPatient.bind(this);
  }

  componentDidMount() {
    addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  addPatient(newPatient) {
    fetch('/api/patients', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(newPatient)
    })
      .then(res => res.json());
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'newPatient') {
      return <NewPatientForm onSubmit={this.addPatient}/>;
    }
    return <NotFound />;
  }

  render() {
    return (
      <>
        <Navbar />
        { this.renderPage() }
      </>
    );
  }
}
