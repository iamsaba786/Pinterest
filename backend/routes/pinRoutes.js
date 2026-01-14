import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { uploadPinImage } from "../middlewares/multer.js";
import {
  commentOnePin,
  createPin,
  deleteComment,
  deletePin,
  getAllPins,
  getSinglePin,
  updatePin,
} from "../controllers/pinController.js";

const router = express.Router();

router.post("/new", isAuth, uploadPinImage, createPin);
router.get("/all", isAuth, getAllPins);
router.get("/:id", isAuth, getSinglePin);
router.put("/:id", isAuth, updatePin);
router.delete("/:id", isAuth, deletePin);
router.post("/comment/:id", isAuth, commentOnePin);
router.delete("/comment/:id", isAuth, deleteComment);

export default router;
