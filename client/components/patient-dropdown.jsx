import React from 'react';

export default function PatientDropdown(props) {

  return (
    <ul className="dropdown-menu" aria-labelledby="patients">
      {
        props.patients.map(patient => (
          <li key={patient.patientId}>
            <Patient patient={patient} exerciseId={props.exerciseId} />
          </li>
        ))
      }
    </ul>
  );
}

function Patient(props) {
  const { firstName, lastName, patientId } = props.patient;
  const name = `${firstName} ${lastName}`;
  const dropdownLink = `#assignExercise?patientId=${patientId}&exerciseId=${props.exerciseId}&pathway=1`;

  return (
    <a href={dropdownLink} className="dropdown-item">{name}</a>
  );
}
