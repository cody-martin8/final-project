require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');

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

app.post('/api/auth/sign-up', (req, res, next) => {
  const { email, password, accountType } = req.body;
  if (!email || !password || !accountType) {
    throw new ClientError(400, 'email, password, and accountType are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("email", "hashedPassword", "accountType")
        values ($1, $2, $3)
        returning "userId", "email", "accountType", "createdAt"
      `;
      const params = [email, hashedPassword, accountType];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "email" = $1
  `;
  const params = [email];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, email };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/patients/:patientId', (req, res, next) => {
  const { userId } = req.user;
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
       and "userId" = $2
  `;
  const params = [patientId, userId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find patient with patientId ${patientId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/activePatients', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select "patientId",
           "firstName",
           "lastName"
      from "patients"
     where "isActive" = 'true'
       and "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/patients', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select "patientId",
           "firstName",
           "lastName",
           "injuryAilment",
           "age",
           "isActive",
           "email"
      from "patients"
     where "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/patients', (req, res) => {
  const { userId } = req.user;
  const { firstName, lastName, patientEmail, age, injuryAilment, notes } = req.body;
  if (!firstName || !lastName || !patientEmail || !age || !injuryAilment) {
    throw new ClientError(400, 'firstName, lastName, patientEmail, age, and injuryAilment are required fields');
  }
  const sql = `
    insert into "patients" ("firstName", "lastName", "email", "age", "injuryAilment", "notes", "isActive", "userId")
    values ($1, $2, $3, $4, $5, $6, 'true', $7)
    returning *
  `;
  const params = [firstName, lastName, patientEmail, age, injuryAilment, notes, userId];
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
  const { userId } = req.user;
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
       and "userId" = $9
     returning *
  `;
  const params = [firstName, lastName, patientEmail, injuryAilment, age, notes, isActive, patientId, userId];
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
  const { userId } = req.user;
  const patientId = Number(req.params.patientId);
  if (!Number.isInteger(patientId) || patientId < 1) {
    throw new ClientError(400, 'patientId must be a positive integer');
  }
  const sql = `
    delete from "patients"
     where "patientId" = $1
       and "userId" = $2
    returning *;
  `;
  const params = [patientId, userId];
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
  const { userId } = req.user;
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
       and "userId" = $2
  `;
  const params = [exerciseId, userId];
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
  const { userId } = req.user;
  const sql = `
    select "exerciseId",
           "name",
           "targetArea",
           "description"
      from "exercises"
     where "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/exercises', (req, res) => {
  const { userId } = req.user;
  const { name, targetArea, description } = req.body;
  if (!name || !targetArea || !description) {
    res.status(400).json({
      error: 'name, targetArea, and description are required fields'
    });
    return;
  }
  const sql = `
    insert into "exercises" ("name", "targetArea", "description", "userId")
    values ($1, $2, $3, $4)
    returning *
  `;
  const params = [name, targetArea, description, userId];
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
  const { userId } = req.user;
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
       and "userId" = $5
     returning *
  `;
  const params = [name, targetArea, description, exerciseId, userId];
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

app.delete('/api/exercises/:exerciseId', (req, res) => {
  const { userId } = req.user;
  const exerciseId = Number(req.params.exerciseId);
  if (!Number.isInteger(exerciseId) || exerciseId < 1) {
    throw new ClientError(400, 'exerciseId must be a positive integer');
  }
  const sql = `
    delete from "exercises"
     where "exerciseId" = $1
       and "userId" = $2
    returning *;
  `;
  const params = [exerciseId, userId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find exercise with exerciseId ${exerciseId}`);
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

app.get('/api/patientExercises/:patientId', (req, res, next) => {
  const { userId } = req.user;
  const patientId = Number(req.params.patientId);
  if (!Number.isInteger(patientId) || patientId < 1) {
    throw new ClientError(400, 'patientId must be a positive integer');
  }
  const sql = `
    select "exerciseId",
           "sets",
           "repetitions",
           "hold",
           "feedback",
           "patientExerciseId"
      from "patientExercises"
     where "patientId" = $1
       and "userId" = $2
  `;
  const params = [patientId, userId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(404, `cannot find patientExercises with patientId ${patientId}`);
      }
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/exercisePatients/:exerciseId', (req, res, next) => {
  const { userId } = req.user;
  const exerciseId = Number(req.params.exerciseId);
  if (!Number.isInteger(exerciseId) || exerciseId < 1) {
    throw new ClientError(400, 'exerciseId must be a positive integer');
  }
  const sql = `
    select "patientId",
           "sets",
           "repetitions",
           "hold",
           "feedback",
           "patientExerciseId"
      from "patientExercises"
     where "exerciseId" = $1
       and "userId" = $2
  `;
  const params = [exerciseId, userId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(404, `cannot find patientExercises with exerciseId ${exerciseId}`);
      }
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/patientExercises/:patientId/:exerciseId', (req, res, next) => {
  const { userId } = req.user;
  const patientId = Number(req.params.patientId);
  const exerciseId = Number(req.params.exerciseId);
  if (!Number.isInteger(patientId) || patientId < 1) {
    throw new ClientError(400, 'patientId must be a positive integer');
  }
  if (!Number.isInteger(exerciseId) || exerciseId < 1) {
    throw new ClientError(400, 'exerciseId must be a positive integer');
  }
  const sql = `
    select "sets",
           "repetitions",
           "hold",
           "feedback",
           "patientId",
           "exerciseId",
           "patientExerciseId"
      from "patientExercises"
     where "patientId" = $1
       and "exerciseId" = $2
       and "userId" = $3
  `;
  const params = [patientId, exerciseId, userId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find patientExercise with patientId ${patientId} and exerciseId ${exerciseId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/patientExercises', (req, res) => {
  const { userId } = req.user;
  const { patientId, exerciseId, repetitions, sets, hold, feedback } = req.body;
  if (!patientId || !exerciseId || !sets) {
    res.status(400).json({
      error: 'patientId, exerciseId, and sets are required fields'
    });
    return;
  }
  const sql = `
    insert into "patientExercises" ("patientId", "exerciseId", "repetitions", "sets", "hold", "feedback", "userId")
    values ($1, $2, $3, $4, $5, $6, $7)
    returning *
  `;
  const params = [patientId, exerciseId, repetitions, sets, hold, feedback, userId];
  db.query(sql, params)
    .then(result => {
      const [patientExercise] = result.rows;
      res.status(201).json(patientExercise);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.patch('/api/patientExercises/:patientExerciseId', (req, res) => {
  const { userId } = req.user;
  const { sets, repetitions, hold } = req.body;
  if (!sets) {
    throw new ClientError(400, 'sets is a required field');
  }
  const patientExerciseId = Number(req.params.patientExerciseId);
  if (!Number.isInteger(patientExerciseId) || patientExerciseId < 1) {
    throw new ClientError(400, 'patientExerciseId must be a positive integer');
  }
  const sql = `
    update "patientExercises"
       set "sets" = $1,
           "repetitions" = $2,
           "hold" = $3
     where "patientExerciseId" = $4
       and "userId" = $5
     returning *
  `;
  const params = [sets, repetitions, hold, patientExerciseId, userId];
  db.query(sql, params)
    .then(result => {
      const [patientExercise] = result.rows;
      if (!patientExercise) {
        res.status(404).json({
          error: `cannot find patientExercise with patientExerciseId ${patientExerciseId}`
        });
        return;
      }
      res.json(patientExercise);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.delete('/api/patientExercises/:patientExerciseId', (req, res) => {
  const { userId } = req.user;
  const patientExerciseId = Number(req.params.patientExerciseId);
  if (!Number.isInteger(patientExerciseId) || patientExerciseId < 1) {
    throw new ClientError(400, 'patientExerciseId must be a positive integer');
  }
  const sql = `
    delete from "patientExercises"
     where "patientExerciseId" = $1
       and "userId" = $2
    returning *;
  `;
  const params = [patientExerciseId, userId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find patientExercise with patientExerciseId ${patientExerciseId}`);
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
