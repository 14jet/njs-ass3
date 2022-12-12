const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  price: Number,
  count: Number,
  images: [String],
  shortDesc: String,
  longDesc: String,
  category: String,
  rating: Number,
});

productSchema.index({
  name: "text",
});

module.exports = mongoose.model("Product", productSchema);
