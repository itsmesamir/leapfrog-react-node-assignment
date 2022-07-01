const express = require("express");
const { check } = require("express-validator");

const contactsControllers = require("../controllers/contacts-controllers");
const checkAuth = require("../middleware/auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:pid", contactsControllers.getContactById);

router.get("/user/:uid", contactsControllers.getContactsByUserId);

router.get("/", contactsControllers.getAllContacts);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("imageUrl"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
    check("phone").not().isEmpty(),
  ],
  contactsControllers.createContact
);

router.put(
  "/:cid",
  [
    check("title").not().isEmpty(),
    check("address").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("phone").isLength({ min: 10 }),
  ],
  contactsControllers.updateContact
);

router.delete("/:cid", contactsControllers.deleteContact);

module.exports = router;
