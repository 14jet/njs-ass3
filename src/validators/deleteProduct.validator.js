const { body } = require("express-validator");
const mongoose = require("mongoose");

module.exports = [
  body("productId")
    .notEmpty()
    .withMessage("Misisng productId")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid productId");
      }

      return true;
    }),
];
