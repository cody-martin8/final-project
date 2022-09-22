require('dotenv/config');
const pg = require('pg');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.get('/api/patients', (req, res, next) => {
  const sql = `
    select "patientId",
           "firstName",
           "lastName",
           "isActive",
           "email"
      from "patients"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/patients', (req, res) => {
  const { firstName, lastName, patientEmail, age, injuryAilment, notes } = req.body;
  if (!firstName || !lastName || !patientEmail || !age || !injuryAilment) {
    res.status(400).json({
      error: 'firstName, lastName, patientEmail, age, and injuryAilment are required fields'
    });
    return;
  }
  const sql = `
    insert into "patients" ("firstName", "lastName", "email", "age", "injuryAilment", "notes", "isActive")
    values ($1, $2, $3, $4, $5, $6, 'true')
    returning *
  `;
  const params = [firstName, lastName, patientEmail, age, injuryAilment, notes];
  db.query(sql, params)
    .then(result => {
      const [patient] = result.rows;
      res.status(201).json(patient);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.post('/api/exercises', (req, res) => {
  const { name, targetArea, description } = req.body;
  if (!name || !targetArea || !description) {
    res.status(400).json({
      error: 'name, targetArea, and description are required fields'
    });
    return;
  }
  const sql = `
    insert into "exercises" ("name", "targetArea", "description")
    values ($1, $2, $3)
    returning *
  `;
  const params = [name, targetArea, description];
  db.query(sql, params)
    .then(result => {
      const [exercise] = result.rows;
      res.status(201).json(exercise);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
