import React from 'react';
import jwtDecode from 'jwt-decode';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import Navbar from './components/navbar';
import Home from './pages/home';
import Auth from './pages/auth';
import YourExercises from './pages/your-exercises';
import NewPatientForm from './pages/new-patient';
import NewExerciseForm from './pages/new-exercise';
import PatientProfile from './pages/patient-profile';
import ExerciseProfile from './pages/exercise-profile';
import ChooseExercise from './pages/choose-exercise';
import AssignExercise from './pages/assign-exercise';
import ExerciseAssignment from './pages/exercise-assignment';
import NotFound from './pages/not-found';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      token: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    addEventListener('hashchange', event => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('pt-connection-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, token, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('pt-connection-jwt', token);
    this.setState({ user, token });
  }

  handleSignOut() {
    window.localStorage.removeItem('pt-connection-jwt');
    this.setState({ user: null, token: null });
  }

  renderPage() {
    const { path, params } = this.state.route;
    if (path === '') {
      return <Home />;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <Auth />;
    }
    if (path === 'exercises') {
      return <YourExercises />;
    }
    if (path === 'newPatient') {
      const patientId = params.get('patientId');
      return <NewPatientForm patientId={patientId} />;
    }
    if (path === 'newExercise') {
      const exerciseId = params.get('exerciseId');
      return <NewExerciseForm exerciseId={exerciseId} />;
    }
    if (path === 'patientProfile') {
      const patientId = params.get('patientId');
      return <PatientProfile patientId={patientId} />;
    }
    if (path === 'exerciseProfile') {
      const exerciseId = params.get('exerciseId');
      return <ExerciseProfile exerciseId={exerciseId} />;
    }
    if (path === 'chooseExercise') {
      const patientId = params.get('patientId');
      return <ChooseExercise patientId={patientId} />;
    }
    if (path === 'assignExercise') {
      const patientId = params.get('patientId');
      const exerciseId = params.get('exerciseId');
      const patientExerciseId = params.get('patientExerciseId');
      const exercise = params.get('exercise');
      return <AssignExercise patientId={patientId} exerciseId={exerciseId} patientExerciseId={patientExerciseId} exercise={exercise} />;
    }
    if (path === 'exerciseAssignment') {
      const patientId = params.get('patientId');
      const exerciseId = params.get('exerciseId');
      const exercise = params.get('exercise');
      return <ExerciseAssignment patientId={patientId} exerciseId={exerciseId} exercise={exercise} />;
    }
    return <NotFound />;
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, token, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, token, route, handleSignIn, handleSignOut };
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
