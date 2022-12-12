const { param } = require("express-validator");
const mongoose = require("mongoose");

module.exports = [
  param("productId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid productId");
    }

    return true;
  }),
];
