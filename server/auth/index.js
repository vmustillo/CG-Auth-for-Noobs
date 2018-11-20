const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection.js');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]*$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required()
});

router.get('/', (req, res) => {
  res.json({
    message: 'Auth Router'
  });
});

//POST /auth/signup
router.post('/signup', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    // make sure username is unique
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        // if user is undefined, username is not in DB
        if (user) {
          // there is already user in DB with this username
          const error = new Error(
            'This username already exists. Please enter a new username'
          );
          res.status(409);
          next(error);
        } else {
          // hash password
          // insert user with hashed password
          bcrypt.hash(req.body.password, 12).then(hashedPassword => {
            const newUser = {
              username: req.body.username,
              password: hashedPassword
            };
            users.insert(newUser).then(insertedUser => {
              delete insertedUser.password;
              res.json(insertedUser);
            });
          });
        }
      });
  } else {
    res.status(422);
    next(result.error);
  }
});

function respondError422(res, next) {
  res.status(422);
  const error = new Error('Unable to login');
  next(error);
}

router.post('/login', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        if (user) {
          // found user in db
          bcrypt.compare(req.body.password, user.password).then(result => {
            if (result) {
              // they sent the correct password
              const payload = {
                _id: user._id,
                username: user.username
              };
              jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                {
                  expiresIn: '1d'
                },
                (err, token) => {
                  if (err) {
                    respondError422(res, next);
                  } else {
                    res.json({
                      token
                    });
                  }
                }
              );
            } else {
              respondError422(res, next);
            }
          });
        } else {
          respondError422(res, next);
        }
      });
  } else {
    respondError422(res, next);
  }
});

module.exports = router;
