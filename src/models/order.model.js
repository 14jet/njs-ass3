const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: String,
    ref: "User",
  },
  fullname: String,
  address: String,
  phoneNumber: Number,
  email: String,
  products: [
    {
      productId: {
        type: String,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],
  status: String, // pending | paid
  delivery: String, // waiting for progressing
});

orderSchema.virtual("totalPrice").get(function () {
  return this.products.reduce(
    (prev, cur) => prev + cur.price * cur.quantity,
    0
  );
});

module.exports = mongoose.model("Order", orderSchema);
