const express = require("express");
const router = express.Router();

const messages_controller = require("../controllers/MessageController.ts");

router.get("/getMessages/:qparams", messages_controller.messages_get);
router.post("/uploadAudioMsg", messages_controller.uploadAudioMsg);

module.exports = router;
