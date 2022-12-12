const { body } = require("express-validator");

module.exports = [
  body("fullname").notEmpty().withMessage("Missing fullname"),
  body("address").notEmpty().withMessage("Missing address"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Missing phone number")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("email")
    .notEmpty()
    .withMessage("Missing email")
    .isEmail()
    .withMessage("Invalid email"),
];
