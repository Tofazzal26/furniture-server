const mongoose = require("mongoose");

const connectMongoose = async () => {
  const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rgxjhma.mongodb.net/Furniture?retryWrites=true&w=majority&appName=Cluster0`;
  mongoose
    .connect(URI)
    .then((res) => {
      console.log("Mongoose Connect Success");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectMongoose;
