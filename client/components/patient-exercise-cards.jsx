import React from 'react';

export default function PatientExerciseCards(props) {
  const exercises = props.exercises;

  if (exercises.length === 0) {
    return (
      <div className="row mt-5 justify-content-center">
        <div className="card col-12 col-lg-7 col-xl-7 col-xxl-6 lead d-block d-flex justify-content-center" style={{ backgroundColor: 'rgb(226, 226, 226)' }}>
          <div className="card-body text-center">
            No exercises have been assigned by your physical therapist yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row mb-4 justify-content-center">
        <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-5 lead px-1">
          Click each exercise to view the description!
        </div>
      </div>
      <div className="row mb-5">
        <ul>
          {
            exercises.map(exercise => (
              <li key={exercise.exerciseId} className="d-flex justify-content-center mb-3 mx-auto">
                <Exercise exercise={exercise} patientExercises={props.patientExercises} />
              </li>
            ))
          }
        </ul>
      </div>
    </>
  );
}

function Exercise(props) {
  const { exerciseId, name } = props.exercise;

  let patientExercise;
  for (let i = 0; i < props.patientExercises.length; i++) {
    if (exerciseId === props.patientExercises[i].exerciseId) {
      patientExercise = props.patientExercises[i];
    }
  }
  const { sets, repetitions, hold, patientExerciseId } = patientExercise;
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
  const setsReps = `${cardSets}${cardReps}${cardHold}`;
  const cardLink = `#exerciseDetails?exerciseId=${exerciseId}&exercise=${setsReps}&patientExerciseId=${patientExerciseId}`;

  return (
    <div className="card exercise-card col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-5">
      <a href={cardLink} className="text-decoration-none text-dark">
        <div className="card-body pb-2">
          <h4 className="text-center">{name}</h4>
          <h6 className="lead pt-0 text-center">{setsReps}</h6>
        </div>
      </a>
    </div>
  );
}
