const { body } = require("express-validator");
const mongoose = require("mongoose");

module.exports = [
  body("productId")
    .notEmpty()
    .withMessage("Missing productId")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Can not cast productId to ObjectId");
      }
      return true;
    }),
  body("quantity")
    .notEmpty()
    .withMessage("Missing quantity")
    .isNumeric()
    .withMessage("quantity must be number"),
];
