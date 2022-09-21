import React from 'react';
import HelloWorld from '../components/hello-world';

export default function Home(props) {
  return (
    <div>
      <HelloWorld />
      <a href="#newPatient">Click Me!</a>
    </div>
  );
}
