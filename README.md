# pt-connection

A full stack JavaScript application for physical therapists who want to digitally communicate at-home exercises to their patients.

## Why I Built This

As someone who went through physical therapy and was headed into the field as a career, patient access to assigned exercises was a need I thought should be addressed. Exercise printouts and/or emails were easily lost in between physical therapy sessions.

## Technologies Used

- React.js
- Webpack
- Bootstrap 5
- SendGrid Email API - [Documentation]
- Node.js
- Express.js
- PostgreSQL
- HTML5
- CSS3
- JavaScript ES6
- Dokku

## Live Demo

Try this application live at - https://pt-connection.cmartin.dev

## Features

- Physical Therapists can create a patient profile
- Physical Therapists can create an exercise profile
- Physical Therapists can review patient profiles
- Physical Therapists can review exercise profiles
- Physical Therapists can update patient profiles
- Physical Therapists can update exercise profiles
- Physical Therapists can delete patient profiles
- Physical Therapists can delete exercises profiles
- Physical Therapists can assign exercises to a patient
- Physical Therapists can update assigned exercises
- Physical Therapists remove assigned exercises from a patient
- Patients can review assigned exercises
- Patients can create feedback on assigned exercises
- Patients can update/delete feedback on assigned exercises
- Physical Therapists can review exercise feedback from patients

## Preview

![PT Connection - Physical Therapist]

![PT Connection - Patient]

## Stretch Features

I would like to implement the following:

- Physical therapist and patient can exchange messages regarding assigned exercises.
-

## Development

### System Requirements

- Node.js 18 or higher
- NPM 8 or higher
- PostgreSQL 8 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/cody-martin8/final-project
    cd final-project
    ```

2. Install all dependencies with NPM.

    ```shell
    npm install
    ```

3. Import the example database to PostgreSQL.

    ```shell
    npm run db:import
    ```

4. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
[Documentation]: https://docs.sendgrid.com/for-developers
