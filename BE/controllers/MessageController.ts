const Message = require("../models/Message");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const jwt_secret = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URL);

exports.messages_get = asyncHandler(async (req, res) => {
  const msgParams = req.params;
  let qparams = new URLSearchParams(msgParams.qparams);
  console.log(qparams);
  let current = qparams.get("current");
  let other = qparams.get("other");
  let requiredMsgs = await Message.find({
    type: "message",
    $and: [
      { sender: { $in: [current, other] } },
      { recipient: { $in: [current, other] } },
    ],
  });

  if (requiredMsgs) {
    res.json(requiredMsgs);
  }
});
