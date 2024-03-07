const express = require("express");
let mongoose = require("mongoose");
const cors = require("cors");
var authRouter = require("./routes/auth.ts");
var userRouter = require("./routes/user.ts");
var path = require("path");
const cookieParser = require("cookie-parser");
const ws = require("ws");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/user", userRouter);

const server = app.listen(4040);

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  console.log("connected");
});

module.exports = app;
