const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectMongoose = require("./ConnectDB/connectDB");
const {
  Product,
  Furniture,
} = require("./FurnitureModelSchema/FurnitureModelSchema");
require("dotenv").config();
// middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

connectMongoose();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

app.get("/product", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const search = req.query.search;
    const priceRange = parseInt(req.query.price);
    const query = {};
    if (priceRange > 0) {
      query.price = { $lte: priceRange };
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    const result = await Product.find(query)
      .skip(page * size)
      .limit(size);
    res.send(result);
  } catch (error) {
    res.send({
      status: 500,
      message: "There war server error",
      success: false,
    });
  }
});

app.post("/addFurniture", async (req, res) => {
  const product = req.body;
  try {
    const result = await Product.create(product);
    res.send({
      status: 200,
      message: "Data inserted success",
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      status: 500,
      message: "There was server error",
      success: false,
    });
  }
});

app.get("/userProduct/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  try {
    const result = await Product.find(query);
    res.send(result);
  } catch (error) {
    res.send({
      status: 500,
      message: "There was server error",
      success: false,
    });
  }
});

app.delete("/productDelete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  try {
    const result = await Product.findByIdAndDelete(query);
    res.send({
      success: true,
      status: 200,
      message: "Delete Success",
      data: result,
    });
  } catch (error) {
    res.send({
      status: 500,
      message: "There was server error",
      success: false,
    });
  }
});

app.get("/productCount", async (req, res) => {
  try {
    const count = await Product.estimatedDocumentCount();
    res.send({ count });
  } catch (error) {
    res.send({
      status: 500,
      message: "There was server error",
      success: false,
    });
  }
});

app.post("/jwt", async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
      expiresIn: "365d",
    });
    res.cookie("token", token, cookieOptions).send({ success: true });
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    const user = req.body;
    res
      .clearCookie("token", { ...cookieOptions, maxAge: 0 })
      .send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Furniture Is Running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
