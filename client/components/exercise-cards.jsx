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
  const { name, targetArea } = props.exercise;

  let exerciseCard = targetArea;
  if (location.hash === '#patientProfile') {
    exerciseCard = targetArea;
    // {/* Replace targetArea with sets/reps */ }
  }

  return (
    <div className="card mx-auto col-lg-7 col-xl-7 col-xxl-6">
      <div className="card-body ms-2 pb-2 d-flex justify-content-between">
        <h5>{name}</h5>
        <h6 className="lead d-none d-md-block ms-4 pt-0">{ exerciseCard }</h6>
      </div>
    </div>
  );
}
