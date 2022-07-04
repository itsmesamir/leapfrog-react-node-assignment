const User = require("../models/user");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user",
      500
    );

    return next(error);
  }

  if (users.length === 0) {
    return new HttpError("Could not find any users.", 404);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Sign up failed please try again", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("Could not create user, email already exists.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError("Could not create user, please try again", 500);

    return next(err);
  }

  const createdUser = new User({
    name,
    email,
    imageUrl: req.file.path,
    password: hashedPassword,
    contacts: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError("Could not sign up", 500);

    return next(err);
  }

  let token;

  try {
    token = jsonWebToken.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new HttpError("Could not sign up", 500);

    return next(err);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Sign up failed please try again", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentails, could not log in.", 401));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    const err = new HttpError(
      "Something went wrong, please check your credentials.",
      500
    );

    return next(err);
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentails, could not log in.", 401));
  }

  let token;

  try {
    token = jsonWebToken.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new HttpError("Could not login up", 500);

    return next(err);
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
