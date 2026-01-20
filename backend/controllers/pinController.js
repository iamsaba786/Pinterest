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

  const fileUrl = getDataUrl(file);
  const cloud = await cloudinary.v2.uploader.upload(fileUrl, {
    folder: "Pinterest/Pins",
  });

  await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });
  await redisClient.del("ALL_PINS");

  res.status(201).json({
    message: "Pin Created Successfully",
  });
});

export const getAllPins = TryCatch(async (req, res) => {
  const cachedPins = await redisClient.get("ALL_PINS");

  if (cachedPins) {
    console.log("⚡ Pins from Redis");
    return res.json(JSON.parse(cachedPins));
  }

  const pins = await Pin.find().sort({ createdAt: -1 });

  await redisClient.setEx(
    "ALL_PINS",
    60, //
    JSON.stringify(pins),
  );

  console.log("🐢 Pins from MongoDB");
  res.json(pins);
});

export const getSinglePin = TryCatch(async (req, res) => {
  const key = `PIN_${req.params.id}`;

  const cachedPin = await redisClient.get(key);
  if (cachedPin) {
    return res.json(JSON.parse(cachedPin));
  }

  const pin = await Pin.findById(req.params.id).populate("owner", "-password");

  await redisClient.setEx(key, 60, JSON.stringify(pin));
  res.json(pin);
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

  if (!pin)
    return res.status(400).json({
      message: "No Pin with thid id",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  await cloudinary.v2.uploader.destroy(pin.image.id);

  await pin.deleteOne();

  res.json({
    message: "Pin Deleted",
  });
});

export const updatePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No Pin with this id",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  pin.title = req.body.title;
  pin.pin = req.body.pin;

  await pin.save();

  res.json({
    message: "Pin updated",
  });
});
