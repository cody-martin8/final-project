import React from 'react';

export default function ExerciseCards(props) {

  return (
    <ul>
      {
        props.exercises.map(exercise => (
          <li key={exercise.exerciseId} className={exercise.view}>
            <Exercise exercise={exercise} />
          </li>
        ))
      }
    </ul>
  );
}

function Exercise(props) {
  const { exerciseId, name, targetArea } = props.exercise;

  let cardExtra = targetArea;
  let cardLink = `#exerciseProfile?exerciseId=${exerciseId}`;
  if (location.hash === '#patientProfile') {
    cardExtra = targetArea;
    // {/* Replace targetArea with sets/reps */ }
  }
  if (location.hash === '#assignExercise') {
    cardLink = '#assignExercise';
  }

  // Create an onClick listener that calls this.handleClick (if location.hash = '#assignExercise)
  // inside handleClick, change state of selectedExercise to include event.target
  // Once this is successfully implemented, render patient's exercise cards on profile from patientExercises

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
