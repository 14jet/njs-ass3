const config = require("config");
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(config.get("mongodbURI"));
  } catch (error) {
    console.error(error);
  }
};
