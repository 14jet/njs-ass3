const { body } = require("express-validator");

module.exports = [
  body("name").notEmpty().withMessage("Missing product name"),
  body("category").notEmpty().withMessage("Missing category"),
  body("price")
    .notEmpty()
    .withMessage("Missing price")
    .isNumeric()
    .withMessage("Price must be number"),
  body("count")
    .notEmpty()
    .withMessage("Missing count")
    .isNumeric()
    .withMessage("Count must be number"),
  body("shortDesc").notEmpty().withMessage("Missing short description"),
  body("longDesc").notEmpty().withMessage("Missing long description"),
];
