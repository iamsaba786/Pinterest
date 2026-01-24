import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import redisClient from "../utils/redis.js";

export const createPin = TryCatch(async (req, res) => {
  const { title, pin } = req.body;

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  // 1️⃣ Upload image
  const fileUrl = getDataUrl(file);
  const cloud = await cloudinary.v2.uploader.upload(fileUrl, {
    folder: "Pinterest/Pins",
  });

  // 2️⃣ Create pin in DB
  const newPin = await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });

  // 3️⃣  Clear Redis cache (VERY IMPORTANT)
  await redisClient.del("ALL_PINS");
  await redisClient.del(`USER_PINS:${req.user._id}`);

  // 4️⃣ Response
  res.status(201).json({
    message: "Pin Created Successfully",
    pin: newPin,
  });
});

// export const createPin = TryCatch(async (req, res) => {
//   const { title, pin } = req.body;

//   const file = req.file;
//   if (!file) {
//     return res.status(400).json({ message: "File is required" });
//   }

//   const fileUrl = getDataUrl(file);
//   const cloud = await cloudinary.v2.uploader.upload(fileUrl, {
//     folder: "Pinterest/Pins",
//   });

//   await Pin.create({
//     title,
//     pin,
//     image: {
//       id: cloud.public_id,
//       url: cloud.secure_url,
//     },
//     owner: req.user._id,
//   });
//   await redisClient.del("ALL_PINS");

//   res.status(201).json({
//     message: "Pin Created Successfully",
//   });
// });

// export const getAllPins = TryCatch(async (req, res) => {
//   const cachedPins = await redisClient.get("ALL_PINS");

//   if (cachedPins) {
//     console.log("⚡ Pins from Redis");
//     return res.json(JSON.parse(cachedPins));
//   }

//   const pins = await Pin.find().sort({ createdAt: -1 });

//   await redisClient.setEx(
//     "ALL_PINS",
//     60, //
//     JSON.stringify(pins),
//   );

//   console.log("🐢 Pins from MongoDB");
//   res.json(pins);
// });

export const getAllPins = TryCatch(async (req, res) => {
  const cacheKey = "ALL_PINS";

  // 1️⃣ Check Redis cache
  const cachedPins = await redisClient.get(cacheKey);

  if (cachedPins) {
    console.log("⚡ Pins from Redis");
    return res.status(200).json(JSON.parse(cachedPins));
  }

  // 2️⃣ Fetch from MongoDB
  const pins = await Pin.find().sort({ createdAt: -1 });

  // 3️⃣ Store in Redis (cache for 60 sec)
  await redisClient.set(cacheKey, JSON.stringify(pins), "EX", 60);

  console.log("🐢 Pins from MongoDB");
  res.status(200).json(pins);
});

export const getSinglePin = TryCatch(async (req, res) => {
  const cacheKey = `PIN:${req.params.id}`;

  const cachedPin = await redisClient.get(cacheKey);
  if (cachedPin) {
    return res.status(200).json(JSON.parse(cachedPin));
  }

  const pin = await Pin.findById(req.params.id)
    .populate("owner", "-password")
    .lean();

  if (!pin) {
    return res.status(404).json({ message: "Pin not found" });
  }

  await redisClient.set(cacheKey, JSON.stringify(pin), "EX", 120);

  res.status(200).json(pin);
});

export const commentOnePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No Pin with this Id",
    });

  pin.comments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await pin.save();

  res.status(201).json({
    message: "Comment Added",
  });
});

export const deleteComment = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No Pin with thid id",
    });

  if (!req.query.commentId)
    return res.status(400).json({
      message: "Please give comment id",
    });

  const commentIndex = pin.comments.findIndex(
    (item) => item._id.toString() === req.query.commentId.toString(),
  );

  if (commentIndex === -1) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  const comment = pin.comments[commentIndex];

  if (comment.user.toString() === req.user._id.toString()) {
    pin.comments.splice(commentIndex, 1);

    await pin.save();

    return res.json({
      message: "Comment Deleted",
    });
  } else {
    return res.status(403).json({
      message: "You are not owner of this comment",
    });
  }
});

export const deletePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin) {
    return res.status(400).json({
      message: "No Pin with this id",
    });
  }

  if (pin.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  await cloudinary.v2.uploader.destroy(pin.image.id);

  await pin.deleteOne();

  await redisClient.del("ALL_PINS");
  await redisClient.del(`USER_PINS:${req.user._id}`);

  res.json({
    message: "Pin Deleted",
  });
});

export const updatePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin) {
    return res.status(400).json({
      message: "No Pin with this id",
    });
  }

  if (pin.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  pin.title = req.body.title;
  pin.pin = req.body.pin;

  await pin.save();

  await redisClient.del("ALL_PINS");
  await redisClient.del(`USER_PINS:${req.user._id}`);

  res.json({
    message: "Pin updated",
  });
});

export const savePin = TryCatch(async (req, res) => {
  const { Pin } = await import("../models/pinModel.js");
  const { pinId } = req.body;

  const pin = await Pin.findById(pinId);
  if (!pin) return res.status(404).json({ message: "Pin not found" });

  // ❌ creator cannot save own pin
  if (pin.owner.toString() === req.user._id.toString()) {
    return res.status(403).json({ message: "You cannot save your own pin" });
  }

  if (pin.savedBy?.includes(req.user._id)) {
    return res.json({ message: "Already saved" });
  }

  pin.savedBy = pin.savedBy || [];
  pin.savedBy.push(req.user._id);
  await pin.save();

  res.json({ message: "Pin saved successfully" });
});

export const removeSavedPin = TryCatch(async (req, res) => {
  const { Pin } = await import("../models/pinModel.js");
  const { pinId } = req.body;

  await Pin.updateOne({ _id: pinId }, { $pull: { savedBy: req.user._id } });

  res.json({ message: "Pin removed from saved" });
});

export const getSavedPins = TryCatch(async (req, res) => {
  console.log("User in getSavedPins:", req.user);
  const { Pin } = await import("../models/pinModel.js");

  const pins = await Pin.find({
    savedBy: req.user._id,
  }).populate("owner", "name avatar");

  res.json(pins);
});
