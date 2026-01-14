import multer from "multer";

export const storage = multer.memoryStorage();

export const uploadProfilePic = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("avatar");

export const uploadPinImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");
