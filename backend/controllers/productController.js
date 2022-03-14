const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// [POST] Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// [GET] Get all product
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({ success: true, products });
});

// [GET] Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product no found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// [PUT] Update product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product no found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// [DELETE] Delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product no found", 404));
  }

  await Product.deleteOne({ _id: req.params.id }).then(() =>
    res.status(200).json({
      success: true,
      message: "Product Deleted",
    })
  );
});
