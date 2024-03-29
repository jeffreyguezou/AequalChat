const User = require("../models/User.ts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
require("dotenv").config();
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp.ts");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwt_secret = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URL);

const emailSender = process.env.EMAIL_SENDER;
const emailPW = process.env.EMAIL_PASSWORD;

exports.user_otp_generate = asyncHandler(async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const { email } = req.body;
  const createdOtp = await Otp.create({
    email,
    otp,
  });

  if (createdOtp) {
    res.json(createdOtp._id);
    sendMail();
  }

  function sendMail() {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: emailSender,
        pass: emailPW,
      },
    });

    var mailOptions = {
      from: emailSender,
      to: email,
      subject: "OTP for registration",
      text: `Your OTP for user registration is ${otp}`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        res.json(err);
      } else {
        res.json(info);
      }
    });
  }
});

exports.user_registration_post = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    friends,
    requests,
    sentRequests,
    preferences,
    unreadMessages,
    bio,
    profile,
  } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
      preferences,
      bio,
      profile,
      friends,
      requests,
      sentRequests,
      unreadMessages,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwt_secret,
      {},
      (err, token) => {
        res.cookie("token", token, { sameSite: "none", secure: true }).json({
          id: createdUser._id,
          username,
        });
      }
    );
    res.json(createdUser);
  } catch (err) {
    if (err) {
      throw err;
    }
  }
});

exports.users_get = asyncHandler(async (req, res) => {
  const allUsers = await User.find().exec();
  res.json(allUsers);
});

exports.latest_otp_get = asyncHandler(async (req, res) => {
  const { otpId } = req.params;
  console.log(req.params);
  const foundOTP = await Otp.findOne({
    _id: otpId,
  });
  if (foundOTP) {
    console.log(foundOTP);
    res.json(foundOTP);
  } else {
    res.json("Some error occured");
  }
});

exports.login_post = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwt_secret,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
            username,
          });
        }
      );
    } else {
      res.json("invalid password");
    }
  } else {
    res.json("No user found");
  }
});

exports.logout_post = asyncHandler(async (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
});
