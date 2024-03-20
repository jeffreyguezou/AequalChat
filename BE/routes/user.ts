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
router.get("/getUserDetails/:userId", user_Controller.user_detail_partial_get);
router.post("/updateUserProfileImg", user_Controller.update_UserProfile_Img);
router.post("/updateUserBio", user_Controller.update_UserProfile_Bio);
router.post("/updateReq", user_Controller.new_request_Recieved_post);
router.post("/acceptReq", user_Controller.accept_request_post);
router.post("/updatePref", user_Controller.update_UserProfile_Preference);

module.exports = router;
