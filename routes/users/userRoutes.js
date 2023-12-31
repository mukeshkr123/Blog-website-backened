const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserId,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} = require("../../controllers/users/userCtrl");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const {
  PhotoUpload,
  profilePhotoResize,
} = require("../../middleware/upload/PhotoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/", authMiddleware, fetchUsersCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.post("/forgot-password-token", forgetPasswordTokenCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/follow", authMiddleware, followingUserCtrl);
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);
userRoutes.put("/verify-account", authMiddleware, accountVerificationCtrl);
userRoutes.put(
  "/profilephoto-upload",
  PhotoUpload.single("image"),
  authMiddleware,
  profilePhotoResize,
  profilePhotoUploadCtrl
);
userRoutes.put("/reset-password", passwordResetCtrl);
userRoutes.put("/unfollow", authMiddleware, unfollowUserId);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);
userRoutes.delete("/:id", deleteUsersCtrl);
userRoutes.get("/:id", fetchUserDetailsCtrl);

module.exports = userRoutes;
