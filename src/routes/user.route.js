const express = require("express");
const router = express.Router();

// controllers
const userControllers = require("../controllers/user.controller");

// validators
const loginValidator = require("../validators/login.validator");
const registerValidator = require("../validators/register.validator");
const addToCartValidator = require("../validators/addToCart.validator");

// middlewares
const requireAuth = require("../middlewares/requireAuth.middleware");

// routes
router.post("/login", loginValidator, userControllers.login);
router.post("/register", registerValidator, userControllers.register);
router.post(
  "/cart",
  requireAuth,
  addToCartValidator,
  userControllers.addToCart
);

// cart
router.get("/cart", requireAuth, userControllers.getCart);
router.delete("/cart", requireAuth, userControllers.removeFromCart);

// order
router.post("/order", requireAuth, userControllers.order);
router.get("/order", requireAuth, userControllers.getOrders);
router.get("/order/:orderId", requireAuth, userControllers.getSingleOrder);

module.exports = router;
