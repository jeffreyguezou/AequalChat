const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/AuthController.ts");

router.post("/generateotp", auth_controller.user_otp_generate);
router.get("/getusers", auth_controller.users_get);
router.post("/register", auth_controller.user_registration_post);
router.post("/login", auth_controller.login_post);

module.exports = router;
