const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxlength: [8, "Price cannot exceed 8 characters"],
    },
    rating: { type: Number, default: 0 },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    categoty: {
      type: String,
      required: [true, "Please enter product category"],
    },
    Stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxlength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    review: [
      {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
