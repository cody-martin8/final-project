import React from 'react';
import ExerciseCards from '../components/exercise-cards';

export default function YourExercises(props) {

  return (
    <div className="container w-75">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 mb-5 mb-lg-4 p-0 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <h1 className="me-3">Your Exercises</h1>
            <i className="fa-regular fa-folder-open fa-2xl mb-1"></i>
          </div>
          <a href="#newExercise" className="btn my-2" style={{ backgroundColor: '#282A3E', color: 'white' }}>New Exercise</a>
        </div>
      </div>
      <ExerciseCards />
    </div>
  );
}
