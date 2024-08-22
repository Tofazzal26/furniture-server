const mongoose = require("mongoose");

const sellProduct = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const userUploadProduct = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("product", sellProduct);
const Furniture =
  mongoose.models.Furniture ||
  mongoose.model("userFurniture", userUploadProduct);

module.exports = { Product, Furniture };
