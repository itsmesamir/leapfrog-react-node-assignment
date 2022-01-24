const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Samir Alam',
    email: 'samir@test.com',
    password: 'helloworld'
  },
  {
    id: 'u2',
    name: 'Nabin Khadka',
    email: 'samir@test.com',
    password: 'nabin23'
  },
  {
    id: 'u2',
    name: 'Ashwin Dangal',
    email: 'samir@test.com',
    password: 'aswin23'
  }
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({user: createdUser});
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user.', 401);
  }

  res.json({message: 'Logged in successfully!'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;