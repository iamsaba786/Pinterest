import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";
import morgan from "morgan";
import "./utils/redis.js";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_API,
  api_secret: process.env.Cloud_Secret,
});

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://pinterest-mu-six.vercel.app",
      "http://localhost:5173",
      "https://pinterest-sve7.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB failed, server not starting:", err);
  });
