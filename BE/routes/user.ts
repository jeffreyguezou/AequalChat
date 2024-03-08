const express = require("express");
const router = express.Router();

const user_Controller = require("../controllers/UserController.ts");

router.get("/verifyUserProfile", user_Controller.userDetails_verify_get);
router.post("/getUserDetails", user_Controller.login_userDetails_post);
router.get("/getSearchedUsers/:searchTerm", user_Controller.users_search_get);

module.exports = router;
