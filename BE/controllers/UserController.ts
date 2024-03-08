const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const jwt_secret = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URL);

exports.userDetails_verify_get = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwt_secret, {}, (err, userData) => {
      if (err) throw err;
      res.json({
        userData,
      });
    });
  } else {
    console.log("No token");
    res.status(401).json("no token");
  }
});

exports.login_userDetails_post = asyncHandler(async (req, res) => {
  const { userName } = req.body;
  console.log(userName);
  const user = await User.findOne({ username: userName });
  if (user) {
    res.json(user);
  }
});

exports.users_search_get = asyncHandler(async (req, res) => {
  const { searchTerm } = req.params;
  console.log(req.params);
  const regex = new RegExp(searchTerm, "i");
  const searchedUsers = await User.find(
    {
      username: { $regex: regex },
    },
    "username _id"
  );
  if (searchedUsers) {
    res.json(searchedUsers);
  }
});
