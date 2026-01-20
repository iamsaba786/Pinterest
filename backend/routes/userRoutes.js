import express from "express";
// import multer from "multer";
import { storage, uploadProfilePic } from "../middlewares/multer.js";
import {
  followAndUnfollowUser,
  loginUser,
  logOutUser,
  myProfile,
  registerUser,
  userProfile,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";
// import { uploadProfilePic } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isAuth, logOutUser);
router.get("/me", isAuth, myProfile);
router.get("/:id", isAuth, userProfile);
router.post("/follow/:id", isAuth, followAndUnfollowUser);
router.put("/update", isAuth, uploadProfilePic, updateUserProfile);

export default router;
