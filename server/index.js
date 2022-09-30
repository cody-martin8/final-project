require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
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

app.get('/api/patients/:patientId', (req, res, next) => {
  const patientId = Number(req.params.patientId);
  if (!Number.isInteger(patientId) || patientId < 1) {
    throw new ClientError(400, 'patientId must be a positive integer');
  }
  const sql = `
    select "patientId",
           "firstName",
           "lastName",
           "email",
           "age",
           "injuryAilment",
           "notes",
           "isActive"
      from "patients"
     where "patientId" = $1
  `;
  const params = [patientId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find patient with patientId ${patientId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/patients', (req, res, next) => {
  const sql = `
    select "patientId",
           "firstName",
           "lastName",
           "injuryAilment",
           "age",
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
    throw new ClientError(400, 'firstName, lastName, patientEmail, age, and injuryAilment are required fields');
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

app.patch('/api/patients/:patientId', (req, res) => {
  const { firstName, lastName, patientEmail, age, injuryAilment, notes, isActive } = req.body;
  if (!firstName || !lastName || !patientEmail || !age || !injuryAilment) {
    throw new ClientError(400, 'firstName, lastName, patientEmail, age, and injuryAilment are required fields');
  }
  if (typeof isActive !== 'boolean') {
    throw new ClientError(400, 'isActive (boolean) is a required field');
  }
  const patientId = Number(req.params.patientId);
  if (!Number.isInteger(patientId) || patientId < 1) {
    throw new ClientError(400, 'patientId must be a positive integer');
  }
  const sql = `
    update "patients"
       set "firstName" = $1,
           "lastName" = $2,
           "email" = $3,
           "injuryAilment" = $4,
           "age" = $5,
           "notes" = $6,
           "isActive" = $7
     where "patientId" = $8
     returning *
  `;
  const params = [firstName, lastName, patientEmail, injuryAilment, age, notes, isActive, patientId];
  db.query(sql, params)
    .then(result => {
      const [patient] = result.rows;
      if (!patient) {
        res.status(404).json({
          error: `cannot find patient with patientId ${patientId}`
        });
        return;
      }
      res.json(patient);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.delete('/api/patients/:patientId', (req, res) => {
  const patientId = Number(req.params.patientId);
  if (!Number.isInteger(patientId) || patientId < 1) {
    throw new ClientError(400, 'patientId must be a positive integer');
  }
  const sql = `
    delete from "patients"
     where "patientId" = $1
    returning *;
  `;
  const params = [patientId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find patient with patientId ${patientId}`);
      }
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.get('/api/exercises/:exerciseId', (req, res, next) => {
  const exerciseId = Number(req.params.exerciseId);
  if (!exerciseId) {
    throw new ClientError(400, 'exerciseId must be a positive integer');
  }
  const sql = `
    select "exerciseId",
           "name",
           "targetArea",
           "description"
      from "exercises"
     where "exerciseId" = $1
  `;
  const params = [exerciseId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find exercise with exerciseId ${exerciseId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/exercises', (req, res, next) => {
  const sql = `
    select "exerciseId",
           "name",
           "targetArea",
           "description"
      from "exercises"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
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

app.patch('/api/exercises/:exerciseId', (req, res) => {
  const { name, targetArea, description } = req.body;
  if (!name || !targetArea || !description) {
    throw new ClientError(400, 'name, targetArea, and description are required fields');
  }
  const exerciseId = Number(req.params.exerciseId);
  if (!Number.isInteger(exerciseId) || exerciseId < 1) {
    throw new ClientError(400, 'exerciseId must be a positive integer');
  }
  const sql = `
    update "exercises"
       set "name" = $1,
           "targetArea" = $2,
           "description" = $3
     where "exerciseId" = $4
     returning *
  `;
  const params = [name, targetArea, description, exerciseId];
  db.query(sql, params)
    .then(result => {
      const [exercise] = result.rows;
      if (!exercise) {
        res.status(404).json({
          error: `cannot find exercise with exerciseId ${exerciseId}`
        });
        return;
      }
      res.json(exercise);
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
