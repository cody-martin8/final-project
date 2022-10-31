require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

app.post('/api/patient-sign-up', (req, res) => {
  const { patientEmail, patientId } = req.body;
  const msg = {
    to: patientEmail,
    from: {
      email: '12martincody@gmail.com',
      name: 'PT Connection'
    },
    subject: 'Account Sign-Up with PT Connection',
    // Upon completion, change below links to reflect domain instead of localhost
    text: `Dear [Patient], Welcome to PT Connection! To register for an account so that you can view your exercises, please follow the link below: http://localhost:3000/#sign-up?patientId=${patientId}&email=${patientEmail} Thank you, PT Connection`,
    html: `<span>Dear Patient,</span><br> <p>Welcome to PT Connection!<br><br> To register for an account so that you can view your exercises, please follow the link below:</p> <span><a href=http://localhost:3000/#sign-up?patientId=${patientId}&email=${patientEmail}>PT Connection Account Sign-Up</a></span><br><br> <span>Thank you,</span><br> <span>PT Connection</span>`
  };
  sgMail
    .send(msg)
    .then(response => {
      // console.log(response[0].statusCode);
      // console.log(response[0].headers);
      res.json(response[0].statusCode);
    })
    .catch(error => {
      console.error(error);
    });
});

app.post('/api/forgot-password', (req, res) => {
  const { email, userId } = req.body.user;
  const msg = {
    to: email,
    from: {
      email: '12martincody@gmail.com',
      name: 'PT Connection'
    },
    subject: 'Password Reset Request',
    text: `Hello [Patient], We have received your request to reset your password. Please follow the link below to change your password: https://localhost:3000/#forgot-password?userId=${userId}&email=${email} If you did not make this request, please ignore this email. Thank you, PT Connection`,
    html: `<span>Hello Patient,</span><br> <p>Thank you for using PT Connection!<br><br> We have received your request to reset your password. Please follow the link below to change your password:</p> <span><a href=https://localhost:3000/#forgot-password?userId=${userId}&email=${email}>Password Reset</a></span><br> <p>If you did not make this request, please ignore this email.</p> <span>Thank you,</span><br> <span>PT Connection</span>`
  };
  sgMail
    .send(msg)
    .then(response => {
      // console.log(response[0].statusCode);
      // console.log(response[0].headers);
      res.json(response[0].statusCode);
    })
    .catch(error => {
      console.error(error);
    });
});

app.post('/api/auth/sign-up', (req, res, next) => {
  const { email, password, accountType, patientId } = req.body;
  if (!email || !password || !accountType) {
    throw new ClientError(400, 'email, password, and accountType are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("email", "hashedPassword", "accountType", "patientId")
        values ($1, $2, $3, $4)
        returning "userId", "email", "accountType", "patientId", "createdAt"
      `;
      const params = [email, hashedPassword, accountType, patientId];
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
           "hashedPassword",
           "accountType",
           "patientId"
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
      const { userId, hashedPassword, accountType, patientId } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, email, accountType, patientId };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.get('/api/users/:email', (req, res, next) => {
  const email = req.params.email;
  if (!email) {
    throw new ClientError(400, 'email is a required field');
  }
  const sql = `
    select "userId",
           "email"
      from "users"
     where "email" = $1
  `;
  const params = [email];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.patch('/api/users/:userId', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ClientError(400, 'email and password are required fields');
  }
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId < 1) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        update "users"
           set "hashedPassword" = $1
         where "userId" = $2
           and "email" = $3
        returning "userId", "email"
      `;
      const params = [hashedPassword, userId, email];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

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
  let userId = req.get('user-id');
  if (!userId) {
    userId = req.user.userId;
  }
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

app.delete('/api/exercises/:exerciseId', (req, res) => {
  const exerciseId = Number(req.params.exerciseId);
  if (!Number.isInteger(exerciseId) || exerciseId < 1) {
    throw new ClientError(400, 'exerciseId must be a positive integer');
  }
  const sql = `
    delete from "exercises"
     where "exerciseId" = $1
    returning *;
  `;
  const params = [exerciseId];
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
           "patientExerciseId",
           "userId"
      from "patientExercises"
     where "patientId" = $1
  `;
  const params = [patientId];
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
  `;
  const params = [exerciseId];
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
  `;
  const params = [patientId, exerciseId];
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
  const { patientId, exerciseId, repetitions, sets, hold } = req.body;
  if (!patientId || !exerciseId || !sets) {
    res.status(400).json({
      error: 'patientId, exerciseId, and sets are required fields'
    });
    return;
  }
  const sql = `
    insert into "patientExercises" ("patientId", "exerciseId", "repetitions", "sets", "hold", "userId")
    values ($1, $2, $3, $4, $5, $6)
    returning *
  `;
  const params = [patientId, exerciseId, repetitions, sets, hold, userId];
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
  const { sets, repetitions, hold, feedback } = req.body;
  const patientExerciseId = Number(req.params.patientExerciseId);
  if (!Number.isInteger(patientExerciseId) || patientExerciseId < 1) {
    throw new ClientError(400, 'patientExerciseId must be a positive integer');
  }
  const sql = `
    update "patientExercises"
       set "sets" = $1,
           "repetitions" = $2,
           "hold" = $3,
           "feedback" = $4
     where "patientExerciseId" = $5
     returning *
  `;
  const params = [sets, repetitions, hold, feedback, patientExerciseId];
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
  const patientExerciseId = Number(req.params.patientExerciseId);
  if (!Number.isInteger(patientExerciseId) || patientExerciseId < 1) {
    throw new ClientError(400, 'patientExerciseId must be a positive integer');
  }
  const sql = `
    delete from "patientExercises"
     where "patientExerciseId" = $1
    returning *;
  `;
  const params = [patientExerciseId];
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
