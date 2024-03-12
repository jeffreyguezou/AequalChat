const express = require("express");
const router = express.Router();
const { upload } = require("../util/multer");

const user_Controller = require("../controllers/UserController.ts");

router.get("/verifyUserProfile", user_Controller.userDetails_verify_get);
router.post("/getUserDetails", user_Controller.login_userDetails_post);
router.get("/getSearchedUsers/:searchTerm", user_Controller.users_search_get);
router.get("/getCurrentUser/:userId", user_Controller.user_detail_get);
router.post(
  "/uploadUserProfile",
  //upload.single("image"),
  user_Controller.uploadUserProfile
);
router.post("/updateUserProfileImg", user_Controller.update_UserProfile_Img);
router.post("/updateUserBio", user_Controller.update_UserProfile_Bio);

module.exports = router;
