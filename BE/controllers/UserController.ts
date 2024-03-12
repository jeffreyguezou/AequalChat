import { response } from "express";

const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
//const { cloudinary } = require("../util/cloudinary");
const { upload } = require("../util/multer");

const jwt_secret = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URL);

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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

exports.user_detail_get = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUser = await User.findOne({
    _id: userId,
  });
  if (currentUser) {
    res.json(currentUser);
  }
});

exports.login_userDetails_post = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  const user = await User.findOne({ username: userName });
  if (user) {
    res.json(user);
  }
});

exports.users_search_get = asyncHandler(async (req, res) => {
  const { searchTerm } = req.params;
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

exports.uploadUserProfile = asyncHandler(async (req, res, next) => {
  let cloudinaryResponse;
  const { URL } = req.body;

  if (URL) {
    cloudinaryResponse = await cloudinary.uploader.upload(URL, {
      upload_preset: "aechat",
    });
    res.status(200).json({
      status: "success",
      data: {
        imageUrl: cloudinaryResponse?.url,
      },
    });
  }
});

exports.update_UserProfile_Img = asyncHandler(async (req, res, next) => {
  const { id, profile } = req.body;

  const update = await User.findOneAndUpdate(
    { _id: id },
    {
      profile: profile,
    },
    {
      new: true,
    }
  );
  if (update) {
    res.json("UPDATED IMAGE");
  }
});

exports.update_UserProfile_Bio = asyncHandler(async (req, res, next) => {
  const { id, bio } = req.body;

  const update = await User.findOneAndUpdate(
    { _id: id },
    {
      bio: bio,
    },
    {
      new: true,
    }
  );
  if (update) {
    res.json("UPDATED IMAGE");
  }
});
