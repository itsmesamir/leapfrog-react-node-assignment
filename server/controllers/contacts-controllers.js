const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

const DUMMY_CONTACTS = [
  {
    id: "c1",
    title: "Itahari",
    description: "One of the most famous contact in Nepal.",
    imageUrl: "https://www.peoplecontact.com.co/images/peoplecontact-1.png",
    phone: "9810456210",
    address: "Itahari, Sunsari",
    creator: "u1",
  },
  {
    id: "c2",
    title: "Biratnagar",
    description: "One of the most famous contact in Nepal.",
    imageUrl: "https://www.peoplecontact.com.co/images/peoplecontact-1.png",
    phone: "9810456210",
    address: "Itahari, Sunsari",
    creator: "u2",
  },
  {
    id: "c3",
    title: "Dharan",
    description: "One of the most famous contact in Nepal.",
    imageUrl: "https://www.peoplecontact.com.co/images/peoplecontact-1.png",
    phone: "9810456210",
    address: "Itahari, Sunsari",
    creator: "u1",
  },
];

const getAllContacts = (req, res, next) => {

  let allContacts = [];

 DUMMY_CONTACTS.forEach(contact => {
    allContacts.push(contact);
  });

  if (DUMMY_CONTACTS.length === 0) {
    throw new HttpError("Could not find any contacts.", 404);
  }
  
  res.json({ allContacts });

};
const getContactById = (req, res, next) => {
  const contactId = req.params.pid;

  const contact = DUMMY_CONTACTS.find((p) => {
    return p.id === contactId;
  });

  if (!contact) {
    throw new HttpError("Could not find a contact for the provided id.", 404);
  }

  res.json({ contact });
};

const getContactByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const contact = DUMMY_CONTACTS.find((p) => {
    return p.creator === userId;
  });

  if (!contact) {
    return next(
      new HttpError("Could not find a contact for the provided user id.", 404)
    );
  }

  res.json({ contact });
};

const createContact = (req, res, next) => {
  const { title, description, phone, address, creator } = req.body;
  const createdContact = {
    id: uuid(),
    title,
    description,
    phone,
    address,
    creator,
  };

  DUMMY_CONTACTS.push(createdContact);

  res.status(201).json({ contact: createdContact });
};

exports.getContactById = getContactById;
exports.getContactByUserId = getContactByUserId;
exports.createContact = createContact;
exports.getAllContacts = getAllContacts;
