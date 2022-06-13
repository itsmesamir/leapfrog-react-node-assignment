const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  password: { type: String, required: true, minlength: 4 },
  contacts: [{ type: mongoose.Types.ObjectId, required: true, ref: "Contact" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
