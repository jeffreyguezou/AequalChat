import { json } from "stream/consumers";

const Message = require("../models/Message");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const jwt_secret = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URL);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.uploadAudioMsg = asyncHandler(async (req, res, next) => {
  let cloudinaryResponse;
  const { URL } = req.body;
  if (URL) {
    cloudinaryResponse = await cloudinary.uploader.upload(URL, {
      upload_preset: "aechat",
    });
    if (cloudinaryResponse) {
      console.log(JSON.stringify(cloudinaryResponse));
    }
    res.status(200).json({
      status: "success",
      data: {
        imageUrl: cloudinaryResponse?.url,
      },
    });
  }
});

exports.messages_get = asyncHandler(async (req, res) => {
  const msgParams = req.params;
  let qparams = new URLSearchParams(msgParams.qparams);
  let current = qparams.get("current");
  let other = qparams.get("other");
  let requiredMsgs = await Message.find({
    $or: [{ type: "message" }, { type: "audiomessage" }],
    $and: [
      { sender: { $in: [current, other] } },
      { recipient: { $in: [current, other] } },
    ],
  });

  if (requiredMsgs) {
    res.json(requiredMsgs);
  }
});
