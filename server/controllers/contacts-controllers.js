const fs = require("fs");
const mongoose = require("mongoose");
const User = require("../models/user");
const Contact = require("../models/contacts");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const getAllContacts = async (req, res, next) => {
  let contact;
  try {
    contact = await Contact.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find contact",
      500
    );

    return next(error);
  }

  if (contact.length === 0) {
    throw new HttpError("Could not find any contacts.", 404);
  }

  res.json({ contact });
};

const getContactById = async (req, res, next) => {
  const contactId = req.params.pid;

  let contact;
  try {
    contact = await Contact.findById(contactId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find contact",
      500
    );

    return next(error);
  }

  if (!contact) {
    const error = new HttpError(
      "Could not find a contact for the provided id.",
      404
    );

    return next(error);
  }

  res.json({ contact: contact.toObject({ getters: true }) });
};

const getContactsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithContacts;

  try {
    userWithContacts = await User.findById(userId).populate("contacts");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find contact",
      500
    );

    return next(error);
  }

  if (!userWithContacts || userWithContacts.contacts.length === 0) {
    return next(
      new HttpError("Could not find contacts for the provided user id.", 404)
    );
  }

  res.json({
    contacts: userWithContacts.contacts.map((contact) =>
      contact.toObject({ getters: true })
    ),
  });
};

const createContact = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }
  const { title, description, phone, address, creator } = req.body;
  const createdContact = new Contact({
    title,
    description,
    phone,
    imageUrl: req.file.path,
    address,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(
      new HttpError("Creating a contact failed, please try again", 500)
    );
  }

  if (!user) {
    return next(new HttpError("Could not find the user for given id.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdContact.save({ session: sess });
    user.contacts.push(createdContact);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("Could not create contact", 500);
    return next(err);
  }

  res.status(201).json({ contact: createdContact });
};

const updateContact = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const { title, description, phone, address } = req.body;
  const contactId = req.params.cid;

  let contact;
  try {
    contact = await Contact.findById(contactId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find contact",
      500
    );

    return next(error);
  }

  if (contact.creator.toString() !== req.userData.userId) {
    const error = new HttpError("Could not edit the contact.", 401);

    return next(error);
  }

  contact.title = title;
  contact.description = description;
  contact.address = address;
  contact.phone = phone;

  try {
    await contact.save();
  } catch (error) {
    const err = new HttpError("Could not update contact", 500);
    return next(err);
  }

  res.status(200).json({ contact: contact.toObject({ getters: true }) });
};

const deleteContact = async (req, res, next) => {
  const contactId = req.params.cid;

  let contact;
  try {
    contact = await Contact.findById(contactId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find contact",
      500
    );

    return next(error);
  }

  if (!contact) {
    return next(new HttpError("Could not find the contact for given id.", 404));
  }

  if (contact.creator.id !== req.userData.userId) {
    const error = new HttpError("Could not delete the contact.", 401);

    return next(error);
  }

  const imagePath = contact.imageUrl;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await contact.remove({ session: sess });
    contact.creator.contacts.pull(contact);
    await contact.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("Could not delete contact", 500);

    return next(err);
  }
  fs.unlink(imagePath, (error) => console.log(error));

  res.status(200).json({ message: "Deleted contact" });
};

exports.getContactById = getContactById;
exports.getContactsByUserId = getContactsByUserId;
exports.createContact = createContact;
exports.getAllContacts = getAllContacts;
exports.updateContact = updateContact;
exports.deleteContact = deleteContact;
