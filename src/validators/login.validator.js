const { body } = require("express-validator");

module.exports = [
  body("email")
    .notEmpty()
    .withMessage("Missing email")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Misisng password"),
];
