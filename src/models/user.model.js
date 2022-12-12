const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: String,
  email: String,
  phoneNumber: String,
  address: String,
  password: String,
  role: {
    // admin, client, supporter
    type: String,
    default: "client",
  },
  cart: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],
});

userSchema.methods.addToCart = function ({ productId, price, quantity }) {
  return new Promise(async (res, rej) => {
    try {
      const existIndex = this.cart.findIndex(
        (item) => item.productId.toString() === productId
      );
      console.log(existIndex);
      if (existIndex === -1) {
        this.cart.push({ productId, price, quantity });
        await this.save();
        return res(this.cart);
      }

      this.cart[existIndex].quantity += quantity;
      if (this.cart[existIndex].quantity === 0) {
        this.cart = this.cart.filter(
          (item) => item.productId.toString() !== productId
        );
      }
      await this.save();
      return res(true);
    } catch (error) {
      return rej(error);
    }
  });
};

userSchema.methods.removeItemFromCart = function (productId) {
  return new Promise(async (res, rej) => {
    try {
      this.cart = this.cart.filter(
        (item) => item.productId.toString() !== productId
      );
      await this.save();
      return res(true);
    } catch (error) {
      return rej(error);
    }
  });
};

module.exports = mongoose.model("User", userSchema);
