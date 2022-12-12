const { body } = require("express-validator");

module.exports = [
  body("fullname").trim().notEmpty().withMessage("Missing full name"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Missing email")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").trim().notEmpty().withMessage("Missing password"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Missing phone number")
    .isInt("Invalid phone number"),
];
