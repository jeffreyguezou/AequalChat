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

exports.user_detail_partial_get = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const fetchedUser = await User.findOne(
    {
      _id: userId,
    },
    "username bio profile"
  );
  if (fetchedUser) {
    res.json(fetchedUser);
  }
});

exports.login_userDetails_post = asyncHandler(async (req, res) => {
  const { userName } = req.body;
  console.log({ userName });

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
    res.json("UPDATED BIO");
  }
});

exports.update_UserProfile_Preference = asyncHandler(async (req, res) => {
  const { id, preference } = req.body;

  const update = await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      preferences: preference,
    },
    {
      new: true,
    }
  );
  if (update) {
    res.json("Updated preferences");
  }
});

exports.new_request_Recieved_post = asyncHandler(async (req, res, next) => {
  const { id, reqBy } = req.body;
  let userReq = await getExistingRequests(id);
  let sentReq = await getAlreadySentRequests(reqBy);
  userReq.push(reqBy);
  sentReq.push(id);
  const Recupdate = await User.findOneAndUpdate(
    { _id: id },
    {
      requests: userReq,
    },
    { new: true }
  );
  const sendUpdate = await User.findOneAndUpdate(
    {
      _id: reqBy,
    },
    {
      sentRequests: sentReq,
    },
    {
      new: true,
    }
  );
  if (Recupdate && sendUpdate) {
    res.json("UPDATED REQUESTS IN DB");
  }
});

async function getExistingRequests(id) {
  const userDetails = await User.findOne({ _id: id });
  return userDetails.requests;
}

async function getAlreadySentRequests(id) {
  const userDetails = await User.findOne({ _id: id });
  return userDetails.sentRequests;
}

exports.accept_request_post = asyncHandler(async (req, res) => {
  const { id, acceptedReqID } = req.body;

  //update friends for reciever

  const recieverUpdate = await updateFriendsOnReqAccept(id, acceptedReqID);
  const senderUpdate = await updateFriendsOnReqAccept(acceptedReqID, id); //for sender

  let userReq = await getExistingRequests(id);
  let otherSentReq = await getAlreadySentRequests(acceptedReqID);

  let filteredRequests: string[] = [];
  let filteredSent: string[] = [];

  userReq.forEach((req) => {
    if (!req._id.equals(acceptedReqID)) {
      filteredRequests.push(req._id as string);
    }
  });

  otherSentReq.forEach((req) => {
    if (!req._id.equals(id)) {
      filteredSent.push(req._id as string);
    }
  });

  if (recieverUpdate && senderUpdate) {
    res.json("UPDATED FRIENDS IN DB");
    const deleteAcceptedReq = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        requests: filteredRequests,
      },
      { new: true }
    );
    const deleteSentReqOnAccept = await User.findOneAndUpdate(
      { _id: acceptedReqID },
      { sentRequests: filteredSent },
      {
        new: true,
      }
    );
  }
});

async function updateFriendsOnReqAccept(id, acceptedReqID) {
  let userFriends = await getExistingFriends(id);
  userFriends.friends.push(acceptedReqID);
  const update = await User.findOneAndUpdate(
    { _id: id },
    {
      friends: userFriends.friends,
    },
    { new: true }
  );
  return update;
}

async function getExistingFriends(id) {
  const userFriends = await User.findOne({ _id: id }, "friends");
  return userFriends;
}

exports.unreadMessages_update_post = asyncHandler(async (req, res) => {
  const { recieverID, senderID } = req.body;
  // fetch existing unread
  let { _id, unreadMessages } = await getExistingUnread(recieverID);
  unreadMessages = [...unreadMessages, senderID];
  //update unread messages for reciever
  const updateUnread = await User.findOneAndUpdate(
    { _id: recieverID },
    { unreadMessages: unreadMessages },
    { new: true }
  );
  if (updateUnread) {
    res.json("ok");
    console.log(updateUnread);
  }
});

exports.mark_messagesRead_post = asyncHandler(async (req, res) => {
  const { viewedBy, viewedID } = req.body;
  let { unreadMessages } = await getExistingUnread(viewedBy);
  let newUnread: string[] = [];
  console.log(unreadMessages);
  unreadMessages.forEach((userId) => {
    if (!userId.equals(viewedID)) {
      newUnread.push(userId as string);
    }
  });
  const updateUnread = await User.findOneAndUpdate(
    { _id: viewedBy },
    { unreadMessages: newUnread },
    { new: true }
  );
  if (updateUnread) {
    res.json("ok");
  }
});

async function getExistingUnread(id) {
  const userUnread = await User.findOne({ _id: id }, "unreadMessages");

  return userUnread;
}
