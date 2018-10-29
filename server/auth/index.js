const express = require('express');
const Joi = require('joi');
const router = express.Router();

const db = require('../db/connection.js');
const users = db.get('users');
users.index('username');

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]*$)/)
    .min(8)
    .max(30)
    .required(),
  password: Joi.string()
    .min(10)
    .required()
});

router.get('/', (req, res) => {
  res.json({
    message: 'Auth Router'
  });
});

//POST /auth/signup
router.post('/signup', (req, res) => {
  console.log('body', req.body);
  const result = Joi.validate(req.body, schema);

  res.json({
    result
  });
});

module.exports = router;
