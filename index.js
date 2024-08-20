const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectMongoose = require("./ConnectDB/connectDB");
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
