const express = require("express");
const bodyParser = require("body-parser");

const contactsRoutes = require("./routes/contacts-route");
const userRoutes = require("./routes/users-route");
const HttpError = require("./models/http-error");

const app = express();
app.use(bodyParser.json());
app.use("/api/contacts", contactsRoutes);
app.use('/api/users', userRoutes )

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
