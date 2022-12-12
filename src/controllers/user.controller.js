const bcrypt = require("bcrypt");
const config = require("config");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const userServices = require("../services/user.service");
const composeMail = require("../helpers/composeMail");
const mailSender = require("../helpers/mailSender");

module.exports.login = async (req, res, next) => {
  try {
    // validation
    const result = validationResult(req);
    const hasError = !result.isEmpty();
    if (hasError) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("match: ", match);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    req.session.userId = user._id.toString();

    return res
      .status(200)
      .json({ email: user.email, role: user.role, cart: user.cart });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    req.session.destroy();
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    // validation
    const result = validationResult(req);
    const hasError = !result.isEmpty();
    if (hasError) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const { fullname, email, password, phoneNumber } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(
      password,
      config.get("bcryptConfig.saltRound")
    );
    await User.create({
      email,
      fullname,
      phoneNumber,
      password: hash,
    });

    return res.status(200).json({ message: "Registered" });
  } catch (error) {
    next(error);
  }
};

module.exports.addToCart = async (req, res, next) => {
  try {
    // validation
    const result = validationResult(req);
    const hasError = !result.isEmpty();
    if (hasError) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const { productId, quantity } = req.body;
    const user = req.user;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Product Not Found" });
    }

    await user.addToCart({
      productId,
      price: product.price,
      quantity,
    });

    const updatedCart = await userServices.getCart(req.user._id.toString());

    return res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

module.exports.getCart = async (req, res, next) => {
  try {
    const cart = await userServices.getCart(req.user._id.toString());
    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await req.user.removeItemFromCart(productId);
    const cart = await userServices.getCart(req.user._id.toString());
    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports.order = async (req, res, next) => {
  try {
    const user = req.user;
    const { fullname, email, phoneNumber, address } = req.body;

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Failed: your cart is empty" });
    }
    const newOrder = await Order.create({
      user: user._id,
      products: user.cart,
      status: "pending",
      delivery: "waiting for progressing",
      fullname,
      email,
      phoneNumber,
      address,
    });

    user.cart = [];
    await user.save();

    // send mail
    const userInfo = {
      fullname,
      email,
      phoneNumber,
      address,
    };

    const order = await Order.findOne({ _id: newOrder._id }).populate(
      "products.productId"
    );

    const products = order.products.map((item) => ({
      name: item.productId.name,
      image: item.productId.images[0] || "",
      price: item.price,
      quantity: item.quantity,
    }));

    const html = composeMail(userInfo, products);
    mailSender("vuntafx17889@funix.edu.vn", html);

    return res.status(200).json({ message: "Ordered successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.getOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await Order.find({
      user: user._id.toString(),
    }).populate("products.productId");

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports.getSingleOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId }).populate(
      "products.productId"
    );
    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    console.log(order.user, req.user._id.toString());
    if (order.user !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
