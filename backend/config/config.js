import dotenv from "dotenv";
import path from "path";
// import { v2 as cloudinary } from "cloudinary";

dotenv.config({
  path: path.join(path.resolve(), "..", ".env"),
});

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUDNAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
