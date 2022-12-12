const { body } = require("express-validator");
const mongoose = require("mongoose");

module.exports = [
  body("productId")
    .notEmpty()
    .withMessage("Missing productId")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid productId");
      }
      return true;
    }),
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
