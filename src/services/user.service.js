const User = require("../models/user.model");

module.exports.getCart = (userId) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findOne({ _id: userId }).populate(
        "cart.productId",
        "_id images name"
      );

      const cart = user.cart.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.images[0],
        price: item.price,
        quantity: item.quantity,
      }));

      return res(cart);
    } catch (error) {
      return rej(error);
    }
  });
};
