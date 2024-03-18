const express = require("express");
let mongoose = require("mongoose");
const cors = require("cors");
var authRouter = require("./routes/auth.ts");
var userRouter = require("./routes/user.ts");
var messagesRouter = require("./routes/messages.ts");
var path = require("path");
const cookieParser = require("cookie-parser");
const ws = require("ws");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Message = require("./models/Message.ts");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

const jwt_secret = process.env.JWT_SECRET;

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/messages", messagesRouter);

const server = app.listen(4040);

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwt_secret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }
  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, sender, text, type } = messageData;

    const messageDoc = await Message.create({
      sender: connection.userId,
      recipient,
      text,
      type,
    });

    [...wss.clients]
      .filter((u) => u.userId === recipient)
      .forEach((c) =>
        c.send(
          JSON.stringify({
            text,
            sender: connection.userId,
            recipient,
            type,
            _id: messageDoc._id,
          })
        )
      );
  });
});

module.exports = app;
