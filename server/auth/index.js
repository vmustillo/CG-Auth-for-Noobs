const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const router = express.Router();

const db = require('../db/connection.js');
const users = db.get('users');
users.createIndex('username', { unique: true });

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
    next(result.error);
  }
});

module.exports = router;
