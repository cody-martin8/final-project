import React from 'react';
import { parseRoute } from '../lib';

export default function ExerciseCards(props) {
  const route = parseRoute(window.location.hash);

  return (
    <ul>
      {
        props.exercises.map(exercise => (
          <li key={exercise.exerciseId} className={exercise.view}>
            <Exercise exercise={exercise} route={route} />
          </li>
        ))
      }
    </ul>
  );
}

function Exercise(props) {
  const { exerciseId, name, targetArea } = props.exercise;
  const patientId = props.route.params.get('patientId');

  let cardExtra = targetArea;
  let cardLink = `#exerciseProfile?exerciseId=${exerciseId}`;
  if (props.route.path === 'patientProfile') {
    cardExtra = targetArea;
    // {/* Replace targetArea with sets/reps */ }
  }
  if (props.route.path === 'chooseExercise') {
    cardLink = `#assignExercise?patientId=${patientId}&exerciseId=${exerciseId}`;
  }

  // Render patient's exercise cards on profile from patientExercises

  return (
    <div className="card mx-auto col-lg-7 col-xl-7 col-xxl-6">
      <a href={cardLink} className="text-decoration-none text-dark">
        <div className="card-body ms-2 pb-2 d-flex justify-content-between">
          <h5>{ name }</h5>
          <h6 className="lead d-none d-md-block ms-4 pt-0">{ cardExtra }</h6>
        </div>
      </a>
    </div>
  );
}
