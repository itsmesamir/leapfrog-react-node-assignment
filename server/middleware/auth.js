const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const error = new HttpError("Authorization failed.", 401);

      return next(error);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    const err = new HttpError("Authorization failed", 401);

    return next(err);
  }
};

module.exports = checkAuth;
