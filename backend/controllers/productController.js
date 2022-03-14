const Product = require("../models/productModel");

// [POST] Create Product -- Admin
exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

// [GET] Get all product
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(200).json({ success: true, products });
};

// [GET] Get product details
exports.getProductDetails = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    product,
  });
};

// [PUT] Update product -- Admin
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
};

// [DELETE] Delete product
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Delete khong thanh cong",
    });
  }
  await Product.deleteOne({ _id: req.params.id }).then(() =>
    res.status(200).json({
      success: true,
      message: "Product Deleted",
    })
  );
};
