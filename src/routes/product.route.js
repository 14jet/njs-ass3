const express = require("express");
const router = express.Router();

// controllers
const productControllers = require("../controllers/product.controller");

// validators
const deleteProductValidator = require("../validators/deleteProduct.validator");
const addNewProductValidator = require("../validators/addNewProduct.validator");
const updateProductValidator = require("../validators/updateProduct.validator");

// middlewares
const requireAdmin = require("../middlewares/requireAdmin.middleware");
const multer = require("../middlewares/multer.middleware");

// routes
router.get("/trending", productControllers.getTrendingProducts);
router.get("/:productId", productControllers.getSingleProduct);
router.get("/related/:productId", productControllers.getRelatedProducts);
router.get("/category/:category", productControllers.getProductsByCategory);
router.get("/", productControllers.getAll);
router
  .route("/")
  .delete(
    requireAdmin,
    deleteProductValidator,
    productControllers.deleteProduct
  )
  .post(
    requireAdmin,
    multer,
    addNewProductValidator,
    productControllers.addNewProduct
  )
  .put(requireAdmin, updateProductValidator, productControllers.updateProduct);

module.exports = router;
