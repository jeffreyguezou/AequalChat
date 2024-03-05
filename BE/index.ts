const express = require("express");
let mongoose = require("mongoose");
const cors = require("cors");
var authRouter = require("./routes/auth.ts");
var path = require("path");

require("dotenv").config();

const auth_controller = require("./controllers/AuthController.ts");

mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);

app.listen(4040);
module.exports = app;
