import React from 'react';
import AppContext from './lib/app-context';
import Navbar from './components/navbar';
import Home from './pages/home';
import YourExercises from './pages/your-exercises';
import NewPatientForm from './pages/new-patient';
import NewExerciseForm from './pages/new-exercise';
import PatientProfile from './pages/patient-profile';
import ExerciseProfile from './pages/exercise-profile';
import ChooseExercise from './pages/choose-exercise';
import NotFound from './pages/not-found';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
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
      return <NewPatientForm patientId={patientId} />;
    }
    if (route.path === 'newExercise') {
      const exerciseId = route.params.get('exerciseId');
      return <NewExerciseForm exerciseId={exerciseId} />;
    }
    if (route.path === 'patientProfile') {
      const patientId = route.params.get('patientId');
      return <PatientProfile patientId={patientId} />;
    }
    if (route.path === 'exerciseProfile') {
      const exerciseId = route.params.get('exerciseId');
      return <ExerciseProfile exerciseId={exerciseId} />;
    }
    if (route.path === 'chooseExercise') {
      const patientId = route.params.get('patientId');
      return <ChooseExercise patientId={patientId} />;
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
