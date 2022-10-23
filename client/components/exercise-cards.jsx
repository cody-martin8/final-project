import React from 'react';
import { parseRoute } from '../lib';

export default function ExerciseCards(props) {
  const route = parseRoute(window.location.hash);

  if (route.path === 'patientProfile' && props.exercises.length === 0) {
    return (
      <div className="card col-12 col-lg-7 col-xl-7 col-xxl-6 lead d-block d-flex justify-content-center">
        <div className="card-body">
          No exercises have been assigned to this patient yet. You can add exercises by clicking &quot;Add Exercise&quot; above.
        </div>
      </div>
    );
  }

  if (route.path === 'exercises' && props.exercises.length === 0) {
    return (
      <div className="card col-12 col-lg-7 col-xl-7 col-xxl-6 lead d-block d-flex justify-content-center">
        <div className="card-body">
          No exercises have been created on your account yet. You can create exercises by clicking &quot;New Exercise&quot; above.
        </div>
      </div>
    );
  }

  return (
    <ul>
      {
        props.exercises.map(exercise => (
          <li key={exercise.exerciseId} className={exercise.view}>
            <Exercise exercise={exercise} route={route} patientExercises={props.patientExercises} />
          </li>
        ))
      }
    </ul>
  );
}

function Exercise(props) {
  const { exerciseId, name, targetArea } = props.exercise;
  const patientId = props.route.params.get('patientId');

  let cardLink = `#exerciseProfile?exerciseId=${exerciseId}`;
  if (props.route.path === 'chooseExercise') {
    cardLink = `#assignExercise?patientId=${patientId}&exerciseId=${exerciseId}`;
  }

  let cardExtra = targetArea;
  if (props.route.path === 'patientProfile') {
    let patientExercise;
    for (let i = 0; i < props.patientExercises.length; i++) {
      if (exerciseId === props.patientExercises[i].exerciseId) {
        patientExercise = props.patientExercises[i];
      }
    }
    const { sets, repetitions, hold } = patientExercise;
    let cardSets, cardReps, cardHold;
    sets === 0
      ? cardSets = ''
      : sets === 1
        ? cardSets = `${sets} set `
        : cardSets = `${sets} sets `;
    repetitions === 0
      ? cardReps = ''
      : repetitions === 1
        ? cardReps = `/ ${repetitions} rep `
        : cardReps = `/ ${repetitions} reps `;
    hold === 0
      ? cardHold = ''
      : cardHold = `/ ${hold} sec hold `;
    cardExtra = `${cardSets}${cardReps}${cardHold}`;
    cardLink = `#exerciseAssignment?patientId=${patientId}&exerciseId=${exerciseId}&exercise=${cardExtra}`;
  }

  return (
    <div className="card mx-auto col-md-10 col-lg-8 col-xl-7 col-xxl-6">
      <a href={cardLink} className="text-decoration-none text-dark">
        <div className="card-body pb-2 d-flex justify-content-between">
          <h5>{ name }</h5>
          <h6 className="lead d-none d-sm-block ms-4 pt-0">{ cardExtra }</h6>
        </div>
      </a>
    </div>
  );
}
