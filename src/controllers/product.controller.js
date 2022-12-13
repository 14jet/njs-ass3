const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const rootDir = require("../helpers/rootDir");
const logger = require("../helpers/logger");

module.exports.getTrendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      $order: {
        rating: -1,
      },
    }).limit(8);

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports.getSingleProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ message: "Can not cast productId to ObjectId" });
    }

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ message: "Can not cast productId to ObjectId" });
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(400).json({ message: "Product Not Found" });
    }
    const relatedProducts = await Product.find({
      category: product.category,
    }).limit(4);

    return res.status(200).json(relatedProducts);
  } catch (error) {
    next(error);
  }
};

module.exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products =
      category === "all"
        ? await Product.find()
        : await Product.find({
            category: category,
          });
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports.searchForProductsByName = async (req, res, next) => {
  try {
    const { query, page, limit } = req.query;
    const products = await Product.find({ $text: query })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Product.find({
      $text: {
        $search: query,
        $language: "none",
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    }).countDocuments();
    const totalPage = Math.ceil(total / limit);
    return res
      .status(200)
      .json({ items: products, total: total, totalPage: totalPage });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  try {
    // validation
    const result = validationResult(req);
    const hasError = !result.isEmpty();
    if (hasError) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const product = await Product.findOne({ _id: req.body.productId });
    if (!product) {
      return res.status(400).json({ message: "Not Found Product" });
    }

    // xóa hình
    const images = product.images;
    if (images.length > 0) {
      images.map((image) =>
        fs.promises
          .unlink(
            path.join(
              rootDir,
              "..",
              "public",
              "images",
              image.replace(`http:\\localhost:5000\\images\\`, "")
            )
          )
          .then()
          .catch((error) => {
            console.error(error);
            logger(error.message);
          })
      );
    }
    await product.remove();
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports.addNewProduct = async (req, res, next) => {
  try {
    // validation
    const result = validationResult(req);
    const hasError = !result.isEmpty();
    if (hasError) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const { name, price, count, category, shortDesc, longDesc } = req.body;

    await Product.create({
      name,
      price,
      count,
      category,
      shortDesc,
      longDesc,
      images: req.files.map(
        (file) => new URL(file.filename, "http://localhost:5000/images/")
      ),
    });

    return res.status(200).json({ message: "Created new product" });
  } catch (error) {
    next(error);
  }
};

module.exports.updateProduct = async (req, res, next) => {
  try {
    // validation
    const result = validationResult(req);
    const hasError = !result.isEmpty();
    if (hasError) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const { productId, name, price, count, category, shortDesc, longDesc } =
      req.body;

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Not Found Product" });
    }

    product.name = name;
    product.price = price;
    product.count = count;
    product.category = category;
    product.shortDesc = shortDesc;
    product.longDesc = longDesc;
    await product.save();
    return res.status(200).json({ message: "Updated product" });
  } catch (error) {
    next(error);
  }
};
