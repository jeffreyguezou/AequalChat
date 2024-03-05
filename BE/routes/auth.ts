const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/AuthController.ts");

router.post("/generateotp", auth_controller.user_otp_generate);
router.post("/register", auth_controller.user_registration_post);

module.exports = router;
