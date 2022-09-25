import React from 'react';
import AppContext from './lib/app-context';
import Navbar from './components/navbar';
import Home from './pages/home';
import YourExercises from './pages/your-exercises';
import NewPatientForm from './pages/new-patient';
import NewExerciseForm from './pages/new-exercise';
import PatientProfile from './pages/patient-profile';
import ExerciseProfile from './pages/exercise-profile';
import NotFound from './pages/not-found';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      route: parseRoute(window.location.hash),
      currentPatient: null
    };
    this.addPatient = this.addPatient.bind(this);
    this.addExercise = this.addExercise.bind(this);
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
      .then(res => {
        location.hash = '#';
      });
  }

  addExercise(newExercise) {
    fetch('/api/exercises', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(newExercise)
    })
      .then(res => {
        location.hash = '#exercises';
      });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'exercises') {
      return <YourExercises />;
    }
    if (route.path === 'newPatient') {
      const patientId = route.params.get('patientId');
      return <NewPatientForm patientId={patientId} onSubmit={this.addPatient}/>;
    }
    if (route.path === 'newExercise') {
      return <NewExerciseForm onSubmit={this.addExercise} />;
    }
    if (route.path === 'patientProfile') {
      const patientId = route.params.get('patientId');
      return <PatientProfile patientId={patientId} />;
    }
    if (route.path === 'exerciseProfile') {
      const exerciseId = route.params.get('exerciseId');
      return <ExerciseProfile exerciseId={exerciseId} />;
    }
    return <NotFound />;
  }

  render() {
    const { user, route } = this.state;
    const contextValue = { user, route };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <Navbar />
          { this.renderPage() }
        </>
      </AppContext.Provider>
    );
  }
}
