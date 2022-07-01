const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    if (!token) {
      const error = new HttpError("Authorization failed.", 401);

      return next(error);
    }

    const decodedToken = jwt.verify(token, "secret");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    const err = new HttpError("Authorization failed", 401);

    return next(err);
  }
};

module.exports = checkAuth;
