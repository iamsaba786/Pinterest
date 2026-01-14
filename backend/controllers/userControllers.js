import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "cloudinary";
import getDataUrl from "../utils/urlGenerator.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "Already have an account with this email",
    });

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  generateToken(user._id, res);

  res.status(201).json({
    user,
    message: "User Registered",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No user found with this E-mail",
    });

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong password",
    });

  generateToken(user._id, res);

  res.json({
    user,
    message: "User Logged In",
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  res.json(user);
});

export const followAndUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!user)
    return res.status(400).json({
      message: "No user found with this id",
    });

  if (user._id.toString() === loggedInUser._id.toString())
    return res.status(400).json({
      message: "You can't follow yourself",
    });

  if (user.followers.includes(loggedInUser._id)) {
    const indexFollowing = loggedInUser.following.indexOf(user._id);
    const indexFollowers = user.followers.indexOf(loggedInUser._id);

    loggedInUser.following.splice(indexFollowing, 1);
    user.followers.splice(indexFollowers, 1);

    await loggedInUser.save();
    await user.save();

    res.json({
      message: "Successfully, User Unfollowed",
    });
  } else {
    loggedInUser.following.push(user._id);
    user.followers.push(loggedInUser._id);

    await loggedInUser.save();
    await user.save();

    res.json({
      message: "Successfully, User followed",
    });
  }
});

export const logOutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  res.json({
    message: "Successfully, User Log Out",
  });
});

export const updateUserProfile = TryCatch(async (req, res) => {
  const { name, bio } = req.body;
  const file = req.file;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // ✅ Name update
  if (name && name.trim() !== "") {
    user.name = name.trim();
  }

  // ✅ Bio update (THIS WAS MISSING)
  if (bio !== undefined) {
    user.bio = bio.trim();
  }

  // ✅ Profile picture update
  if (file) {
    if (user.profilePic?.id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.id);
    }

    // const fileUrl = getDataUrl(file);
    const cloud = await cloudinary.v2.uploader.upload(file.path, {
      folder: "Pinterest/Avatars",
      width: 150,
      height: 150,
      crop: "fill",
      gravity: "face",
    });

    user.profilePic = {
      id: cloud.public_id,
      url: cloud.secure_url,
    };
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully ✅",
    user,
  });
});
