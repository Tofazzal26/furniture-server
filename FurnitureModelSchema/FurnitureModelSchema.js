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
});

const Product =
  mongoose.models.Product || mongoose.model("product", sellProduct);

module.exports = Product;
